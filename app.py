from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


class ChatRequest(BaseModel):
    room: str
    username: str
    message: str


app = FastAPI()

frontend_dir = Path(__file__).resolve().parents[0] / "frontend"
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

rooms: Dict[str, List[dict[str, str]]] = {}


@app.get("/")
def read_root():
    return FileResponse(frontend_dir / "index.html")


@app.post("/chat")
def chat(data: ChatRequest):
    room = data.room.strip()
    username = data.username.strip()
    user_message = data.message.strip()

    if not room:
        return {"error": "Room ID is required."}
    if not username:
        return {"error": "Name is required."}
    if not user_message:
        return {"error": "Please type something to chat."}

    room_messages = rooms.setdefault(room, [])
    message_item = {
        "id": len(room_messages) + 1,
        "room": room,
        "username": username,
        "message": user_message,
    }
    room_messages.append(message_item)
    return {"success": True, "item": message_item}


@app.get("/messages")
def get_messages(room: str = Query(..., min_length=1)):
    return {"messages": rooms.get(room.strip(), [])}

---
title: D3 Chat
emoji: "💚"
sdk: docker
tags:
  - chat
  - fastapi
  - frontend
  - realtime
  - room-chat
---

# D3 Chat

D3 Chat is a simple room-based chat app built with FastAPI and vanilla JavaScript. Users enter a name and room ID, then chat together in the same room across tabs or devices.

## Features

- Room-based chat with shared messages
- Join by username and room ID
- FastAPI backend with in-memory room storage
- Vanilla JavaScript frontend
- Simple, premium green UI
- Works across tabs or devices while the server is running

## Run locally

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

Open `http://127.0.0.1:8000/` in your browser.

## Deploy to Hugging Face Spaces

1. Create a new Space and choose `Docker` as the runtime.
2. Push this repository to the Space.
3. Hugging Face will build the app using `Dockerfile`.
4. The app will be served from the Space URL.

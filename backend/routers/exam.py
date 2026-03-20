from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.services.video_analysis import VideoAnalyzer
import json
import asyncio

router = APIRouter()
analyzer = VideoAnalyzer()

@router.websocket("/ws/exam")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket Client Connected")
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "frame":
                # Process Frame
                result = analyzer.process_frame(message.get("image"))
                
                # Send back result
                await websocket.send_json(result)
                
    except WebSocketDisconnect:
        print("Client Disconnected")
    except Exception as e:
        print(f"WS Error: {e}")
        await websocket.close()

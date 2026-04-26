from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from backend.services.video_analysis import VideoAnalyzer
from backend.database import get_db, AsyncSessionLocal
from backend.models.models import SuspiciousEvent, ExamSession
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json
import asyncio

router = APIRouter()
analyzer = VideoAnalyzer()

@router.websocket("/ws/exam")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket Client Connected")
    
    # Simple persistence: keep track of the current session in memory for this WS connection
    # In a real app, this would be linked to an authenticated user
    session_id = 1 
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "frame":
                result = analyzer.process_frame(message.get("image"))
                
                # Save to Database if status is suspicious
                if result["status"] not in ["Normal", "Connected", "Monitoring"]:
                    async with AsyncSessionLocal() as db: # Using local factory for async simplicity in WS
                        new_event = SuspiciousEvent(
                            session_id=session_id,
                            event_type=result["status"],
                            confidence=result.get("risk_score", 0) / 100.0
                        )
                        db.add(new_event)
                        await db.commit()
                
                await websocket.send_json(result)
                
    except WebSocketDisconnect:
        print("Client Disconnected")
    except Exception as e:
        print(f"WS Error: {e}")
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()

@router.get("/logs")
async def get_exam_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SuspiciousEvent).order_by(SuspiciousEvent.timestamp.desc()))
    events = result.scalars().all()
    return events

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    
    sessions = relationship("ExamSession", back_populates="student")

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="active") # active, completed, terminated
    risk_score = Column(Float, default=0.0)
    
    student = relationship("Student", back_populates="sessions")
    events = relationship("SuspiciousEvent", back_populates="session")

class SuspiciousEvent(Base):
    __tablename__ = "suspicious_events"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String) # look_away, multiple_faces, noise, no_face
    confidence = Column(Float)
    
    session = relationship("ExamSession", back_populates="events")

# AI Proctoring System for Online Exams

**Developed by: Kaustubh Pandey (CS-23411064) & Vaibhav Raj (CS-23411072)**

A production-grade, multimodal AI-based online exam proctoring system featuring a futuristic UI and real-time behavioral analysis.

## 🚀 Features

- **Frontend**: Next.js 14+, Tailwind CSS, Framer Motion, Three.js support.
- **Backend**: FastAPI, WebSockets, SQLite.
- **AI Engine**: MediaPipe (Face Mesh, Pose) & OpenCV.
- **Core Capabilities**:
  - Real-time Face Detection & Tracking
  - Head Pose Estimation (Gaze Direction)
  - Multiple Person Detection
  - Live Risk Scoring (0-100)
  - Dark Mode, Glassmorphism UI

## 🛠 Tech Stack

- **Frontend**: TypeScript, Next.js, Radix UI (base), Tailwind CSS v4.
- **Backend**: Python 3.11+, FastAPI, Uvicorn, SQLAlchemy.
- **AI**: Google MediaPipe, OpenCV.

## 📦 Setup Instructions

1.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm install framer-motion three @types/three @react-three/fiber @react-three/drei lucide-react clsx tailwind-merge
    ```

3.  **Running the Project**
    - Simply double-click `start_project.bat` in the root directory.
    - OR run manually:
      - Backend: `.\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8001`
      - Frontend: `cd frontend && npm run dev`

4.  **Access**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8001/docs

## ⚠️ Troubleshooting

- **"No space left on device"**: Ensure you have at least 1GB free space for dependencies.
- **"Invalid Version" (npm)**: Try deleting `node_modules` and `package-lock.json` and running `npm install` again.
- **Camera Access**: Allow camera permissions in your browser when prompted.

## 📂 Project Structure

```
/backend
    /models         # Database schemas
    /routers        # API & WebSocket routes
    /services       # AI Logic (MediaPipe)
    main.py         # Entry point
/frontend
    /src/app        # Next.js Pages
    /src/components # React Components (Hero, ExamProctor)
```

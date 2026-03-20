'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Webcam, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

export default function ExamProctor() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isExamRunning, setIsExamRunning] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [riskScore, setRiskScore] = useState(0);
    const [status, setStatus] = useState("Idle");
    const [faceId, setFaceId] = useState("Waiting...");
    const [lastDetection, setLastDetection] = useState<any>(null);
    const [alerts, setAlerts] = useState<{ time: string, msg: string, type: 'warning' | 'critical' }[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    // Start Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    }

    // Draw overlays on a separate canvas
    const drawOverlays = useCallback((data: any) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas || !videoRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sync size
        canvas.width = videoRef.current.clientWidth;
        canvas.height = videoRef.current.clientHeight;
        const scaleX = canvas.width / videoRef.current.videoWidth;
        const scaleY = canvas.height / videoRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data.box) {
            const [x1, y1, x2, y2] = data.box;
            const w = (x2 - x1) * scaleX;
            const h = (y2 - y1) * scaleY;
            const x = x1 * scaleX;
            const y = y1 * scaleY;

            // Draw bounding box
            ctx.strokeStyle = data.risk_score > 50 ? '#ef4444' : '#22d3ee';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);

            // Draw Label
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.fillText(data.face_id || "User", x, y - 10);
            
            if (data.status !== "Normal") {
                ctx.fillStyle = ctx.strokeStyle;
                ctx.font = 'bold 24px Inter, sans-serif';
                ctx.fillText(data.status, x, y - 40);
            }
        }
    }, []);

    // WebSocket Logic
    const startExam = useCallback(() => {
        setIsExamRunning(true);
        setIsSubmitted(false);
        setStatus("Monitoring");
        startCamera();

        const ws = new WebSocket("ws://localhost:8001/ws/exam");
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to Proctoring Server");
            setStatus("Connected");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.risk_score !== undefined) {
                    setRiskScore(data.risk_score || 0);
                    setStatus(data.status || "Normal");
                    setFaceId(data.face_id || "Unknown");
                    setLastDetection(data);
                    drawOverlays(data);

                    if (data.status && data.status !== "Normal" && data.status !== "Connected" && data.status !== "Monitoring") {
                        setAlerts(prev => {
                            const newAlert = { 
                                time: new Date().toLocaleTimeString(), 
                                msg: data.status,
                                type: (data.status.includes('detected') || data.status.includes('Multiple')) ? 'critical' : 'warning'
                            } as const;
                            // Keep last 10 alerts
                            return [newAlert, ...prev].slice(0, 10);
                        });
                    }
                }
            } catch (err) {
                console.error("Error parsing WS message:", err);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket Error:", e);
            setStatus("Connection Error");
        }

        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN && videoRef.current && canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (ctx && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    const frame = canvas.toDataURL('image/jpeg', 0.5);
                    ws.send(JSON.stringify({ type: 'frame', image: frame }));
                }
            }
        }, 500);

        return () => clearInterval(interval);

    }, [drawOverlays]);

    const stopExam = () => {
        setIsExamRunning(false);
        setIsSubmitted(true);
        setStatus("Completed");
        stopCamera();
        wsRef.current?.close();
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto mt-20 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <ShieldCheck className="w-12 h-12 text-green-500" />
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-white mb-4">Exam Session Completed</h2>
                    <p className="text-2xl text-cyan-400 font-medium">Tanmay, Your Exam Has Been Submitted Successfully</p>
                    <p className="text-gray-400 mt-4">Please Contact Teacher For Marks and Final Evaluation.</p>
                </div>
                <div className="pt-8">
                    <Button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-6 rounded-xl">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-black">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-auto object-cover min-h-[400px] ${!isExamRunning && 'opacity-50 grayscale'}`}
                />
                
                {/* Overlay Canvas */}
                <canvas 
                    ref={overlayCanvasRef} 
                    className="absolute inset-0 pointer-events-none w-full h-full"
                />

                {!isExamRunning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gray-500 flex flex-col items-center">
                            <Webcam className="w-16 h-16 mb-4 opacity-50" />
                            <p>Camera is waiting...</p>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isExamRunning ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-xs font-mono font-bold tracking-wider text-white">{isExamRunning ? 'LIVE REC' : 'OFFLINE'}</span>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className={`text-xs font-mono font-bold ${(status || 'Normal').includes('Error') ? 'text-red-500' : 'text-cyan-400'}`}>
                        {(faceId || 'Unknown').toUpperCase()}
                    </span>
                </div>

                {/* Real-time Warning Overlay */}
                {status !== "Normal" && status !== "Idle" && status !== "Connected" && isExamRunning && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-8 py-3 rounded-xl font-bold text-xl flex items-center gap-3 animate-bounce shadow-2xl border border-red-400/50">
                        <AlertTriangle className="w-6 h-6" />
                        Warning: {status}
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Integrity Monitor
                    </h3>

                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * riskScore) / 100}
                                    className={`transition-all duration-1000 ease-out ${riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}
                                />
                            </svg>
                            <div className="absolute text-4xl font-mono font-bold text-white">{riskScore}</div>
                        </div>

                        <div className={`px-4 py-2 rounded-lg border text-sm font-bold uppercase tracking-widest ${riskScore > 50
                                ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                : 'bg-green-500/10 border-green-500/50 text-green-500'
                            }`}>
                            {riskScore > 50 ? 'High Risk Detected' : 'Identity Verified'}
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 text-white">Session Controls</h3>
                    <div className="space-y-3">
                        {!isExamRunning ? (
                            <Button onClick={startExam} className="w-full py-6 text-lg bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/20">
                                Start Proctored Session
                            </Button>
                        ) : (
                            <Button onClick={stopExam} variant="secondary" className="w-full py-6 text-lg bg-red-600/80 hover:bg-red-600 text-white border border-red-500/50">
                                Submit Exam
                            </Button>
                        )}
                    </div>
                </div>

                <div className="glass-panel p-4 rounded-xl min-h-[150px]">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 border-b border-white/5 pb-2">Detection Logs</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {alerts.map((alert, idx) => (
                            <div key={idx} className={`flex items-center gap-2 text-xs p-2 rounded animate-in slide-in-from-right duration-300 ${
                                alert.type === 'critical' ? 'text-red-300 bg-red-500/10' : 'text-yellow-300 bg-yellow-500/10'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                {alert.time} - {alert.msg}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Session Started: {faceId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

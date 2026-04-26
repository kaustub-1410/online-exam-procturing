import cv2
import numpy as np
import base64

# Try importing MediaPipe, but don't crash if it fails
try:
    import mediapipe as mp
    MP_AVAILABLE = True
except (ImportError, AttributeError):
    MP_AVAILABLE = False
    print("Warning: MediaPipe not found or broken. Falling back to OpenCV.")

class VideoAnalyzer:
    def __init__(self):
        self.use_mediapipe = False
        self.reference_face_signature = None
        self.reference_name = "Kaustubh / Vaibhav"
        self.risk_accumulator = 0
        
        if MP_AVAILABLE:
            try:
                print("VideoAnalyzer: Initializing FaceMesh...")
                self.mp_face_mesh = mp.solutions.face_mesh
                self.face_mesh = self.mp_face_mesh.FaceMesh(
                    min_detection_confidence=0.5, 
                    min_tracking_confidence=0.5,
                    refine_landmarks=True
                )
                print("VideoAnalyzer: FaceMesh Initialized")
                self.mp_hands = mp.solutions.hands
                print("VideoAnalyzer: Initializing Hands...")
                self.hands = self.mp_hands.Hands(
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5
                )
                print("VideoAnalyzer: Hands Initialized")
                self.use_mediapipe = True
                print("VideoAnalyzer: MediaPipe Initialized")
            except Exception as e:
                print(f"VideoAnalyzer: MediaPipe Init Failed ({e}). Using OpenCV.")
        
        if not self.use_mediapipe:
            self.face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )

    def process_frame(self, base64_image: str):
        try:
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(base64_image), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return {"risk_score": 0, "status": "Error", "face_id": "Invalid Frame"}

            if self.use_mediapipe:
                return self._process_mediapipe(frame)
            else:
                return self._process_opencv(frame)
                
        except Exception as e:
            print(f"Error processing frame: {e}")
            return {"risk_score": 0, "status": "Processing Error", "face_id": "System Error"}

    def _get_face_signature(self, landmarks, img_w, img_h):
        # Create a simple signature based on relative distances of key landmarks
        # 1: Nose tip, 33: Left eye inner, 263: Right eye inner, 61: Left mouth, 291: Right mouth
        indices = [1, 33, 263, 61, 291, 199]
        points = []
        for idx in indices:
            lm = landmarks.landmark[idx]
            points.append(np.array([lm.x * img_w, lm.y * img_h]))
        
        # Base distance (between eyes)
        base_dist = np.linalg.norm(points[1] - points[2])
        if base_dist == 0: return None
        
        # Signature is distance relative to base_dist
        signature = []
        for i in range(len(points)):
            for j in range(i + 1, len(points)):
                signature.append(np.linalg.norm(points[i] - points[j]) / base_dist)
        
        return np.array(signature)

    def _process_mediapipe(self, frame):
        img_h, img_w, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(frame_rgb)
        
        risk_score = 0
        status = "Normal"
        box = None
        face_id_status = "Unknown"
        
        if results.multi_face_landmarks:
            if len(results.multi_face_landmarks) > 1:
                risk_score = 100
                status = "Multiple Faces Detected"
            else:
                face_landmarks = results.multi_face_landmarks[0]
                
                # Bounding Box for UI
                x_coords = [lm.x * img_w for lm in face_landmarks.landmark]
                y_coords = [lm.y * img_h for lm in face_landmarks.landmark]
                box = [int(min(x_coords)), int(min(y_coords)), int(max(x_coords)), int(max(y_coords))]

                # Face Identification Logic
                current_signature = self._get_face_signature(face_landmarks, img_w, img_h)
                if self.reference_face_signature is None:
                    self.reference_face_signature = current_signature
                    face_id_status = f"Registered: {self.reference_name}"
                else:
                    # Simple Euclidean distance between signatures
                    dist = np.linalg.norm(self.reference_face_signature - current_signature)
                    if dist < 0.3: # Threshold
                        face_id_status = f"Identified: {self.reference_name}"
                    else:
                        face_id_status = "Unknown Identity"
                        risk_score = max(risk_score, 70)

                # Mouth Open Detection
                # 13: Upper lip, 14: Lower lip
                upper_lip = face_landmarks.landmark[13]
                lower_lip = face_landmarks.landmark[14]
                mouth_dist = abs(upper_lip.y - lower_lip.y) * img_h
                
                if mouth_dist > 15: # Threshold for mouth open
                    status = "Mouth Open"
                    risk_score = max(risk_score, 50)

                # Head Pose Estimation Logic (Refined Ratio)
                # Left Eye (avg of 33, 133), Right Eye (avg of 263, 362), Nose Tip (1)
                left_eye_x = (face_landmarks.landmark[33].x + face_landmarks.landmark[133].x) / 2
                right_eye_x = (face_landmarks.landmark[263].x + face_landmarks.landmark[362].x) / 2
                eye_mid_x = (left_eye_x + right_eye_x) / 2
                face_width = right_eye_x - left_eye_x
                
                if face_width > 0:
                    nose_x = face_landmarks.landmark[1].x
                    ratio = (nose_x - eye_mid_x) / face_width
                    
                    if ratio < -0.4: # Shifted Left
                        status = "looking towards left"
                        risk_score = max(risk_score, 80)
                    elif ratio > 0.4: # Shifted Right
                        status = "looking towards Right"
                        risk_score = max(risk_score, 80)
                
                # Hand Proximity (Cell Phone Detection)
                # Process hands separately
                hand_results = self.hands.process(frame_rgb)
                if hand_results.multi_hand_landmarks:
                    for hand_landmarks in hand_results.multi_hand_landmarks:
                        for hl in hand_landmarks.landmark:
                            # Check if any hand landmark is close to face horizontal bounds
                            hx, hy = hl.x * img_w, hl.y * img_h
                            if (box[0] - 20 <= hx <= box[2] + 20) and (box[1] - 20 <= hy <= box[3] + 20):
                                status = "cell phone detected"
                                risk_score = 100
                                break
                        if status == "cell phone detected": break

                # Fallback for identity
                if "Identified" not in face_id_status and risk_score < 70:
                    face_id_status = f"Identified: {self.reference_name}"

        else:
            risk_score = 90
            status = "No Face Detected"

        # Update persistent risk
        if risk_score > 0:
            self.risk_accumulator = min(100, self.risk_accumulator + 5)
        else:
            self.risk_accumulator = max(0, self.risk_accumulator - 1)

        return {
            "risk_score": int(self.risk_accumulator), 
            "status": status, 
            "box": box, 
            "face_id": face_id_status,
            "timestamp": cv2.getTickCount()
        }

    def _process_opencv(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 6, minSize=(100, 100))
        
        if len(faces) == 0:
            return {"risk_score": 90, "status": "No Face Detected", "box": None, "face_id": "None"}
        
        x, y, w, h = faces[0]
        box = [int(x), int(y), int(x+w), int(y+h)]
        
        if len(faces) > 1:
            return {"risk_score": 100, "status": "Multiple Faces", "box": box, "face_id": "Multiple"}
        
        return {"risk_score": 0, "status": "Normal", "box": box, "face_id": "Detected (CV)"}

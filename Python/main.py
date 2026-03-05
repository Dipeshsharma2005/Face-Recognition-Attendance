from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
import uvicorn
import io
import json

app = FastAPI(title="Face Recognition API", version="2.0")

# ------------------------------------
# CORS (allow Spring Boot)
# ------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------
# Health Check
# ------------------------------------
@app.get("/")
async def home():
    return {"message": "Face Recognition API Running on 5001 ✔"}


# ===========================================================
# 1️⃣ ENCODE FACE IMAGE → RETURNS 128-D LIST
# ===========================================================
@app.post("/encode")
async def encode_face(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        img = face_recognition.load_image_file(io.BytesIO(img_bytes))

        locations = face_recognition.face_locations(img)
        if not locations:
            return {"success": False, "message": "NO_FACE"}

        encoding = face_recognition.face_encodings(img)[0]

        return {
            "success": True,
            "encoding": encoding.tolist(),
            "message": "Face encoded successfully"
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


# ===========================================================
# 2️⃣ RECOGNIZE FACE (SPRING SENDS ENCODINGS JSON)
# ===========================================================
@app.post("/recognize")
async def recognize_face(
    file: UploadFile = File(...),
    users: str = Form(...)
):

    try:
        # Load known encodings from Spring Boot
        users_list = json.loads(users)

        if len(users_list) == 0:
            return {"recognized": False, "message": "No known users in DB"}

        known_encodings = [np.array(u["encoding"]) for u in users_list]
        known_emails = [u["email"] for u in users_list]

        # Load uploaded image
        img_bytes = await file.read()
        img = face_recognition.load_image_file(io.BytesIO(img_bytes))

        locations = face_recognition.face_locations(img)
        if not locations:
            return {"recognized": False, "message": "NO_FACE"}

        face_encoding = face_recognition.face_encodings(img)[0]

        # Compare
        results = face_recognition.compare_faces(
            known_encodings,
            face_encoding,
            tolerance=0.45
        )

        distances = face_recognition.face_distance(known_encodings, face_encoding)

        # If matched
        if True in results:
            best_match = int(np.argmin(distances))
            return {
                "recognized": True,
                "email": known_emails[best_match],
                "distance": float(distances[best_match])
            }

        return {
            "recognized": False,
            "message": "NO_MATCH",
            "distances": distances.tolist()
        }

    except Exception as e:
        return {"recognized": False, "error": str(e)}


# ===========================================================
# 3️⃣ COMPARE ENCODINGS DIRECTLY
# ===========================================================
@app.post("/compare")
async def compare_encodings(
    encoding1: str = Form(...),
    encoding2: str = Form(...)
):
    try:
        e1 = np.array(json.loads(encoding1))
        e2 = np.array(json.loads(encoding2))

        distance = np.linalg.norm(e1 - e2)
        match = distance < 0.45

        return {
            "match": match,
            "distance": float(distance)
        }

    except Exception as e:
        return {"error": str(e)}


# ====================================
# RUN SERVER
# ====================================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)

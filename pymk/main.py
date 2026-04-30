from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymk import pymk
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = MongoClient(os.getenv("MONGO_URL"))
db = client["pymk"]
collection = db["user_profiles"]


@app.get("/recommend/{user_id}")
def recommend(user_id: str):

    results = pymk(user_id)

    ids = [int(u) for u, _ in results]

    profiles = list(collection.find({"_id": {"$in": ids}}))

    profile_map = {p["_id"]: p for p in profiles}

    final = []

    for uid, score in results:
        uid_int = int(uid)
        
        if uid_int in profile_map:
            profile = profile_map[uid_int].copy()
            profile.pop("_id", None)

            final.append({
                "user_id": uid,
                "score": round(float(score), 2),
                "profiles": profile
            })

    user_profile=collection.find_one({"_id": int(user_id)})
    if user_profile:
        user_profile.pop("_id", None)

    return {
        "user": user_id,
        "user_profile": user_profile,
        "pymk": final
    }
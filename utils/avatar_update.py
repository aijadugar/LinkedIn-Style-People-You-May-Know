from pymongo import MongoClient, UpdateOne
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["pymk"]
collection = db["user_profiles"]

bulk_updates = []

for user in collection.find({}, {"_id": 1}):
    user_id = user["_id"]

    avatar_id = (user_id % 70) + 1

    bulk_updates.append(
        UpdateOne(
            {"_id": user_id},
            {"$set": {"avatar": f"https://i.pravatar.cc/150?img={avatar_id}"}}
        )
    )

if bulk_updates:
    result = collection.bulk_write(bulk_updates)
    print("Updated:", result.modified_count)

print("Avatar update... done!")
from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

client=MongoClient(os.getenv('MONGO_URL'))
db=client["pymk"]
collection=db["user_profiles"]

findone=collection.find_one({"_id": 12})
print(findone)

ids=[4, 6, 8, 8545, 5334, 48, 6666]
findmany=collection.find({"_id": {"$in": ids}})

print("Find one:", findone)
print()
print("Find many", list(findmany))
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URL')

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["pymk"]
collection = db["users_profiles"]
collection.delete_many({})

try:
    client.admin.command('ping')
    print("Mongoose kicked...!")
    collection.insert_one({"name": "jadugar", "company": "founders office", "connections": "500"})
except Exception as e:
    print(e)
from faker import Faker
from pymongo import MongoClient
import random, os
from dotenv import load_dotenv
load_dotenv()

faker=Faker()

client=MongoClient(os.getenv('MONGO_URL'))
db=client["pymk"]
collection=db["user_profiles"]
collection.delete_many({})

skills_list = [
    "C/C++", "Python", "Javascript", "Blockchain Developer", "Machine Learning", "Backend Development",
    "Frontend Development", "Full-Stack Development", "MERN-Stack Development", "Data Science", "AI", "DevOps",
    "Cloud", "Member of Technical Staff", "Forward Deployed Engineer", "SQL", "Data Engineer", "System Design"
]

user_profiles=10000
profiles = []

for user_id in range(1, user_profiles+1):
    profile = {
        "_id": user_id,
        "user_id": user_id,
        "name": faker.name(),
        "username": faker.user_name(),
        "email": faker.email(),
        "title": faker.job(),
        "company": faker.company(),
        "city": faker.city(),
        "country": faker.country(),
        "bio": faker.text(max_nb_chars=120),
        "skills": random.sample(skills_list, 3),
        "connections": random.randint(50, 500),
        "avatar": f"https://i.pravatar.cc/150?img={user_id}"
    }
    
    profiles.append(profile)

collection.insert_many(profiles)

collection.create_index("_id")
collection.create_index("user_id")

print("setup complete")
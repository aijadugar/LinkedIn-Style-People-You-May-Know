from faker import Faker
import random
import json
import os

fake = Faker()

skills_list = [
    "C/C++", "Python", "Javascript", "Blockchain Developer", "Machine Learning", "Backend Development",
    "Frontend Development", "Full-Stack Development", "MERN-Stack Development", "Data Science", "AI", "DevOps",
    "Cloud", "Member of Technical Staff", "Forward Deployed Engineer", "SQL", "Data Engineer", "System Design"
]

profiles = []

for user_id in range(1, 11):
    profile = {
        "user_id": user_id,
        "name": fake.name(),
        "username": fake.user_name(),
        "email": fake.email(),
        "title": fake.job(),
        "company": fake.company(),
        "city": fake.city(),
        "country": fake.country(),
        "bio": fake.text(max_nb_chars=120),
        "skills": random.sample(skills_list, 3),
        "connections": random.randint(50, 500),
        "avatar": f"https://i.pravatar.cc/150?img={user_id}"
    }
    
    profiles.append(profile)

for p in profiles:
    print(p)
    print()

data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
with open(os.path.join(data_dir, "test_profiles.json"), "w") as f:
    json.dump(profiles, f, indent=2)
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

mongo_uri = os.getenv('MONGO_URI')
print(f"Testing MongoDB connection to: {mongo_uri.split('@')[-1] if mongo_uri else 'None'}")

try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("SUCCESS: MongoDB connection established successfully!")
    
    # Check if the specific database is accessible
    db_name = mongo_uri.split('/')[-1].split('?')[0] or 'college_task_manager'
    db = client[db_name]
    print(f"Database name: {db_name}")
    
    # List collections to verify auth
    collections = db.list_collection_names()
    print(f"Collections in database: {collections}")
    
except Exception as e:
    print(f"ERROR: MongoDB connection failed: {e}")

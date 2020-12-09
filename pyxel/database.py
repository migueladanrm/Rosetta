from pymongo import MongoClient
from gridfs import GridFS
import os

def get_storage_connection() -> GridFS:
    connection = MongoClient(os.environ["PYXEL_MONGO_URL"])
    return GridFS(connection.rosetta)


def get_db_connection():
    pass

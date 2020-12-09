from gridfs import GridFS
from pymongo import MongoClient
import psycopg2
import os

def get_storage_connection() -> GridFS:
    connection = MongoClient(os.environ["PYXEL_MONGO_URL"])
    return GridFS(connection.rosetta)


def get_db_connection():
    return psycopg2.connect(os.environ["PYXEL_POSTGRES_URL"])

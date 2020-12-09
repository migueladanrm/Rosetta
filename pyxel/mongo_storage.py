from bson.objectid import ObjectId
import database
import gridfs


def get_fs_object(id: str) -> gridfs.GridOut:
    try:
        fs = database.get_storage_connection()
        return fs.get(ObjectId(id))
    except:
        return None


def save_fs_object(obj):
    pass

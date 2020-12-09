from bson.objectid import ObjectId
import database
import gridfs
from PIL import Image
import image_utils


def get_fs_object(id: str) -> gridfs.GridOut:
    try:
        fs = database.get_storage_connection()
        return fs.get(ObjectId(id))
    except:
        return None


def save_image(image: Image.Image, filename: str) -> ObjectId:
    fs = database.get_storage_connection()
    saved = fs.put(image_utils.image_to_bytes(image),
                   filename=filename, contentType="image/jpeg")
    return saved

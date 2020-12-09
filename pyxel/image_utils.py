from io import BytesIO
from PIL import Image
import gridfs


def image_to_bytes(image: Image.Image) -> BytesIO:
    byte_array = BytesIO()
    image.save(byte_array, format="JPEG")
    byte_array = byte_array.getvalue()
    return byte_array


def read_image(fs_object: gridfs.GridOut) -> Image.Image:
    return Image.open(BytesIO(fs_object.read()))


def save_image_to_file(image: Image.Image, filename: str):
    image.save(filename)

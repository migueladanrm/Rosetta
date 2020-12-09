import cv2 as cv
from PIL import Image, ImageFilter


def _apply_filter(image: Image.Image, filter) -> Image.Image:
    return image.filter(filter)


def blur(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.BLUR())


def contour(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.CONTOUR())


def detail(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.DETAIL())


def edge_enhance(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.EDGE_ENHANCE())


def edge_enhance_plus(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.EDGE_ENHANCE_MORE())


def emboss(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.EMBOSS())


def find_edges(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.FIND_EDGES())


def sharpen(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.SHARPEN())


def smooth(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.SMOOTH())


def smooth_plus(image: Image.Image) -> Image.Image:
    return _apply_filter(image, ImageFilter.SMOOTH_MORE())


def filter_image(image: Image.Image, filter: str) -> Image.Image:
    filtered_image = None

    if filter == "blur":
        filtered_image = blur(image)
    elif filter == "contour":
        filtered_image = contour(image)
    elif filter == "detail":
        filtered_image = detail(image)
    elif filter == "edge_enhance":
        filtered_image = edge_enhance(image)
    elif filter == "edge_enhance_plus":
        filtered_image = edge_enhance_plus(image)
    elif filter == "emboss":
        filtered_image = emboss(image)
    elif filter == "find_edges":
        filtered_image = find_edges(image)
    elif filter == "sharpen":
        filtered_image = sharpen(image)
    elif filter == "smooth":
        filtered_image = smooth(image)
    elif filter == "smooth_plus":
        filtered_image = smooth_plus(image)

    return filtered_image

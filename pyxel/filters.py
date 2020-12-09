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

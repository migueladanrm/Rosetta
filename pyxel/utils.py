import cv2 as cv


def read_image(path):
    global current_image
    current_image = cv.imread(path)

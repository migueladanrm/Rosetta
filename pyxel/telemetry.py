from datetime import datetime


def log(message: str):
    print("{}\t{}".format(str(datetime.now()), message))

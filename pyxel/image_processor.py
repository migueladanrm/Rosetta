from bson import ObjectId
from database import get_db_connection
from filters import filter_image
from PIL import Image
from telemetry import log
import image_utils
import mongo_storage
import os


def retrieve_assigned_tasks(operation_id: str) -> []:
    log("Recuperando tareas asignadas para la operación actual...")

    tasks = []
    db = get_db_connection()
    cur = db.cursor()

    cur.execute("SELECT id, file_id, filter FROM public.operation_task WHERE operation = %s AND assigned_worker = %s;",
                (operation_id, os.environ["PYXEL_WORKER_ID"]))

    rows = cur.fetchall()

    for row in rows:
        tasks.append(
            {"id": row[0], "file_id": row[1], "filter": row[2].replace("\"", "")})

    cur.close()
    db.close()

    return tasks


def update_assigned_task(task_id: str, output_file_id: str):
    log("Registrando resultados de la tarea...")

    db = get_db_connection()
    cur = db.cursor()
    cur.execute("UPDATE public.operation_task SET finished_at = NOW(), output_file = %s WHERE id = %s;",
                (output_file_id, task_id))

    db.commit()

    cur.close()
    db.close()


def process_image(task: {}) -> (str, Image.Image):
    log("Aplicando filtro '{}'...".format(task["filter"]))

    obj = mongo_storage.get_fs_object(task["file_id"])
    original_image = image_utils.read_image(obj)
    filtered_image = filter_image(original_image, task["filter"])

    return ("{}-{}.jpg".format(obj.filename.replace(".jpg", ""), task["filter"]), filtered_image)


def store_image(filtered_image: Image.Image, filename: str) -> ObjectId:
    log("Almacenando imagen con filtro aplicado...")

    filtered_image_id = mongo_storage.save_image(filtered_image, filename)
    return filtered_image_id


def execute_task(task: {}):
    log("Procesando tarea '{}'...".format(task["id"]))

    filename, filtered_image = process_image(task)
    image_id = store_image(filtered_image, filename)
    update_assigned_task(task["id"], str(image_id))

    log("Tarea finalizada: '{}'.".format(task["id"]))


def run(operation_id: str):
    log("Inicializando ejecución de tareas para la operación '{}'...".format(operation_id))

    tasks = retrieve_assigned_tasks(operation_id)

    log("Se han recuperado las tareas asignadas. Inicializando procesamiento de tareas...")

    for task in tasks:
        execute_task(task)

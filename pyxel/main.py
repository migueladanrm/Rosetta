from pika import BlockingConnection, ConnectionParameters, PlainCredentials
from telemetry import log
import image_processor
import json
import os
import sys

WORKER_ID = os.environ["PYXEL_WORKER_ID"]
RABBITMQ_HOST = os.environ["PYXEL_RABBITMQ_HOST"]
RABBITMQ_PORT = os.environ["PYXEL_RABBITMQ_PORT"]
RABBITMQ_USER = os.environ["PYXEL_RABBITMQ_USER"]
RABBITMQ_PASS = os.environ["PYXEL_RABBITMQ_PASS"]


def main():
    def on_message_receive_callback(channel, method, properties, body):
        log("Mensaje recibido.")
        message = json.loads(body)
        operation = message["operation"]

        image_processor.run(operation)

        log("Todas las tareas asociadas a la operación '{}' han finalizado.".format(operation))

    log("Inicializando conexión a RabbitMQ en '{}:{}'...".format(
        RABBITMQ_HOST, RABBITMQ_PORT))

    connection = BlockingConnection(
        ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS), virtual_host="/"))
    channel = connection.channel()
    channel.exchange_declare(
        exchange="XPyxel-Nodes", exchange_type="direct", durable=True)
    channel.queue_declare(queue=WORKER_ID, durable=True)
    channel.basic_consume(
        queue=WORKER_ID, on_message_callback=on_message_receive_callback, auto_ack=True)

    log("Pyxel [{}] ha iniciado correctamente y está esperando peticiones. Presione [Ctrl]+C para salir...".format(WORKER_ID))

    channel.start_consuming()


log("Inicializando Pyxel. Nodo: {}".format(WORKER_ID))

main()
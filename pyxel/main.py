import pika
import sys
import os


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=os.environ["PYXEL_RABBITMQ_HOST"], port=os.environ["PYXEL_RABBITMQ_PORT"], credentials=pika.PlainCredentials(os.environ["PYXEL_RABBITMQ_USER"], os.environ["PYXEL_RABBITMQ_PASS"]), virtual_host="/"))
    channel = connection.channel()

    channel.queue_declare(queue='pyxel-01', durable=True)

    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)

    channel.basic_consume(
        queue='pyxel-01', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

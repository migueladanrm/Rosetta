# Rosetta
Este repositorio corresponde al segundo proyecto programado para el curso de **Principios de Sistemas Operativos** impartido en el **Tecnológico de Costa Rica** en el II semestre de 2020.

## ¿Qué es?
Rosetta consiste en una aplicación sencilla para la aplicación de filtros a imágenes.
El objetivo del proyecto consiste en hacer uso de conceptos de sistemas distribuidos a través de orquestación de nodos y servidores de colas.

## ¿Cómo desplegar?
Se recomienda desplegar este proyecto con Docker. Siga los siguientes pasos.
1. Agregue un archivo de configuración *.env* en la raíz del proyecto, con la siguiente estructura:
```
# Common
PROJECT_NAME = rosetta

# Mongo
MONGO_USERNAME = ""
MONGO_PASSWORD = ""
MONGO_PORT = 7730

# Postgres
POSTGRES_PASSWORD = ""
POSTGRES_PORT = 5467

# RabbitMQ
RABBITMQ_DEFAULT_USER = ""
RABBITMQ_DEFAULT_PASS = ""
RABBITMQ_PORT = 7720
#RABBITMQ_MANAGEMENT_PORT = 7721

# Server
SERVER_PORT = 7710
SERVER_MONGO_STORAGE_URL = ""
SERVER_RABBITMQ_URL = ""
SERVER_DB_HOST = ""
SERVER_DB_NAME = ""
SERVER_DB_USER = ""
SERVER_DB_PASSWORD =  ""
SERVER_DB_PORT = ""

# Orchestrator
ORCHESTRATOR_RABBITMQ_URL = ""
ORCHESTRATOR_POSTGRES_URL = ""
ORCHESTRATOR_DOCKER_STATS_API = ""

# Pyxel
PYXEL_MONGO_URL = ""
PYXEL_POSTGRES_URL = ""
PYXEL_RABBITMQ_HOST = ""
PYXEL_RABBITMQ_PORT = 7720
PYXEL_RABBITMQ_USER = ""
PYXEL_RABBITMQ_PASS = ""
PYXEL_WORKER_ID_01 = "pyxel-01"
PYXEL_WORKER_ID_02 = "pyxel-02"

# Web app
WEBAPP_PORT = 7700
```
2. Ejecute el siguiente comando:
```
docker-compose --project-name rosetta up -d --build
```

3. El proyecto está listo para usarse.

---
#### Miguel Rivas
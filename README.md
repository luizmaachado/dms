# Distributed Messaging System (DMS)

## Overview

The Distributed Messaging System (DMS) is designed to handle task notifications and processing using RabbitMQ for message queuing, a REST API for task management, and MongoDB for data storage. The system consists of multiple components including an API, an orchestrator, and message queue consumers (`sum` and `mult`).

## Architecture

### Components

1. **API**: The API is responsible for handling HTTP requests, creating tasks, and sending notifications to the message queue.
2. **Orchestrator**: The orchestrator processes messages from the queue, handles task notifications, and updates task statuses.
3. **RabbitMQ**: RabbitMQ is used as the message broker to manage the queue of tasks and notifications.
4. **Consumers**: The `sum` and `mult` consumers process specific tasks from the queue.
5. **MongoDB**: MongoDB is used to store task data.

### API

The API component is built using Express.js and includes the following key files:

- `api/src/controller/taskController.ts`: Handles task creation and sends notifications to the queue.
- `api/src/service/amqpConnection.ts`: Manages the connection to RabbitMQ and sends messages to the queue.

### Orchestrator

The orchestrator component processes messages from the RabbitMQ queue and includes the following key files:

- `orchestrator/src/controller/notificationController.ts`: Handles task notifications, processes messages, and updates task statuses.
- `orchestrator/src/service/amqpConnection.ts`: Manages the connection to RabbitMQ and sends messages to the queue.

### Consumers

The consumers process specific tasks from the RabbitMQ queue. The `sum` consumer handles sum operations, and the `mult` consumer handles multiplication operations.

#### Sum Consumer

- `sum_consumer/src/controller/sumController.ts`: Handles sum task notifications, processes messages, and sends results back to the queue.

#### Mult Consumer

- `mult_consumer/src/controller/multController.ts`: Handles multiplication task notifications, processes messages, and sends results back to the queue.

### MongoDB

MongoDB is used to store task data. It provides a flexible schema and scalability for handling large amounts of data.

### RabbitMQ

RabbitMQ is used to manage the queue of tasks and notifications. It ensures that messages are delivered reliably and in the correct order.

### Architecture Diagram

![Architecture Diagram](architecture_diagram.png)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/luizmaachado/dms.git
    cd dms
    ```

2. Set up environment variables:
    - Create a `.env` file in the [api](http://_vscodecontentref_/1) directory with the following variables:
        ```env
        RABBIT_URL= 'amqp://guest:guest@rabbit:5672'
        MONGO_URL='mongodb://root:root@dmsmongodb/'
        DECIDER_QUEUE_NAME="deciderQueue"
        PORT=8080
        ```

    - Create a `.env` file in the [orchestrator](http://_vscodecontentref_/2) directory with the following variables:
        ```env
        RABBIT_URL='amqp://guest:guest@localhost:5672'
        API_URL="http://localhost:8080/api"
        MONGO_URL='mongodb://root:root@localhost:/'
        CONSUME_QUEUE_NAME="deciderQueue"
        RETURN_QUEUE_NAME="returnQueue"

        ```

    - Create a `.env` file in the [sum_consumer](http://_vscodecontentref_/3) directory with the following variables:
        ```env
        RECEIVING_QUEUE='mult'
        RETURN_QUEUE='returnQueue'
        RABBIT_URL = 'amqp://guest:guest@localhost:5672'

        ```

    - Create a `.env` file in the [mult_consumer](http://_vscodecontentref_/4) directory with the following variables:
        ```env
        RECEIVING_QUEUE='mult'
        RETURN_QUEUE='returnQueue'
        RABBIT_URL = 'amqp://guest:guest@localhost:5672'

        ```

3. Start the services using Docker Compose:
    ```bash
    docker-compose up --build
    ```

## Usage

1. The API server will be available at [http://localhost:8080](http://_vscodecontentref_/5).
2. RabbitMQ management interface will be available at [http://localhost:15672](http://_vscodecontentref_/6).
3. MongoDB will be available at `mongodb://localhost:27017`.

## API Endpoints

### Create a Task

- **POST /task**: Create a new task.
    - Request body:
        ```json
        {
            "title": "Task Title",
            "description": "Task Description",
            "payload": {
                "a": 5,
                "b": 3,
                "c": 2
            }
        }
        ```
    - Response:
        ```json
        {
            "_id": "task_id",
            "title": "Task Title",
            "description": "Task Description",
            "payload": {
                "a": 5,
                "b": 3,
                "c": 2
            },
            "status": "pending"
        }
        ```

### Task Types

1. **sumAndMult**: This task will first execute the sum operation and then the multiplication operation.
    - Example request:
        ```json
        {
            "title": "sumAndMult",
            "description": "Sum and then multiply",
            "payload": {
                "a": 5,
                "b": 3,
                "c": 2
            }
        }
        ```

2. **sum**: This task will execute only the sum operation.
    - Example request:
        ```json
        {
            "title": "sum",
            "description": "Sum only",
            "payload": {
                "a": 5,
                "b": 3
            }
        }
        ```

## Design Decisions

- **RabbitMQ**: Chosen for its reliability and ability to handle high-throughput messaging.
- **Microservices Architecture**: Each component (API, orchestrator, consumers) is designed as a separate service to ensure modularity and scalability.
- **Express.js**: Used for the API due to its simplicity and flexibility.
- **MongoDB**: Chosen for its flexible schema and scalability, making it suitable for handling large amounts of task data.

## Scalability

To scale the system beyond the prototype:
- **Horizontal Scaling**: Deploy multiple instances of the API, orchestrator, and consumers to handle increased load.
- **Load Balancing**: Use a load balancer to distribute incoming requests across multiple instances.
- **Message Queue**: RabbitMQ can be clustered to handle higher message throughput and ensure high availability.
- **Database Sharding**: Implement sharding in MongoDB to distribute data across multiple servers.

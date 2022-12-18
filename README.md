# aws-sqs-node
This repo demonstrate the importance of an architecture designed for each type of scenario. The situation below can generate savings of 60%, according to the AWS Calculator simulation for a transfer demand of up to 10tb per month(https://calculator.aws/)
The first service generates a task in the SQS queue with the bar instructions to be drawn (color, number of times and size) and the second runs the tasks asynchronously and concurrently, as soon as possible.
This kind of approach can be useful for a number of less critical real-life problems where you don't need to maintain a service like RabbitMQ or Kafka and you can adapt the design easily.

* To Run:
- Create a SQS queue on AWS
- Build a .env file with information about queue "QUEUE_URL"
- run producer.js (producer service)
- run draw.js (listener service)

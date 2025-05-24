# Testing Kafka

This project demonstrates basic Kafka functionality using Node.js and the KafkaJS library.

## Prerequisites

- Node.js
- Kafka running locally on port 9092

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the Kafka consumer:
```bash
npm run start:consumer
```

3. In a separate terminal, run the producer:
```bash
npm run start:producer
```

## Structure

- `producer.js`: Sends messages to Kafka
- `consumer.js`: Receives messages from Kafka
- `.env`: Configuration for Kafka connection
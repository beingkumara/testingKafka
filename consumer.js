import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: 'test-consumer',
  brokers: [process.env.KAFKA_BROKERS]
});

const consumer = kafka.consumer({ groupId: 'test-group' });

async function consumeMessages() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString()
        });
      },
    });
  } catch (error) {
    console.error('Error consuming messages:', error);
  }
}

consumeMessages();
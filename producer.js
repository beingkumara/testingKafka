import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: [process.env.KAFKA_BROKERS]
});

const producer = kafka.producer();

async function sendMessage() {
  try {
    await producer.connect();
    
    const message = {
      value: `Hello Kafka! ${new Date().toISOString()}`
    };

    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [message]
    });

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

sendMessage();
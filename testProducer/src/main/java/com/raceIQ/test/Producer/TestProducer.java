package com.raceIQ.test.Producer;
import java.util.Properties;

import org.apache.kafka.clients.producer.*;


public class TestProducer {

    public static void main(String[] args) {
        Properties props = new Properties();
        Producer<String, String> producer;
        String topic = "test-topic";
        props.put("bootstrap.servers", "localhost:9092");
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        producer = new KafkaProducer<>(props);
        for (int i = 0; i < 10; i++) {
            String key = "key - " + i;
            String value = "value - " + i;
            ProducerRecord<String, String> record = new ProducerRecord<>(topic, key, value);
            producer.send(record, new Callback() {
                @Override
                public void onCompletion(RecordMetadata metadata, Exception exception) {
                    if (exception != null) {
                        System.out.println("Error sending message: " + exception.getMessage());
                    } else {
                        System.out.println("Message sent successfully: " + metadata.toString());
                    }
                }
            });
        }
        producer.close();
        System.out.println("Producer closed.");
    }
    


    

}

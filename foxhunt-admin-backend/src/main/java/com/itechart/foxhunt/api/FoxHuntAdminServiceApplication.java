package com.itechart.foxhunt.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {RabbitAutoConfiguration.class})
@EnableScheduling
@EnableFeignClients
public class FoxHuntAdminServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoxHuntAdminServiceApplication.class, args);
    }
}

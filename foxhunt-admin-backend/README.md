# How to run fox-hunt server

## Run locally

### Requirements 
Java 11 <br>
Postgresql 10.12 or above <br>
Maven 3.6.0 or above <br>
PostGIS 2.5 or above <br>

###Steps to run using maven
Create database `foxhunt` in your Postgresql <br>
Move to `fox-hunt-db-admin` <br>
Run mvn `mvn flyway:migrate` <br>
Move to `foxhunt-backend-admin` <br>
Run `mvn clean package spring-boot:run`
 
###Optional
Change credentials and url from the database in `application.yml`  

## Run via docker
Set global variables `POSTGRESQL_USERNAME` and `POSTGRESQL_PASSWORD` <br>
If you use Windows 10 Home! edition, make sure the localhost's are replaced with your docker virtual address <br>
The above mentioned replacement must take place within docker compose as well as the .yaml files <br>
In order to execute tests, the fake database (within docker-compose) is required <br>
When launching the docker-compose on Windows, replace '$PWD' with your real address (e.g. C:/Users/...)<br>
Execute run.sh

## RabbitMq
docker pull rabbitmq:3-management <br>
docker run -d -p 15672:15672 -p 5672:5672 --name rabbit-fox-hunt rabbitmq:3-management <br>
default login is guest guest

# Testing endpoints

Go to `http://localhost:8080/api/v1/admin/swagger-ui` to see swagger


FROM eclipse-temurin:17-jre-alpine

COPY build/libs/foxhunt-backend.jar foxhunt-backend.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "foxhunt-backend.jar"]
FROM adoptopenjdk:11-jre-hotspot

WORKDIR /flyway

COPY src/main/resources/db/migration migration

ENV FLYWAY_VERSION 7.5.0

RUN curl -L https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${FLYWAY_VERSION}/flyway-commandline-${FLYWAY_VERSION}.tar.gz -o flyway-commandline-${FLYWAY_VERSION}.tar.gz \
  && tar -xzf flyway-commandline-${FLYWAY_VERSION}.tar.gz --strip-components=1 \
  && rm flyway-commandline-${FLYWAY_VERSION}.tar.gz

ENV PATH="/flyway:${PATH}"

#'sleep infinity' needed to keep container alive as task is restarted after container exit
CMD ["sh", "-c", "flyway -user=${POSTGRES_USER} -password=${POSTGRES_PASSWORD} -url=jdbc:postgresql://postgis.csb6ldo5uimr.eu-west-3.rds.amazonaws.com:5432/foxhunt -locations=migration migrate ; sleep infinity"]
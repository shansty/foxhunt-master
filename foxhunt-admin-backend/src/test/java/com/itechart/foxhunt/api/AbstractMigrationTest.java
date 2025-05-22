package com.itechart.foxhunt.api;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@SpringBootTest
@ActiveProfiles("test-flyway")
@AutoConfigureWireMock(port = 8082)
public abstract class AbstractMigrationTest {

    public static DockerImageName postgisImageName = DockerImageName
        .parse("postgis/postgis")
        .asCompatibleSubstituteFor("postgres");

    public static final PostgreSQLContainer<?> container;

    static {
        container = new PostgreSQLContainer<>(postgisImageName)
            .withUsername("admin")
            .withPassword("admin")
            .withReuse(true);
    }

    @BeforeAll
    public static void startContainer() {
        container.start();
    }

    @DynamicPropertySource
    public static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("postgres.url", container::getJdbcUrl);
        registry.add("postgres.host", container::getHost);
        registry.add("postgres.port", container::getLivenessCheckPortNumbers);
        registry.add("postgres.database", container::getDatabaseName);
        registry.add("postgres.user", container::getUsername);
        registry.add("postgres.password", container::getPassword);

        registry.add("spring.flyway.url", container::getJdbcUrl);
        registry.add("spring.flyway.user", container::getUsername);
        registry.add("spring.flyway.password", container::getPassword);
    }

}

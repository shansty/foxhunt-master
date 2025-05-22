plugins {
    java
    application
    id("org.springframework.boot") version "2.5.14"
    id("io.spring.dependency-management") version "1.0.14.RELEASE"
    id("com.github.akazver.mapstruct") version "1.0.1"
    id("io.freefair.lombok") version "6.5.1"
    id("org.flywaydb.flyway") version "9.4.0"
    id("co.uzzu.dotenv.gradle") version "2.0.0"
}

springBoot {
    mainClass.set("com.itechart.foxhunt.api.FoxHuntAdminServiceApplication")
}

val database = env.fetch("POSTGRES_DATABASE")
val postgresPort = env.fetch("POSTGRES_PORT")
val postgresHost = env.fetch("POSTGRES_HOST")
val postgresUser = env.fetch("POSTGRES_USER")
val postgresPassword = env.fetch("POSTGRES_PASSWORD")
flyway {
    url = "jdbc:postgresql://$postgresHost:$postgresPort/$database"
    user = postgresUser
    password = postgresPassword
    cleanDisabled = false
    locations = listOf("filesystem:../fox-hunt-db-admin/src/main/resources/db/migration").toTypedArray()
}

subprojects {
    apply(plugin = "java")
    apply(plugin = "org.springframework.boot")
    apply(plugin = "io.spring.dependency-management")
    apply(plugin = "com.github.akazver.mapstruct")
    apply(plugin = "io.freefair.lombok")

    tasks.bootJar { enabled = false }
    tasks.jar { enabled = true }
}

project(":fox-hunt-domain") {
    description = "foxhunt-domain"
}

project(":email-service") {
    description = "foxhunt-email"
    dependencies {
        implementation("org.springframework.boot:spring-boot-starter-mail")
        implementation("org.antlr:stringtemplate:4.0.2")
        implementation("org.springframework.boot:spring-boot-starter-freemarker")
    }
}

allprojects {
    repositories {
        mavenLocal()
        mavenCentral()
        gradlePluginPortal()
    }

    group = "com.itechart.foxhunt"
    version = "1.0-SNAPSHOT"
    java.sourceCompatibility = JavaVersion.VERSION_17
    java.targetCompatibility = JavaVersion.VERSION_17

    dependencies {
        // Spring
        implementation("org.springframework.boot:spring-boot-starter-web")
        implementation("org.springframework.boot:spring-boot-starter-data-jpa")
        implementation("org.springframework.boot:spring-boot-starter-actuator")
        implementation("org.springframework.boot:spring-boot-starter-security")
        implementation("org.springframework.boot:spring-boot-starter-validation")
        implementation("org.springframework.boot:spring-boot-starter-web-services")
        implementation("org.springframework.boot:spring-boot-starter-aop")
        implementation("org.springframework.boot:spring-boot-starter-cache")
        implementation("org.springframework.boot:spring-boot-starter-webflux")
        implementation("org.springdoc:springdoc-openapi-ui:1.6.11")
        implementation("me.paulschwarz:spring-dotenv:2.5.4")
        implementation("org.springframework.boot:spring-boot-starter-amqp")
        implementation("org.springframework.cloud:spring-cloud-starter-contract-stub-runner:3.1.4")
        implementation("org.springframework.cloud:spring-cloud-starter-openfeign:3.0.8") {
            exclude(group = "io.github.openfeign", module = "feign-core")
            exclude(group = "io.github.openfeign", module = "feign-slf4j")
        }
        implementation("io.github.openfeign:feign-core:11.0")
        implementation("io.github.openfeign:feign-slf4j:11.0")

        // Database
        implementation("net.postgis:postgis-jdbc:2021.1.0")
        implementation("com.vladmihalcea:hibernate-types-55:2.19.2")
        implementation("org.hibernate:hibernate-spatial:5.6.11.Final")
        implementation("org.flywaydb:flyway-core:7.7.3")
        runtimeOnly("org.postgresql:postgresql:42.5.0")

        //Jackson
        implementation("com.fasterxml.jackson.core:jackson-databind:2.12.6")
        implementation("org.n52.jackson:jackson-datatype-jts:1.2.10") {
            exclude(group = "com.fasterxml.jackson.core", module = "jackson-databind")
        }
        implementation("com.fasterxml.jackson.module:jackson-module-jaxb-annotations:2.12.6")
        implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.12.6")
        implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:2.12.6")

        // Test
        testImplementation("org.springframework.boot:spring-boot-starter-test")
        testImplementation("org.testcontainers:postgresql:1.17.4")
        testImplementation("org.testcontainers:junit-jupiter:1.17.4")
        testImplementation("org.junit.jupiter:junit-jupiter:5.9.0")
        implementation("org.yaml:snakeyaml:1.32")
        implementation("com.github.javafaker:javafaker:1.0.2") {
            exclude(group = "junit", module = "junit")
            exclude(group = "org.yaml", module = "snakeyaml")
        }
        testImplementation("io.projectreactor:reactor-test:3.5.0")
    }

    mapstruct {
        defaultComponentModel = "spring"
    }

    lombok {
        disableConfig.set(true)
    }

    tasks {
        withType(JavaCompile::class.java) {
            options.encoding = "UTF-8"
            options.compilerArgs.plusAssign("--enable-preview")
            options.isIncremental = true
        }
        withType(Test::class.java) { jvmArgs?.plusAssign("--enable-preview") }
        withType(JavaExec::class.java) { jvmArgs?.plusAssign("--enable-preview") }
        test { useJUnitPlatform() }
    }
}

dependencies {
    implementation(project(":email-service"))
    implementation(project(":fox-hunt-domain"))
}

description = "foxhunt-admin"
tasks {
    bootRun { args = listOf("--spring.profiles.active=local") }
    bootJar { archiveFileName.set("foxhunt-backend.jar") }
    jar { enabled = false }
    bootDistTar { enabled = false }
    distTar { enabled = false }
    bootDistZip { enabled = false }
    distZip { enabled = false }
    bootStartScripts { enabled = false }
    startScripts { enabled = false }
}

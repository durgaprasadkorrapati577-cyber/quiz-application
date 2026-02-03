# Stage 1: Build the JAR with Maven + full JDK
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Cache dependencies first for faster rebuilds
RUN mvn dependency:go-offline -B
COPY src ./src
# Build (skip tests for faster initial deploys; remove -DskipTests later if you want tests)
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime image (only JRE needed)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built JAR — name matches your pom.xml (<artifactId>QuizApp</artifactId> + <version>0.0.1-SNAPSHOT</version>)
COPY --from=build /app/target/QuizApp-0.0.1-SNAPSHOT.jar app.jar

# Render dynamically assigns $PORT (8000–10000 range usually)
# Spring Boot will use it automatically if server.port is not hardcoded
EXPOSE ${PORT:-8081}

# Start the app (this becomes the effective start command on Render)
ENTRYPOINT ["java", "-jar", "app.jar"]

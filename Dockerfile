# Use an official Maven image as the build stage
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and src files to the container
COPY . .

# Build the project using Maven
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as the final stage
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the build stage to the final stage
COPY --from=build /app/target/app-0.0.1-SNAPSHOT.jar ./app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
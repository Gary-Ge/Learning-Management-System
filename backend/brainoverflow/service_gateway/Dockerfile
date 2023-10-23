FROM amazoncorretto:8

MAINTAINER "Bohan Zhang"

WORKDIR /usr/local/target/service_gateway
ADD ./target/service_gateway-0.0.1-SNAPSHOT.jar app.jar
CMD ["java", "-jar", "app.jar"]
EXPOSE 8080
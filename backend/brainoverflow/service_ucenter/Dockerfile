FROM amazoncorretto:8

MAINTAINER "Bohan Zhang"

WORKDIR /usr/local/docker/service_ucenter
ADD ./target/service_ucenter-0.0.1-SNAPSHOT.jar .
CMD ["java", "-jar", "service_ucenter-0.0.1-SNAPSHOT.jar"]
EXPOSE 8080
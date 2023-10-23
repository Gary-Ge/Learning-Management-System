<center><h1>Guidance of Using Backend</h1></center>

## 1. Deploy
There is no need to deploy, download,
install or configure anything. The backend services including
all the data services are already deployed on two cloud servers, and
they are ready to use.

## 2. How to use it
Our backend services are divided into multiple microservices and each of
them has different hostname and port number. To simplify your work, we
provided a "gateway" which would be the universal entrance for all the APIs.
The URL of the gateway is:

- `http://175.45.180.201:10900/`

You can check the API document of all the microservices in the following website:

- `http://175.45.180.201:10900/doc.html`

If you want to call the APIs, just concatenate the URL of the gateway and the url
of the API you want to call. For example, if you want to call the API of
`/service-ucenter/ucenter/login`, you can use the following URL:

- `http://175.45.180.201:10900/service-ucenter/ucenter/login`

Your HTTP request would be forwarded to the corresponding microservice by
the gateway automatically. Please make sure the service name (like `service-ucenter` in the URL above`) in the URL is
correct, the gateway depends on the service name to forward your request.
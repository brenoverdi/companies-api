## Companies API

### This is a project that uses NestJS with Fastify. It is fully made using TypeScript. 

### The design pattern look up to separate the controllers from its service layer and from its entities. Trying to mimic as close as possible to the SOLID principle of design pattern. 

### There is also two middlewares, one is the Logger Middleware, which was made just to see to which route the request goes to and which method is it. The other one is an Auth Middleware that uses JWT tokens to authenticate the user smoothly together with its username and hashed password stored in MongoDB. There is also a Swagger API documentation. 

### The API is made also with Elasticsearch since its database is a 18k company data that possibilities the use of word search in it. You can search the companies using various keywords, such as city, its area of field, name of the company and so on.

### There is also a Dockerfile and a docker-compose.yaml which is used to ease the local development, you just need to run docker-compuse up --build and both the elasticsearch host and the API will be running. 
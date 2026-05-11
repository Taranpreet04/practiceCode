import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: "Node API",
        description: "API Documentation",
    },
    host: "localhost:7000",
    schemes: ["http"],
    tags: [
        {
            name: "Orders",
            description: "Order APIs",
        },
        {
            name: "Customers",
            description: "Customer APIs",
        },
    ],
};

const outputFile = "./swagger-output.json";

const routes = ["./app.js"];

swaggerAutogen()(outputFile, routes, doc);

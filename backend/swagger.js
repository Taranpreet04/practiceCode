import swaggerAutogen from 'swagger-autogen';
import 'dotenv/config';

const doc = {
    info: {
        title: "Node API",
        description: "API Documentation",
    },
    host: new URL(process.env.BACKEND_URL).host,
    schemes: [new URL(process.env.BACKEND_URL).protocol.replace(":", "")],
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

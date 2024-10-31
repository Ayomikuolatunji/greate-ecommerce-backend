const fs = require('fs');
const path = require('path');
const authSwaggerDocument = require("./docs/auth.swagger.json");
const productSwaggerDocument = require("./docs/product.swagger.json");
const orderSwaggerDocument = require("./docs/order.swagger.json");
const carSwaggerDocument = require("./docs/cart.swagger.json");
const overviewSwaggerDocument = require("./docs/overview.swagger.json");
const usersSwaggerDocument = require("./docs/users.swagger.json");

const combinedSwagger = {
  openapi: "3.0.0",
  info: {
    title: "Research AI API Documentation",
    version: "1.0.0",
    description: "API documentation with Swagger"
  },
  paths: {
    ...authSwaggerDocument.paths,
    ...productSwaggerDocument.paths,
    ...orderSwaggerDocument.paths,
    ...carSwaggerDocument.paths,
    ...overviewSwaggerDocument.paths,
    ...usersSwaggerDocument.paths
  }
};

// Log combined paths to verify
console.log("Combined Paths:", JSON.stringify(combinedSwagger.paths, null, 2));

fs.writeFileSync(path.join(__dirname, 'swagger.json'), JSON.stringify(combinedSwagger, null, 2));
console.log('Combined Swagger JSON created successfully.');

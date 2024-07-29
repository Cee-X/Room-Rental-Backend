import swaggerjsdoc from 'swagger-jsdoc';

const options = { 
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Room Rental API',
            version: '1.0.0',
            description: 'This is a simple API for room rental operations',   
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: [{
            bearerAuth: [],
          }],
    },
    apis : ['./src/routes/*.ts', './src/models/*.ts']
}

const swaggerSpec = swaggerjsdoc(options);

export default swaggerSpec;
export const appConfig = {
    port: parseInt(process.env.PORT_UPLOAD, 10) || 8089,
    globalPrefix: 'api',
    corsOptions: {
        origin: [
            '*',
            'http://localhost',
            'http://localhost:3030',
            'https://localhost:3030',
            'http://localhost:5173',
            'file://',
            'https://localhost:4173',
            'http://192.168.63.64:5173',
            'https://192.168.35.150:3030',
            'https://192.168.35.150:8080',
            'http://192.168.63.64:8181', 
            'https://192.168.63.64:8181', 
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'Content-Type'],
        credentials: true,
    },
};

export const appConfig = {
    port: parseInt(process.env.PORT_SOCKET_GATEWAY ?? '4086', 10),
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
        ],
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    },
};

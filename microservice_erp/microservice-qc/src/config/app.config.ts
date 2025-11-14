export const appConfig = {
    port: parseInt(process.env.PORT_API_QC, 10) || 8811,
    globalPrefix: 'api',
    corsOptions: {
        origin: ['http://localhost:3030', 'http://192.168.60.50:3030', 'http://192.168.63.93:3030', 'http://192.168.68.175:3030' , 'http://localhost:3030'],
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    },
};

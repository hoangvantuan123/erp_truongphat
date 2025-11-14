export const appConfig = {
    port: parseInt(process.env.PORT_API_GATEWAY ?? '4086', 10),
    globalPrefix: 'api',
    corsOptions: {
        origin: [
            '*',
            'http://localhost:3030',
            'https://hpm.ierps.vn',
            'https://erpsheet.online',
            'https://about.erpsheet.online',
        ],
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    },
};

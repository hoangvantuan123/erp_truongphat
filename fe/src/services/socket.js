// src/socket.js
import {
    io
} from 'socket.io-client';
import {
    deviceId,
    accessToken
} from './tokenService';

const currentHost = window.location.hostname;
const currentPort = window.location.port;

export let HOST_SOCKET;
let socketConnection = null;

const baseUrl = `${currentHost}${currentPort ? ':' + currentPort : ''}`;

 if (baseUrl === 'truongphat.ierps.vn') {
    HOST_SOCKET = 'https://ws-tp.ierps.vn';
} else {
    HOST_SOCKET = 'http://localhost:8888';
}

export const initSocket = async () => {
    const id = await deviceId();
    const token = await accessToken();
    const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));

    if (!id || !token) {
        return null;
    }

    socketConnection = io(HOST_SOCKET, {
        path: '/connect',
        query: {
            deviceId: `${id}-${userFromLocalStorage?.UserSeq || ''}`,
            authToken: token,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    return socketConnection;
};

export const getSocket = () => socketConnection;
import {
    HOST_API_SERVER_2
} from '../../services'
import {
    accessToken
} from '../../services/tokenService'
const getUserIP = async () => {
    try {
        const res = await fetch("https://api64.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch (error) {
        return "Unknown IP";
    }
};
export const CheckUser = async () => {
    try {
        const token = await accessToken();
        const ip = await getUserIP();

        const response = await fetch(`${HOST_API_SERVER_2}/acc/check-user`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ipAddress: ip,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};
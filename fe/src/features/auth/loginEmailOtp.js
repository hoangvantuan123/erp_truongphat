import {
  HOST_API_SERVER_2
} from "../../services";

export const LoginEmailOTP = async ({
  login,
  password,
  otp,
  tempToken,
  timestamp
}) => {
  try {
    const UserAgent = navigator.userAgent;
    const Platform = navigator.platform;
    const Language = navigator.language;
    const IpAddress = await getUserIP();
    const ScreenResolution = `${window.screen.width}x${window.screen.height}`;
    const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const IsMobile = /Mobi|Android/i.test(UserAgent);
    const DeviceName = getDeviceName(UserAgent);
    const HardwareConcurrency = navigator.hardwareConcurrency || 0;
    const Memory = navigator.deviceMemory || 0;
    const deviceInfo = await getDeviceDetails();
    const location = await getLocation();

    const DeviceId = getOrCreateDeviceId();
    const response = await fetch(`${HOST_API_SERVER_2}/acc/p2/login-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        password,
        otp,
        tempToken,
        timestamp,
        deviceInfo: {
          UserAgent,
          Platform,
          Language,
          IpAddress,
          ScreenResolution,
          Timezone,
          IsMobile,
          DeviceName,
          HardwareConcurrency,
          Memory,
          ...deviceInfo,
          location,
          DeviceId,
        },
      }),
      credentials: 'same-origin',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};


const getUserIP = async () => {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    return "Unknown IP";
  }
};

const getDeviceName = (userAgent) => {
  if (userAgent.includes("Windows NT 11.0")) return "Windows 11";
  if (userAgent.includes("Windows NT 10.0")) return "Windows 10";
  if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
  if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
  if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
  if (userAgent.includes("Windows NT 6.0")) return "Windows Vista";
  if (userAgent.includes("Windows NT 5.1") || userAgent.includes("Windows XP")) return "Windows XP";

  if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X")) {
    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      return "iPhone/iPad";
    }
    return "MacOS";
  }

  if (userAgent.includes("iPhone")) return "iPhone";
  if (userAgent.includes("iPad")) return "iPad";
  if (userAgent.includes("iPod")) return "iPod";

  if (userAgent.includes("Android")) return "Android Device";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Ubuntu")) return "Ubuntu Linux";
  if (userAgent.includes("CrOS")) return "Chrome OS";

  if (userAgent.includes("BlackBerry") || userAgent.includes("BB10")) return "BlackBerry";
  if (userAgent.includes("Windows Phone")) return "Windows Phone";

  return "Unknown Device";
};

const getDeviceDetails = async () => {
  try {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = mediaDevices.filter(device => device.kind === "audioinput").length;
    const videoDevices = mediaDevices.filter(device => device.kind === "videoinput").length;

    return {
      audioDevices,
      videoDevices,
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };
  } catch (error) {
    return {
      audioDevices: "Unknown",
      videoDevices: "Unknown",
      maxTouchPoints: "Unknown",
    };
  }
};

const getLocation = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        latitude: "Unknown",
        longitude: "Unknown"
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({
          latitude: "Permission Denied",
          longitude: "Permission Denied"
        });
      }
    );
  });
};

const getOrCreateDeviceId = () => {
  const key = "device_id";
  let deviceId = getCookie(key);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    setCookie(key, deviceId, 365 * 100);
  }

  return deviceId;
};


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};


const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};
const currentHost = window.location.hostname
const currentPort = window.location.port

export let HOST_API_SERVER_1
export let HOST_API_SERVER_2
export let HOST_API_SERVER_3
export let HOST_API_SERVER_4
export let HOST_API_SERVER_5
export let HOST_API_SERVER_6
export let HOST_API_SERVER_7
export let HOST_API_SERVER_8
export let HOST_API_SERVER_9
export let HOST_API_SERVER_10
export let HOST_API_SERVER_11
export let HOST_API_SERVER_12
export let HOST_API_SERVER_13
export let HOST_API_SERVER_14
export let HOST_API_SERVER_15
export let HOST_API_SERVER_16
export let HOST_API_SERVER_17
export let HOST_API_SERVER_18
export let HOST_API_SERVER_PUBIC
export let HOST_API_SERVER_19

const baseUrl = `${currentHost}${currentPort ? ':' + currentPort : ''}`;
if (baseUrl === '192.168.35.150:3030') {
  HOST_API_SERVER_1 = 'https://192.168.35.150:3030/dev1/api/v1'
  HOST_API_SERVER_2 = 'https://192.168.35.150:3030/dev1/api/v2'
  HOST_API_SERVER_3 = 'https://192.168.35.150:3030/dev1/api/v3'
  HOST_API_SERVER_4 = 'https://192.168.35.150:3030/dev2/v4'
  HOST_API_SERVER_5 = 'https://192.168.35.150:3030/dev2/uploads'
  HOST_API_SERVER_1 = 'https://192.168.35.150:3030/dev1/api/v1'
  HOST_API_SERVER_6 = 'https://192.168.35.150:3030/dev1/api/v5'
  HOST_API_SERVER_7 = 'https://192.168.35.150:3030/dev1/api/v7'
  HOST_API_SERVER_8 = 'https://192.168.35.150:3030/dev2/api'
  HOST_API_SERVER_9 = 'https://192.168.35.150:3030/dev2/c/invoice/'
  HOST_API_SERVER_10 = 'https://192.168.35.150:3030/dev3/api/qrcode?url='
  HOST_API_SERVER_10 = 'https://192.168.35.150:3030/dev3/api/qrcode?url='
  HOST_API_SERVER_11 = 'https://192.168.35.150:3030/dev2/print/file'
  HOST_API_SERVER_12 = 'https://192.168.35.150:3030/dev1/api/v6'

  HOST_API_SERVER_13 = 'https://192.168.35.150:3030/dev1/api/v13'
  HOST_API_SERVER_14 = 'https://192.168.35.150:3030/dev2/public-files'
  HOST_API_SERVER_15 = 'https://192.168.35.150:3030/dev1/api/v8'
  HOST_API_SERVER_16 = 'https://192.168.35.150:3030/dev1/api/v14'
  HOST_API_SERVER_17 = 'https://192.168.35.150:3030/dev1/api/v15'
  HOST_API_SERVER_18 = 'https://192.168.35.150:3030/sv1/api/v18'
  HOST_API_SERVER_PUBIC = 'https://192.168.35.150:3030/dev2'
  HOST_API_SERVER_19 = 'https://192.168.35.150:3030/dev2'
} else if (baseUrl === 'truongphat.ierps.vn') {
  HOST_API_SERVER_1 = 'https://truongphat.ierps.vn/tp1/api/v1'
  HOST_API_SERVER_2 = 'https://truongphat.ierps.vn/tp1/api/v2'
  HOST_API_SERVER_3 = 'https://truongphat.ierps.vn/tp1/api/v3'
  HOST_API_SERVER_4 = 'https://truongphat.ierps.vn/tp2/api/v4'
  HOST_API_SERVER_5 = 'https://truongphat.ierps.vn/tp2/uploads'
  HOST_API_SERVER_1 = 'https://truongphat.ierps.vn/tp1/api/v1'
  HOST_API_SERVER_6 = 'https://truongphat.ierps.vn/tp1/api/v5'
  HOST_API_SERVER_7 = 'https://truongphat.ierps.vn/tp1/api/v7'
  HOST_API_SERVER_8 = 'https://truongphat.ierps.vn/tp2/api'
  HOST_API_SERVER_9 = 'https://truongphat.ierps.vn/tp2/c/invoice/'
  HOST_API_SERVER_10 = 'https://truongphat.ierps.vn/tp3/api/qrcode?url='
  HOST_API_SERVER_10 = 'https://truongphat.ierps.vn/tp3/api/qrcode?url='
  HOST_API_SERVER_11 = 'https://truongphat.ierps.vn/tp2/print/file'
  HOST_API_SERVER_12 = 'https://truongphat.ierps.vn/tp1/api/v6'
  HOST_API_SERVER_13 = 'https://truongphat.ierps.vn/tp1/api/v13'
  HOST_API_SERVER_14 = 'https://truongphat.ierps.vn/tp2/public-files'
  HOST_API_SERVER_15 = 'https://truongphat.ierps.vn/tp1/api/v8'

  HOST_API_SERVER_16 = 'https://truongphat.ierps.vn/tp1/api/v14'
  HOST_API_SERVER_17 = 'https://truongphat.ierps.vn/tp1/api/v15'
  HOST_API_SERVER_18 = 'https://truongphat.ierps.vn/tp1/api/v18'
  HOST_API_SERVER_PUBIC = 'https://truongphat.ierps.vn/tp2/'
  HOST_API_SERVER_19 = 'https://truongphat.ierps.vn/tp2'

} else {
  HOST_API_SERVER_1 = 'http://localhost:8086/api/v1'
  HOST_API_SERVER_2 = 'http://localhost:8086/api/v2'
  HOST_API_SERVER_3 = 'http://localhost:8086/api/v3'
  HOST_API_SERVER_4 = 'http://localhost:5106/v4'
  HOST_API_SERVER_5 = 'http://localhost:5106/uploads'
  HOST_API_SERVER_6 = 'http://localhost:8086/api/v5'
  HOST_API_SERVER_7 = 'http://localhost:8086/api/v7'
  HOST_API_SERVER_8 = 'http://localhost:5106/api'
  HOST_API_SERVER_9 = 'http://localhost:5106/c/invoice/'
  HOST_API_SERVER_10 = 'http://localhost:8098/api/qrcode?url='
  HOST_API_SERVER_11 = 'http://localhost:5106/print/file'
  HOST_API_SERVER_12 = 'http://localhost:8086/api/v6'
  HOST_API_SERVER_13 = 'http://localhost:8086/api/v13'
  HOST_API_SERVER_14 = 'http://localhost:5106/public-files'
  HOST_API_SERVER_15 = 'http://localhost:8086/api/v8'
  HOST_API_SERVER_16 = 'http://localhost:8086/api/v14'
  HOST_API_SERVER_17 = 'http://localhost:8086/api/v15'
  HOST_API_SERVER_18 = 'http://localhost:8086/api/v18'
  HOST_API_SERVER_PUBIC = 'http://localhost:5106'
  HOST_API_SERVER_19 = 'http://localhost:5106'
}
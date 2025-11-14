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
export let HOST_API_SERVER_19

const baseUrl = `${currentHost}${currentPort ? ':' + currentPort : ''}`;
if (baseUrl === 'hpm.ierps.vn') {
  HOST_API_SERVER_1 = 'https://hpm.ierps.vn/dev1/api/v1'
  HOST_API_SERVER_2 = 'https://hpm.ierps.vn/dev1/api/v2'
  HOST_API_SERVER_3 = 'https://hpm.ierps.vn/dev1/api/v3'
  HOST_API_SERVER_4 = 'https://hpm.ierps.vn/dev2/v4'
  HOST_API_SERVER_5 = 'https://hpm.ierps.vn/dev2/uploads'
  HOST_API_SERVER_1 = 'https://hpm.ierps.vn/dev1/api/v1'
  HOST_API_SERVER_6 = 'https://hpm.ierps.vn/dev1/api/v5'
  HOST_API_SERVER_7 = 'https://hpm.ierps.vn/dev1/api/v7'
  HOST_API_SERVER_8 = 'https://hpm.ierps.vn/dev2/api'
  HOST_API_SERVER_9 = 'https://hpm.ierps.vn/dev2/c/invoice/'
  HOST_API_SERVER_10 = 'https://hpm.ierps.vn/dev3/api/qrcode?url='
  HOST_API_SERVER_10 = 'https://hpm.ierps.vn/dev3/api/qrcode?url='
  HOST_API_SERVER_11 = 'https://hpm.ierps.vn/dev2/print/file'
  HOST_API_SERVER_12 = 'https://hpm.ierps.vn/dev1/api/v6'
  HOST_API_SERVER_13 = 'https://hpm.ierps.vn/dev1/api/v13'
  HOST_API_SERVER_14 = 'https://hpm.ierps.vn/dev2/public-files'
  HOST_API_SERVER_15 = 'https://hpm.ierps.vn/dev1/api/v8'
  HOST_API_SERVER_16 = 'https://hpm.ierps.vn/dev1/api/v14'
  HOST_API_SERVER_17 = 'https://hpm.ierps.vn/dev1/api/v15'
  HOST_API_SERVER_18 = 'https://hpm.ierps.vn/dev2/api'
  HOST_API_SERVER_19 = 'https://hpm.ierps.vn/dev2'

} else
if (baseUrl === 'erpsheet.online') {
  HOST_API_SERVER_1 = 'https://about.erpsheet.online/api/v1'
  HOST_API_SERVER_2 = 'https://about.erpsheet.online/api/v2'
  HOST_API_SERVER_3 = 'https://about.erpsheet.online/api/v3'
  HOST_API_SERVER_4 = 'https://about.erpsheet.online/v4'
  HOST_API_SERVER_5 = 'https://about.erpsheet.online/uploads'
  HOST_API_SERVER_1 = 'https://about.erpsheet.online/api/v1'
  HOST_API_SERVER_6 = 'https://about.erpsheet.online/api/v5'
  HOST_API_SERVER_7 = 'https://about.erpsheet.online/api/v7'
  HOST_API_SERVER_8 = 'https://about.erpsheet.online/api'
  HOST_API_SERVER_9 = 'https://about.erpsheet.online/c/invoice/'
  HOST_API_SERVER_10 = 'https://about.erpsheet.online/dev3/api/qrcode?url='
  HOST_API_SERVER_10 = 'https://about.erpsheet.online/dev3/api/qrcode?url='
  HOST_API_SERVER_11 = 'https://about.erpsheet.online/print/file'
  HOST_API_SERVER_12 = 'https://about.erpsheet.online/api/v6'
  HOST_API_SERVER_13 = 'https://about.erpsheet.online/api/v13'
  HOST_API_SERVER_14 = 'https://about.erpsheet.online/public-files'
  HOST_API_SERVER_15 = 'https://about.erpsheet.online/api/v8'
  HOST_API_SERVER_16 = 'https://about.erpsheet.online/api/v14'
  HOST_API_SERVER_17 = 'https://about.erpsheet.online/api/v15'
  HOST_API_SERVER_18 = 'https://about.erpsheet.online/api'
  HOST_API_SERVER_19 = 'https://about.erpsheet.online'

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
  HOST_API_SERVER_18 = 'http://localhost:5106/api'
  HOST_API_SERVER_19 = 'http://localhost:5106'
}
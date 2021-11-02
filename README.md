# Water_Suntech

Water_Suntech은 Nodejs를 기반으로 개발되었으며, 해당 어플리케이션은 센서(Suntech)로부터 물의 탁도(NTU)를 측정하여 Modbus로 부터 전송받아 데이터를 oneM2M 플랫폼에 축적한다.

## version 
1.0.0

## Installation
<div align="center">
<img src="https://user-images.githubusercontent.com/29790334/28315422-497d1300-6bf9-11e7-92c7-a0f82d8b4a29.png" width="400"/>
</div><br/>

- [Node.js](https://nodejs.org/en/)<br/>
Node.js는 오픈 소스 JavaScript 엔진인 크롬 V8에 비동기 이벤트 처리 라이브러리인 libuv를 결합한 플랫폼이다. <br/>
JavaScript로 브라우저 밖에서 서버를 구축하는 등의 코드를 실행할 수 있게 해주는 런타임 환경이다.<br/>
Water_Suntech은 Nodejs LTS14.x을 사용한다.
  https://nodejs.org/en/download/
  
## Configuration
- Water_Suntech 동작시키기 위해 설정해야 하는 것은 conf.js, port, baudrate, setid, modbus data address가 있다.
- Water_Suntech 폴더에 접근후에 아래 명령어를 입력한다.
- 아래 명령어를 입력하게 되면 Water_Suntech 동작에 필요한 모듈이 설치가 된다.
```
 
 npm install
 
```
- oneM2M 플랫폼 연결을 위한 설정은 conf.js에서 한다.
```
var conf = {};
var cse = {};
var ae = {};
var cnt = {};
var noti = {};
//cse config
cse.host = "203.253.128.139";  //CSE HOST IP
cse.port = "7599";             //CSE HTTP PORT
cse.name = "wdc_base";
cse.id = "/wdc_base";
cse.mqttport = "1883";         //CSE MQTT BOROKER PORT

//ae config
ae.name = "kwater-poc";        //AE NAME
ae.id = "SM";                  //AE ID
ae.parent = "/" + cse.name;
ae.appid = "kwater-poc"

cnt.name = 'sensor3';          //CNT NAME
cnt.flexcnt = 'WtqltGnrlMesureIem';  // FLEX CNT NAME
cnt.flexsub = 'WtqltMesureSetup';    // FLEX SUBSCRIPTION NAME

noti.id = 'nodered';                //NOTIFICATION ID

conf.cse = cse;
conf.ae = ae;
conf.cnt = cnt;
conf.noti = noti;
module.exports = conf;
 
```
- app.js에서 MODBUS Serial의 Port와 Baudrate, Setid, Data Address를 설정한다.

```

var waterPortNum = '/dev/ttyUSB0';         // MODEBUS SERIAL PORT
client.connectRTUBuffered(waterPortNum, { baudRate: 9600 }); //MODBUS SERIAL BAUDRATE
client.setID(1);                 // MODBUS SETID
client.readHoldingRegisters(0, 2,....{... // MODBUS DATA ADDRESS
...
}
var delay = 5000;                // Default request time to oneM2M platform 

```

## Running
Nodejs는 아래와 같은 명령어를 통해 실행을 합니다.
```
node app.js
```

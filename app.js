var events = require('events');
var mqtt = require('mqtt');
var util = require('util');
var http = require('http');

global.conf = require('./conf.js');

var wdc = require('./Connector').wdc;
var wdc_base = new wdc();
var event = new events.EventEmitter();
wdc_base.set_wdc_info(conf.cse.host,conf.cse.port,conf.ae.id);

var delay = 5000; //Request time to oneM2M paltform
var reprtActvty=true;
var start_flag = true

var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

var waterPortNum = '/dev/ttyUSB0'; //Modbus serial port

client.connectRTUBuffered(waterPortNum, { baudRate: 9600 }); // Modbus serial connect(port, baudrate)
client.setID(1); //Modbus serial setid 

gethering_value();

var value_data ='';
function gethering_value(){ // Modbus serial  data read 
	if(client.isOpen && start_flag){
        interval_upload(delay);
		start_flag=false
	}
	else{
		setTimeout(get_value,2000);
	}
	setInterval(function() { // Modbus clint 
	    client.readHoldingRegisters(0, 2, function(err, data) {
            var buffer = new ArrayBuffer(4);
            var bytes = new Uint8Array(buffer);
            bytes[0] = data.buffer[2];
            bytes[1] = data.buffer[3];
            bytes[2] = data.buffer[0];
            bytes[3] = data.buffer[1];
        	var view = new DataView(buffer);
            console.log(view.getFloat32(0, false));
    		value_data=view.getFloat32(0, false).toFixed(3);
	    });
	}, 1000);
}



var timerId = '';
function interval_upload(delay){ // send update request to oneM2M platform
    var cnt_path = conf.ae.parent + '/' + conf.ae.name + '/' + conf.cnt.name+ '/' +conf.cnt.flexcnt; //flex_cnt_path
    timerId = setInterval(function(){
      if(value_data !=''){ 
        var cnt_obj = {
            'wat:wqgi':{
            'ntu': Number(value_data)
            }
        };
        var resp = wdc_base.flex_update_cnt(cnt_path, cnt_obj);
        console.log(resp);
      }
  },delay);
}


function init_mqtt_client() {
    var mobius_connectOptions = {
        host: conf.cse.host,
        port: conf.cse.mqttport,
        protocol: "mqtt",
        keepalive: 10,
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 2000,
        connectTimeout: 2000,
        rejectUnauthorized: false
    };
    mqtt_client = mqtt.connect(mobius_connectOptions);
    mqtt_client.on('connect', on_mqtt_connect);
    mqtt_client.on('message', on_mqtt_message_recv);
    console.log("init_mqtt_client!!!");
}



function on_mqtt_connect() {
    var noti_topic = util.format('/oneM2M/req/+/%s/#', conf.noti.id);
    mqtt_client.unsubscribe(noti_topic);
    mqtt_client.subscribe(noti_topic);
    console.log('[mqtt_connect] noti_topic : ' + noti_topic);
}

function on_mqtt_message_recv(topic, message) {
    console.log('receive message from topic: <- ' + topic);
    console.log('receive message: ' + message.toString());
    var topic_arr = topic.split("/");
    if (topic_arr[1] == 'oneM2M' && topic_arr[2] == 'req' && topic_arr[4] == conf.noti.id) {
        var jsonObj = JSON.parse(message.toString());
        if (jsonObj['m2m:rqp'] == null) {
            jsonObj['m2m:rqp'] = jsonObj;
        }
        mqtt_noti_action(jsonObj, function (path_arr, flexObj, rqi, sur) {
            if (flexObj) {
                var rsp_topic = '/oneM2M/resp/' + topic_arr[3] + '/' + topic_arr[4] + '/' + topic_arr[5];

                event.emit('upload', sur, flexObj);

                response_mqtt(rsp_topic, '2001', '', conf.ae.id, rqi, '', topic_arr[5]);
            }
        });
    }
    else {
        console.log('topic is not supported');
    }
}
 

function response_mqtt (rsp_topic, rsc, to, fr, rqi, inpcs) {
    var rsp_message = {};
    rsp_message['m2m:rsp'] = {};
    rsp_message['m2m:rsp'].rsc = rsc;
    rsp_message['m2m:rsp'].to = to;
    rsp_message['m2m:rsp'].fr = fr;
    rsp_message['m2m:rsp'].rqi = rqi;
    rsp_message['m2m:rsp'].pc = inpcs;

    mqtt_client.publish(rsp_topic, JSON.stringify(rsp_message['m2m:rsp']));

    console.log('noti publish -> ' + JSON.stringify(rsp_message));

}


function init_resource(){
    let path = conf.ae.parent + '/' + conf.ae.name+'/'+ conf.cnt.name +'/' + conf.cnt.flexsub; //flex_sub path
    let sub_body = {nu:['mqtt://' + conf.cse.host +'/'+ conf.noti.id + '?ct=json']};
    let sub_obj = {
        'm2m:sub':
            {
                'rn' : "sub_ipe",
                'enc': {'net': [1,3]},
                'nu' : sub_body.nu,
                'nct': 1,
                'exc': 0 
            }
    };
    let sub_path = path +'/'+"sub_ipe";
    let resp_sub = wdc_base.retrieve_sub(sub_path);
    if (resp_sub.code == 200) {
        resp_sub = wdc_base.delete_res(sub_path);
        if (resp_sub.code == 200) {
            resp_sub = wdc_base.create_sub(path, sub_obj);
        }
    }
    else if (resp_sub.code == 404) {
        wdc_base.create_sub(path, sub_obj);
    }
    if(resp_sub.code == 201 || resp_sub.code == 409){
       console.log("SUB_Complete!!");
    }

init_mqtt_client();
}

function parse_sgn(rqi, pc, callback) {
    if(pc.sgn) {
        var nmtype = pc['sgn'] != null ? 'short' : 'long';
        var sgnObj = {};
        var flexObj = {};
        sgnObj = pc['sgn'] != null ? pc['sgn'] : pc['singleNotification'];
        if (nmtype === 'long') {
            console.log('oneM2M spec. define only short name for resource')
        }
        else { // 'short'
            if (sgnObj.nev.sur) {
                if(sgnObj.nev.sur.charAt(0) != '/') {
                    sgnObj.nev.sur = '/' + sgnObj.nev.sur;
                }
                var path_arr = sgnObj.nev.sur.split('/');
            }
            if (sgnObj.nev) {
                if (sgnObj.nev.rep) {
                    flexObj = sgnObj.nev.rep;
                }
                else {
                    console.log('[mqtt_noti_action] rep tag of m2m:sgn.nev is none. m2m:notification format mismatch with oneM2M spec.');
                }
            }
        }
    }
    callback(path_arr, flexObj, rqi);
};

function mqtt_noti_action(jsonObj, callback) {
    if (jsonObj != null) {
        var op = (jsonObj['m2m:rqp']['op'] == null) ? '' : jsonObj['m2m:rqp']['op'];
        var to = (jsonObj['m2m:rqp']['to'] == null) ? '' : jsonObj['m2m:rqp']['to'];
        var fr = (jsonObj['m2m:rqp']['fr'] == null) ? '' : jsonObj['m2m:rqp']['fr'];
        var rqi = (jsonObj['m2m:rqp']['rqi'] == null) ? '' : jsonObj['m2m:rqp']['rqi'];
        var pc = {};
        pc = (jsonObj['m2m:rqp']['pc'] == null) ? {} : jsonObj['m2m:rqp']['pc'];
        if(pc['m2m:sgn']) {
            pc.sgn = {};
            pc.sgn = pc['m2m:sgn'];
            delete pc['m2m:sgn'];
        }
        
        parse_sgn(rqi, pc, function(path_arr, flexObj,rqi){
            if(flexObj) {
                for (const [key, value] of Object.entries(flexObj)) {
                    console.log(key,value);
                    if(path_arr[4] === conf.cnt.flexsub){
                        if(path_arr[3] === conf.cnt.name){ //sensor1
                            delay = Number(value["reprtIntrvl"]+"000");
                            reprtActvty = value["reprtActvty"]; 
                            if(reprtActvty === true){
                                clearInterval(timerId);
                                interval_upload(delay);
                            }
                            else{
                                clearInterval(timerId);
                            }
                        }else{
                            console.log("Not FlexsubData");
                        }
                    }
                    else{
                        console.log("Not FlexsubData");
                    }

                  }
            }
        })
    }
    else {
        console.log('[mqtt_noti_action] message is not noti');
    }
}

setTimeout(init_resource,100);

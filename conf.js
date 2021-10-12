var conf = {};
var cse = {};
var ae = {};
var cnt = {};
var noti = {};
//cse config
cse.host = "203.253.128.139";
cse.port = "7599";
cse.name = "wdc_base";
cse.id = "/wdc_base";
cse.mqttport = "1883";

//ae config
ae.name = "kwater-poc";
ae.id = "SM";
ae.parent = "/" + cse.name;
ae.appid = "kwater-poc"

cnt.name = 'sensor3';
cnt.flexcnt = 'WtqltGnrlMesureIem';
cnt.flexsub = 'WtqltMesureSetup';

noti.id = 'nodered';

conf.cse = cse;
conf.ae = ae;
conf.cnt = cnt;
conf.noti = noti;
module.exports = conf;

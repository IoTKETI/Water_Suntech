/**
 * Created by demo on 2017/2/6.
 */
 var request = require('sync-request');
 var uuid = require('uuid/v1');
 var http = require('http');
 
 exports.wdc = function () {
 
     var server_ip = '';
     var server_port = 7579;
     var ae_id = '';
 
     this.set_wdc_info = function (ip, port, aeid) {
         server_ip = ip;
         server_port = parseInt(port, 10);
 
         if (aeid == undefined) {
             ae_id = 'S';
         } else if (aeid.length == 0) {
             ae_id = 'S';
         } else {
             ae_id = aeid;
         }
     };
 
 
     this.retrieve_cse = function (path) {
 
         var data = null;
 
         try {
             var url = 'http://' + server_ip + ':' + server_port + path;
 
             console.log('retrieve cse: GET -> ' + url);
 
             var resp = request('GET', url, {
                 'headers': {
                     'Accept': 'application/json',
                     'X-M2M-RI': uuid(),
                     'X-M2M-Origin': 'S'
                 }
             });
 
             var status_code = resp.statusCode;
             var str = '';
             try {
                 str = String(resp.getBody());
             } catch (err) {
                 str = String(err.body);
                 //console.error(err);
             }
             var data = {'code': status_code, 'body': str};
 
             console.log('retrieve cse: ' + status_code + ' <- ' + str);
         } catch (exp) {
             console.error(exp);
         }
 
         return data;
     };
 
 
     this.retrieve_ae = function (path) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('retrieve ae: GET -> ' + url);
 
         var resp = request('GET', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id
             }
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('retrieve ae: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
     this.create_ae = function (path, ae) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('create ae: POST -> ' + url);
 
         var resp = request('POST', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id,
                 'Content-Type': 'application/json;ty=2;'
             },
             'body': JSON.stringify(ae)
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('create ae: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
 
     this.retrieve_cnt = function (path) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('retrieve cnt: GET -> ' + url);
 
         var resp = request('GET', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id
             }
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('retrieve cnt: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
 
     this.create_cnt = function (path, cnt) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('create cnt: POST -> ' + url);
 
         var resp = request('POST', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id,
                 'Content-Type': 'application/json;ty=3;'
             },
             'body': JSON.stringify(cnt)
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('create cnt: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
     this.flex_update_cnt = function (path, cnt) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('Update_DATA_FLEX_CNT: PUT -> ' + url);
 
         var resp = request('PUT', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id,
                 'Content-Type': 'application/json'
             },
             'body': JSON.stringify(cnt)
         });
 
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('Update_DATA_FLEX_CNT: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
 
 
     this.retrieve_sub = function (path) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('retrieve sub: GET -> ' + url);
 
         var resp = request('GET', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id
             }
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('retrieve sub: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
 
     this.create_sub = function (path, sub) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('create sub: POST -> ' + url);
 
         var resp = request('POST', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id,
                 'Content-Type': 'application/json;ty=23;'
             },
             'body': JSON.stringify(sub)
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('create sub: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
 
 
     this.create_cin = function (path, cin) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('create cin: POST -> ' + url);
 
         var resp = request('POST', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id,
                 'Content-Type': 'application/json;ty=4;'
             },
             'body': JSON.stringify(cin)
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('create cin: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
     this.delete_res = function (path) {
 
         var url = 'http://' + server_ip + ':' + server_port + path;
 
         console.log('delete resc: DELETE -> ' + url);
 
         var resp = request('DELETE', url, {
             'headers': {
                 'Accept': 'application/json',
                 'X-M2M-RI': uuid(),
                 'X-M2M-Origin': ae_id
             }
         });
 
         var status_code = resp.statusCode;
         var str = '';
         try {
             str = String(resp.getBody());
         } catch (err) {
             str = String(err.body);
             //console.error(err);
         }
         var data = {'code': status_code, 'body': str};
 
         console.log('delete resc: ' + status_code + ' <- ' + str);
 
         return data;
     };
 
 };
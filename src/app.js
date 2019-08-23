var express = require("express");
var ttn = require("ttn");
const Influx = require('influxdb-nodejs');

var app = express();
var appID = "emrp2018";
var accessKey = "ttn-account-v2.1QxS-JvgRkqkBGIOvhbQDnyvBNsyCl75tanbVJARH4U";

const influxClient = new Influx('http://127.0.0.1:8086/TempHumidDIS');

ttn.data(appID, accessKey)
  .then(function(client) {
    console.log("Inside ttn.Data");
    client.on("uplink", function(devID, payload) {
      console.log("uplink received");
      writeTTNData(payload.payload_fields, payload.app_id, payload.dev_id, payload.hardware_serial);
    });
  })
  .catch(function(error) {
    console.error("Error", error);
  });

function writeTTNData (payloadData, appID, devID, hwSerial){
  influxClient.write('dismeasurements')
  .field({
    appId: appID,
    devId: devID,
    hwSerial: hwSerial,
    digital_out: payloadData.digital_out_1,
    humidity: payloadData.relative_humidity_1,
    temperature: payloadData.temperature_1
  })
  .then(() => console.info('write point success'))
  .catch(console.error);
}

var port = 8000;

app.get("/", function(req, res) {
  console.log("rendering home page . . .");
  res.render("home", {});
});

app.listen(port, function() {
  console.log("app listening on port: " + port);
});

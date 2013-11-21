BackboneFactory.define_sequence('sensor', SensorApp.Sensor.SensorModel, function(n) {
  // return {
  //   type: ((n%2) ? "solar" : "wind")
  // }
});

BackboneFactory.define('sensor', SensorApp.Sensor.SensorModel);
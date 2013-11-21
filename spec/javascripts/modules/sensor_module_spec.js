describe("SensorApp.Sensor", function() {
  var module;

  beforeEach(function() {
    module = window.SensorApp.Sensor;
  });

  it("should be available", function() {
    expect(module).toBeDefined();
  });

  describe("SensorApp.Sensor.Controller", function() {
    var methodSpy;

    afterEach(function() {
      methodSpy.restore();
      module.stop();
    });

    describe("starting", function() {
      it("should show the sensor list", function() {
        methodSpy = sinon.spy(SensorApp.Sensor.Controller, "_showSensorList");
        module.start();
        expect(methodSpy).toHaveBeenCalled();
      });

      describe("the sensor list", function() {
        it("should be populated whether there's bootstraped data", function() {
          var sensors = [BackboneFactory.create("sensor"), BackboneFactory.create("sensor")], 
              collection = new module.SensorCollection(sensors),
              options = { models: sensors };

          methodSpy = sinon.spy(SensorApp.Sensor.Controller, "_showSensorList");
          module.start(options);
          expect(methodSpy).toHaveBeenCalledWithExactly(options.models);
        });

        it("should be empty otherwise", function() {
          methodSpy = sinon.spy(SensorApp.Sensor.Controller, "_showSensorList");
          module.start();
          expect(methodSpy).toHaveBeenCalledWith();
        });
      });
      
    });

  });
});

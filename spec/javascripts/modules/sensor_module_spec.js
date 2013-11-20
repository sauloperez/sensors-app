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
      it("should show the sensors list", function() {
        methodSpy = sinon.spy(SensorApp.Sensor.Controller, "_showSensorList");
        module.start();
        expect(methodSpy).toHaveBeenCalled();
      });
    });

  });
});

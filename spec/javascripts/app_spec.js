describe("SensorApp", function() {
  var app = window.SensorApp;

  afterEach(function() {
    Backbone.history.stop();
    app.Sensor.stop();
  });

  it("should be available", function() {
    expect(app).toBeDefined();
  });

  it("should have a header region", function() {
    expect(app.headerRegion).toBeDefined();
  });

  it("should have a main region", function() {
    expect(app.mainRegion).toBeDefined();
  });

  describe("configuration", function() {

    afterEach(function() {
      app.config.bootstrap = true;
    });

    it("should bootstrap data by default", function() {
      expect(app.config.bootstrap).toBe(true);
    });

    it("should allow to disable data bootstraping", function() {
      var data,
          options = { config: { bootstrap: false } };

      app.Sensor.on("start", function(options) {
        data = options;
      });
      app.start(options);
      expect(data.config.bootstrap).toBe(false);
    });
  });

  describe("on start", function() {
    it("should start the Sensor module", function() {
      app.Sensor.stop();
      var methodSpy = sinon.spy(app.Sensor, "start");
      app.start();
      expect(methodSpy).toHaveBeenCalled();
      methodSpy.restore();
    });
  });
});

describe("SensorApp", function() {
  var app;

  beforeEach(function() {
    app = window.SensorApp;
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
      var options = { test: 'a' };
      methodSpy = sinon.spy(app.Sensor, "start")

      app.config.bootstrap = false;
      app.start(options);

      expect(methodSpy).not.toHaveBeenCalledWith(options);
      methodSpy.restore();
    });
  });

  describe("on start", function() {
    it("should start the Sensor module", function() {
      var methodSpy = sinon.spy(app.Sensor, "start");
      app.start();
      expect(methodSpy).toHaveBeenCalled();
      methodSpy.restore();
    });
  });
});

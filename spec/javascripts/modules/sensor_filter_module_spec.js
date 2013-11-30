describe("SensorFilters", function() {
  var module, view, 
      app = SensorApp,
      module = app.SensorFilters;

  beforeEach(function() {
    SpecHelpers.loadRegions(app);

    app.start({
      config: { bootstrap: true },
      models: [BackboneFactory.create("sensor")]
    });

    module.start({ collection: new SensorApp.Sensor.SensorCollection() });
  });

  afterEach(function() {
    module.stop();
  })

  it("should be availabe", function() {
    expect(module).toBeTruthy();
  });

  it("should filter over a collection", function() {
    expect(module.Controller.collection).toBeTruthy();
  });

  it("should trigger the 'sensor:filter:active' event", function() {
    var spy = sinon.spy();
    app.vent.on("sensor:filter:active", spy);
    module.Controller.region.currentView.filterByActive();
    expect(spy).toHaveBeenCalled();
  });

  it("should trigger the 'sensor:filter:inactive' event", function() {
    var spy = sinon.spy();
    app.vent.on("sensor:filter:inactive", spy);
    module.Controller.region.currentView.filterByInactive();
    expect(spy).toHaveBeenCalled();
  });

  it("should trigger the 'sensor:filter:all' event", function() {
    var spy = sinon.spy();
    app.vent.on("sensor:filter:all", spy);
    module.Controller.region.currentView.filterByAll();
    expect(spy).toHaveBeenCalled();
  });
});
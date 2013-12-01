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

  describe("active field filter", function() {
    it("should trigger the 'sensor:filter:active' event passing the value 'true'", function() {
      var assert = false;
      app.vent.on("sensor:filter:active", function(filter) {
        _.each(filter, function(value, attr) {
          assert = (attr === "active" && value === true);
        });
      });
      module.Controller.region.currentView.filterByActive();
      expect(assert).toBe(true);
    });

    it("should trigger the 'sensor:filter:active' event passing the value 'false'", function() {
      var assert = false;
      app.vent.on("sensor:filter:active", function(filter) {
        _.each(filter, function(value, attr) {
          assert = (attr === "active" && value === false);
        });
      });
      module.Controller.region.currentView.filterByInactive();
      expect(assert).toBe(true);
    });
  });

  describe("type field filter", function() {
    it("should trigger the 'sensor:filter:type' event pasing the value 'solar'", function() {
      var assert = false;
      app.vent.on("sensor:filter:type", function(filter) {
        _.each(filter, function(value, attr) {
          assert = (attr === "type" && value === "solar");
        });
      });
      module.Controller.region.currentView.filterBySolar();
      expect(assert).toBe(true);
    });

    it("should trigger the 'sensor:filter:type' event pasing the value 'wind'", function() {
      var assert = false;
      app.vent.on("sensor:filter:type", function(filter) {
        _.each(filter, function(value, attr) {
          assert = (attr === "type" && value === "wind");
        });
      });
      module.Controller.region.currentView.filterByWind();
      expect(assert).toBe(true);
    });
  });

  it("should trigger the 'sensor:filter:all' event", function() {
    var spy = sinon.spy();
    app.vent.on("sensor:filter:all", spy);
    module.Controller.region.currentView.filterByAll();
    expect(spy).toHaveBeenCalled();
  });
});
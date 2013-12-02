describe("SensorMaps", function() {
  var app = SensorApp,
      module = app.SensorMaps;

  beforeEach(function() {
    SpecHelpers.mockGoogleMaps();
  });

  afterEach(function() {
    module.stop();
  });

  it("should be availabe", function() {
    expect(module).toBeTruthy();
  });

  it("should create a map", function() {
    var rm = new Marionette.RegionManager(),
        region = rm.addRegion("fake", "#fake-region"),
        spy = sinon.spy(google.maps, "Map");
    module.start({
      location: [40.0, 40.0],
      region: region
    });
    expect(spy).toHaveBeenCalled();
  });

  it("should attach a marker to the map", function() {
    var rm = new Marionette.RegionManager(),
        region = rm.addRegion("fake", "#fake-region"),
        spy = sinon.spy(Backbone.GoogleMaps, "MarkerView");
    module.start({
      location: [40.0, 40.0],
      region: region
    });
    expect(spy).toHaveBeenCalled();
  });
});
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
        model = new Backbone.Model({latitude: 40, longitude: 40}),
        spy = sinon.spy(google.maps, "Map");
    module.start({
      model: model,
      region: region
    });
    expect(spy).toHaveBeenCalled();
  });

  it("should attach a marker to the map", function() {
    var rm = new Marionette.RegionManager(),
        region = rm.addRegion("fake", "#fake-region"),
        model = new Backbone.Model({latitude: 40, longitude: 40}),
        spy = sinon.spy(Backbone.GoogleMaps, "MarkerView");
    module.start({
      model: model,
      region: region
    });
    expect(spy).toHaveBeenCalled();
  });
});
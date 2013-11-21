describe("SensorApp.SensorViews", function() {
  var module;

  beforeEach(function() {
    module = window.SensorApp.Sensor;
  });

  it("should be available", function() {
    expect(module).toBeDefined();
  });

  describe("SensorApp.SensorViews.SensorLayout", function() {
    var sensorLayout;

    beforeEach(function() {
      sensorLayout = new SensorApp.SensorViews.SensorLayout();
    });

    it("should have a nav region", function() {
      expect(sensorLayout.nav).toBeDefined();
    });

    it("should have a content region", function() {
      expect(sensorLayout.content).toBeDefined();
    });
  });

  describe("SensorApp.SensorViews.SensorPreview", function() {
    var view;

    beforeEach(function() {
      view = new SensorApp.SensorViews.SensorPreview();
      view.render();
    });

    it("should create a li element", function() {
      expect(view.el.nodeName).toEqual('LI');
    });
  });

  describe("SensorApp.SensorViews.SensorListView", function() {
    var view;

    beforeEach(function() {
      view = new SensorApp.SensorViews.SensorListView();
      view.render();
    });

    it("should create a ul element", function() {
      expect(view.el.nodeName).toBe('UL');
    });

    it("should have a 'sensor-list' id", function() {
      expect(view.el.getAttribute('id')).toBe("sensor-list");
    });

    it("should have a 'sensor-list' class", function() {
      expect(view.el.getAttribute('class')).toBe("sensor-list");
    });

    it("should be populated whether a collection is provided", function() {
      var models = [BackboneFactory.create("sensor"), BackboneFactory.create("sensor")],
          colView = new SensorApp.SensorViews.SensorListView({ 
            collection: new SensorApp.Sensor.SensorCollection(models)
          });
      colView.render();
      expect(colView.el.getElementsByClassName('list-item').length).toBeTruthy();
    });
  });

});

describe("SensorApp.Sensor", function() {
  var module;

  beforeEach(function() {
    module = window.SensorApp.Sensor;
  });

  it("should be available", function() {
    expect(module).toBeDefined();
  });

  describe("Controller", function() {

    describe("starting", function() {
      beforeEach(function() {
        module.stop();
      });

      afterEach(function() {
        delete SensorApp.Sensor.Controller.collection;
        module.stop();
      });

      describe("when bootstrap is enabled", function() {

        it("an array of models should be passed in", function() {
          var options = { config: { bootstrap: true } };

          expect(function() {
            module.start(options);
          }).toThrow(new Error("A model array must be specified"));
        });

        it("the sensor collection should be populated", function() {
          var sensors = [BackboneFactory.create("sensor"), BackboneFactory.create("sensor")],
              options = {
                config: { bootstrap: true },
                models: sensors
              };

          module.start(options);
          expect(SensorApp.Sensor.Controller.collection).toBeTruthy();
        });
      });

      describe("when bootstrap is disabled", function() {
        it("the sensor collection should be instanciated empty", function() {
          var options = { config: { bootstrap: false } };
          module.start(options);
          expect(SensorApp.Sensor.Controller.collection).toBeTruthy();
        });
      });
    });

    describe("running", function() {
      var app = SensorApp,
          methodSpy;

      beforeEach(function() {
        methodSpy = sinon.spy(app.Sensor.Controller, 'show');

        // Set up app.mainRegion container
        setFixtures("<div id='main'/>");
        app.mainRegion.$el = $('#main');

        app.start({
          config: { bootstrap: true },
          models: [BackboneFactory.create("sensor")]
        });
        Backbone.history.navigate("", true);
      });

      afterEach(function() {
        methodSpy.restore();
        Backbone.history.navigate("", false);
      });

      describe("on 'sensor:show' event", function() {
        it("should trigger the 'show' route", function() {
          $('.list-item-data').trigger('click');
          expect(methodSpy).toHaveBeenCalled();
        });
      });
    });
  });
});

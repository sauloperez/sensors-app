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
      var methodSpy;

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
        it("the sensor collection should not exist", function() {
          var options = { config: { bootstrap: false } };
          module.start(options);
          expect(SensorApp.Sensor.Controller.collection).toBeFalsy();
        });
      });

    });

  });

  xdescribe("Router", function() {
    var router, methodSpy;

    beforeEach(function() {
      module.start();
      router = new module.Router({
        controller: module.Controller
      });
      router.navigate("elsewhere", { trigger: false });
      if (!Backbone.History.started) {
        Backbone.history.start({ pushState: true });
      }
    });

    afterEach(function() {
      module.stop();
    });

    it('has an "index" route', function () {
        expect(router.appRoutes['']).toEqual('index');
    });

    it('triggers the "index" route', function () {
        methodSpy = sinon.spy(router.options.controller, "index");
        router.navigate('', { trigger: true });
        expect(methodSpy).toHaveBeenCalled();
    });
  });
});

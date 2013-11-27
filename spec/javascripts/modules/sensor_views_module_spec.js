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
      expect(sensorLayout.navRegion).toBeDefined();
    });

    it("should have a content region", function() {
      expect(sensorLayout.contentRegion).toBeDefined();
    });
  });

  describe("SensorApp.SensorViews.SensorPreview", function() {
    var view;

    beforeEach(function() {
      var sensor = BackboneFactory.create("sensor");
      view = new SensorApp.SensorViews.SensorPreview({
        model: sensor
      });
      view.render();
    });

    it("should create a li element", function() {
      expect(view.el.nodeName).toEqual('LI');
    });

    it("should show the sensor id", function() {
      expect(view.el.getElementsByClassName("sensor-id").length).toBe(1);
    });

    it("should show the sensor location", function() {
      expect(view.el.getElementsByClassName("sensor-location").length).toBe(1);
    });

    it("should show the sensor type", function() {
      expect(view.el.getElementsByClassName("sensor-type").length).toBe(1);
    });

    it("should store the id in a data-id attribute", function() {
      var dataId = view.$el.find('.list-item-inner').data('id');
      expect(dataId).toBeTruthy();
    });

    describe("on click in .list-item-data", function() {
      var app = SensorApp;

      beforeEach(function() {
        // Set up app.mainRegion container
        setFixtures("<div id='main'/>");
        app.mainRegion.$el = $('#main');

        app.start({
          config: { bootstrap: true },
          models: [BackboneFactory.create("sensor")]
        });

        // Init the layout and attach it to the DOM
        Backbone.history.navigate("elsewhere", false);
        app.Sensor.Controller._initlayout();
        Backbone.history.navigate("", true);
      });

      afterEach(function() {
        Backbone.history.navigate("", false);
      });

      it("should trigger a 'sensor:show' event", function() {
        var spy = sinon.spy();
        app.vent.on('sensor:show', spy);
        $('.list-item-data').trigger('click');
        expect(spy).toHaveBeenCalled();
      });
    });

    describe("on click in .delete", function() {
      var view,
          app = SensorApp,
          stub = sinon.stub(Backbone.Model.prototype, 'destroy');

      beforeEach(function() {
        // Set up app.mainRegion container
        setFixtures("<div id='main'/>");
        app.mainRegion.$el = $('#main');

        app.start({
          config: { bootstrap: true },
          models: [BackboneFactory.create("sensor")]
        });

        // Init the layout and attach it to the DOM
        Backbone.history.navigate("elsewhere", false);
        app.Sensor.Controller._initlayout();
        Backbone.history.navigate("", true);

        $('.sensor-list-item .delete').trigger('click');
      });

      afterEach(function() {
        Backbone.history.navigate("", false);
      });

      it("should remove the view model", function() {
        expect(stub).toHaveBeenCalled();
      });

      it("should remove the view", function() {
        expect($(document)).not.toContain('.sensor-list-item');
      });
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

    it("should show an empty list otherwise", function() {
      var colView = new SensorApp.SensorViews.SensorListView();
      colView.render();
      expect(colView.el.getElementsByClassName('no-sensor-items').length).toBe(1);
    });
  });

  describe("SensorApp.SensorViews.SensorView", function() {
    var view;

    beforeEach(function() {
      var sensor = BackboneFactory.create("sensor");
      view = new SensorApp.SensorViews.SensorView({
        model: sensor
      });
      view.render();
    });

    it("should create a div element", function() {
      expect(view.el.nodeName).toEqual('DIV');
    });

    it("should show the sensor id", function() {
      expect(view.el.getElementsByClassName("sensor-id").length).toBe(1);
    });

    it("should show the sensor location", function() {
      expect(view.el.getElementsByClassName("sensor-location").length).toBe(1);
    });

    it("should show the sensor type", function() {
      expect(view.el.getElementsByClassName("sensor-type").length).toBe(1);
    });
  });

  describe("SensorApp.SensorViews.EditSensorView", function() {
    var view;

    beforeEach(function() {
      var sensor = BackboneFactory.create("sensor");
      view = new SensorApp.SensorViews.EditSensorView({
        model: sensor
      });
      view.render();
    });

    it("should create a div element", function() {
      expect(view.el.nodeName).toEqual('DIV');
    });

    it("should contain a form", function() {
      expect(view.$el.find('form').length).toBeTruthy();
    });

    it("should show an input field for the latitude", function() {
      expect(view.$el.find("input#sensor-latitude").length).toBeTruthy();    
    });

    it("should show an input field for the longitude", function() {
      expect(view.$el.find("input#sensor-longitude").length).toBeTruthy();    
    });

    describe("sensor type", function() {

      it("should show an select field for the type", function() {
        expect(view.$el.find("select#sensor-type").length).toBeTruthy();    
      });

      it("should render an option for each type", function() {
        var types = view.model.get('types'),
            values = [];
        
        view.$el.find("option").each(function(index) {
          values.push($(this).val());
        });
        $.each(types, function(i, type) {
          expect($.inArray(type, values) > -1).toBe(true);
        });
      })
    });

    describe("model update", function() {
      var changed,
          editView = new SensorApp.SensorViews.EditSensorView({
            model: BackboneFactory.create("sensor")
          }).render();

      beforeEach(function() {
        changed = false;
        server = sinon.fakeServer.create();
        server.respondWith("/sensors/"+editView.model.id, "");

        editView.model.url = '/sensors/' + editView.model.id;
      });

      afterEach(function() {
        editView.stopListening(editView.model);
        server.restore();
      });

      it("should update the latitude", function() {
        editView.listenTo(editView.model, "sync", function() {
          if (this.model.get('latitude') && this.model.get('latitude') == 1.100) {
            changed = true;
          }
        });
        editView.ui.latitude.val(1.100);
        editView.$el.find('form').submit();
        server.respond();

        expect(changed).toBe(true);

      });

      it("should update the longitude", function() {
        editView.listenTo(editView.model, "sync", function() {
          if (this.model.get('longitude') && this.model.get('longitude') == 1.100) {
            changed = true;
          }
        });
        editView.ui.longitude.val(1.100);
        editView.$el.find('form').submit();
        server.respond();

        expect(changed).toBe(true);
      });

      it("should update the type", function() {
        editView.listenTo(editView.model, "sync", function() {
          // Why does 'type' not appear in changed hash??
          // i.e., model._previousAttributes == model.attributes
          if (this.model.get('type') && this.model.get('type') == 'wind') {
            changed = true;
          }
        });
        editView.ui.type.val("wind");
        editView.$el.find('form').submit();
        server.respond();

        expect(changed).toBe(true);
      });

      it("should")
    });

    
  });

  describe("SensorApp.SensorViews.NotFoundSensorView", function() {
    var view;

    beforeEach(function() {
      view = new SensorApp.SensorViews.NotFoundSensorView();
      view.render();
    });

    it("should create a div element", function() {
      expect(view.el.nodeName).toEqual('DIV');
    });

    it("should have a 'not-found-sensor' class", function() {
      expect(view.el.getAttribute('class')).toBe("not-found");
    });
  });
});

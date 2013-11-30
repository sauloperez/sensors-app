describe("SensorApp.SensorViews", function() {
  var module;

  beforeEach(function() {
    module = window.SensorApp.Sensor;
  });

  it("should be available", function() {
    expect(module).toBeDefined();
  });


  // SensorLayout
  describe("SensorApp.SensorViews.SensorLayout", function() {
    var sensorLayout;

    beforeEach(function() {
      sensorLayout = new SensorApp.SensorViews.SensorLayout();
    });

    it("should have a header region", function() {
      expect(sensorLayout.headerRegion).toBeDefined();
    });

    it("should have a content region", function() {
      expect(sensorLayout.contentRegion).toBeDefined();
    });
  });


  // SensorPreview
  describe("SensorApp.SensorViews.SensorPreview", function() {
    var view;

    beforeEach(function() {
      var sensor = BackboneFactory.create("sensor");
      view = new SensorApp.SensorViews.SensorPreview({
        model: sensor
      });
      view.render();
    });

    it("should create a tr element", function() {
      expect(view.el.nodeName).toEqual('TR');
    });

    it("should show the sensor id", function() {
      expect(view.el.getElementsByClassName("sensor-id").length).toBe(1);
    });

    it("should show the sensor latitude", function() {
      expect(view.el.getElementsByClassName("sensor-latitude").length).toBe(1);
    });

    it("should show the sensor longitude", function() {
      expect(view.el.getElementsByClassName("sensor-longitude").length).toBe(1);
    });

    it("should show the sensor type", function() {
      expect(view.el.getElementsByClassName("sensor-type").length).toBe(1);
    });

    it("should show whether the sensor is active", function() {
      expect(view.el.getElementsByClassName("sensor-active").length).toBe(1);
    });

    it("should store the id in a data-id attribute", function() {
      var dataId = view.getModelIdFromItem(view.$el);
      expect(dataId).toBeTruthy();
    });

    describe("on click in .list-item-data", function() {
      var app = SensorApp;

      beforeEach(function() {
        SpecHelpers.loadRegions(app);

        app.start({
          config: { bootstrap: true },
          models: [BackboneFactory.create("sensor")]
        });

        // Init the layout and attach it to the DOM
        Backbone.history.navigate("elsewhere", false);
        app.Sensor.Controller._initLayout();
        Backbone.history.navigate("", true);
      });

      afterEach(function() {
        Backbone.history.navigate("", false);
      });

      it("should trigger a 'sensor:show' event", function() {
        var spy = sinon.spy();
        app.vent.on('sensor:show', spy);
        $('.list-item-field').trigger('click');
        expect(spy).toHaveBeenCalled();
      });
    });

    describe("on click in .delete", function() {
      var view,
          app = SensorApp,
          stub = sinon.stub(Backbone.Model.prototype, 'destroy');

      beforeEach(function() {
        SpecHelpers.loadRegions(app);

        app.start({
          config: { bootstrap: true },
          models: [BackboneFactory.create("sensor")]
        });

        // Init the layout and attach it to the DOM
        Backbone.history.navigate("elsewhere", false);
        app.Sensor.Controller._initLayout();
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


  // SensorListView
  describe("SensorApp.SensorViews.SensorListView", function() {
    var view;

    beforeEach(function() {
      view = new SensorApp.SensorViews.SensorListView();
      view.render();
    });

    it("should create a table element", function() {
      expect(view.el.nodeName).toBe('TABLE');
    });

    it("should have a 'sensor-list' id", function() {
      expect(view.el.getAttribute('id')).toBe("sensor-list");
    });

    it("should have a 'sensor-list' class", function() {
      expect(view.$el.hasClass('sensor-list')).toBe(true);
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


  // SensorListHeaderView
  describe("SensorApp.SensorViews.SensorListHeaderView", function() {
    var view;

    beforeEach(function() {
      view = new SensorApp.SensorViews.SensorListHeaderView();
      view.render();
    });

    it("should create a div element", function() {
      expect(view.el.nodeName).toBe('DIV');
    });

    it("should have a 'sensor-list-header' id", function() {
      expect(view.el.getAttribute('id')).toBe("sensor-list-header");
    });

    it("should create a button to add sensors", function() {
      expect(view.$el.find(".sensor-add").length).toBe(1);
    });

    describe("on click in .sensor-add", function() {
      var app = SensorApp;

      beforeEach(function() {
        SpecHelpers.loadRegions(app);

        app.start({
          config: { bootstrap: true },
          models: [BackboneFactory.create("sensor")]
        });

        // Init the layout and attach it to the DOM
        Backbone.history.navigate("elsewhere", false);
        app.Sensor.Controller._initLayout();
        Backbone.history.navigate("", true);
      });

      afterEach(function() {
        Backbone.history.navigate("", false);
      });

      it("should trigger a 'sensor:create' event", function() {
        var spy = sinon.spy();
        app.vent.on('sensor:create', spy);
        $('.sensor-add').trigger('click');
        expect(spy).toHaveBeenCalled();
      });
    });
  });


  // SensorView
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
      expect(view.$el.find(".sensor-id").length).toBe(1);
    });

    it("should show the sensor location", function() {
      expect(view.$el.find(".sensor-location").length).toBe(1);
    });

    it("should show the sensor type", function() {
      expect(view.$el.find(".sensor-type").length).toBe(1);
    });

    it("should show whether it's active", function() {
      expect(view.$el.find(".sensor-active").length).toBe(1);
    });
  });


  // SensorFormView
  describe("SensorApp.SensorViews.SensorFormView", function() {
    var view;

    beforeEach(function() {
      var sensor = BackboneFactory.create("sensor");
      view = new SensorApp.SensorViews.SensorFormView({
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

    it("should show a select field for the type", function() {
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
    });

    it("should show a radio input field to set active true", function() {
      expect(view.$el.find("input[type=radio]#sensor-active-true").length).toBe(1);    
    });

    it("should show a radio input field to set active false", function() {
      expect(view.$el.find("input[type=radio]#sensor-active-false").length).toBe(1);    
    });

    describe("when a model is passed in", function() {
      
      describe("on save", function() {
        var changed, editView;

        beforeEach(function() {
          editView = new SensorApp.SensorViews.SensorFormView({
              model: BackboneFactory.create("sensor")
            }).render();
          editView.model.url = '/sensors/' + editView.model.id;

          changed = false;
          server = sinon.fakeServer.create();
          server.respondWith("/sensors/" + editView.model.id, "");
        });

        afterEach(function() {
          editView.stopListening(editView.model);
          server.restore();
        });

        it("should save the model", function() {
          var spy = sinon.spy(Backbone.Model.prototype, 'save');
          editView.ui.latitude.val(2.100);
          editView.$el.find('form').submit();
          expect(spy).toHaveBeenCalled();
        });

        it("should update the latitude", function() {
          editView.listenTo(editView.model, "sync", function() {
            if (this.model.get('latitude') && this.model.get('latitude') === 1.100) {
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
            if (this.model.get('longitude') === 1.100) {
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
            if (this.model.get('type') === 'wind') {
              changed = true;
            }
          });
          editView.ui.type.val("wind");
          editView.$el.find('form').submit();
          server.respond();

          expect(changed).toBe(true);
        });

        it("should update the status", function() {
          editView.listenTo(editView.model, "sync", function() {
            if (this.model.get('active') === false) {
              changed = true;
            }
          });
          editView.ui.active.find('#sensor-active-false').attr('checked', false).trigger('click');
          editView.$el.find('form').submit();
          server.respond();

          expect(changed).toBe(true);
        });
      });

    });

    describe("when a model is not passed in", function() {
      var view = new SensorApp.SensorViews.SensorFormView({
            collection: new SensorApp.Sensor.SensorCollection()
          }).render();

      it("a collection should be passed in instead", function() {
        expect(view.collection).toBeTruthy();
      });

      describe("on save", function() {
        var spy;

        beforeEach(function() {
          server = sinon.fakeServer.create();
          server.respondWith("/api/v1/sensors", "");

          view.ui.latitude.val(1.100);
          view.ui.longitude.val(1.100);
          view.ui.type.val("wind");
          view.ui.active.find('#sensor-active-false').attr('checked', false).trigger('click');
        });

        afterEach(function() {
          spy.restore();
          server.restore();
        });

        it("should create a model within the collection", function() {
          spy = sinon.spy(Backbone.Collection.prototype, 'create');
          view.$el.find('form').submit();
          expect(spy).toHaveBeenCalled();
        });

        it("should persist it to the server", function() {
          var synced = false;
          view.listenTo(view.collection, "sync", function() {
            synced = true;
          });
          view.$el.find('form').submit();
          server.respond();

          expect(synced).toBe(true);
        });
      });
    });
  });


  // NotFoundSensorView
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
      expect(view.$el.hasClass('not-found')).toBe(true);
    });
  });
});

SensorApp.module("SensorMaps", function(SensorMaps, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.MapView = Marionette.ItemView.extend({
    template: "app/templates/sensor_maps/map",
    tagName: "div",
    id: "map",

    initialize: function(options) {
      this.listenTo(this.model, "change:latitude", this.updateMapModel);
      this.listenTo(this.model, "change:longitude", this.updateMapModel);

      this.mapModel = new Backbone.GoogleMaps.Location({
        lat: this.model.get('latitude'),
        lng: this.model.get('longitude')
      });
    },

    updateMapModel: function(model, value) {
      this.map.panTo(new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude')));
      if (model.changed.latitude) {
        this.mapModel.set('lat', value);
      }
      else {
        this.mapModel.set('lng', value);
      }
    },

    onRender: function() {
      var self = this;
      this.map = new google.maps.Map(this.el, {
        center: new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude')),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.markerView = new Backbone.GoogleMaps.MarkerView({
        model: self.mapModel,
        map: self.map
      });
      this.markerView.render();
    },

    onClose: function() {
      SensorMaps.stop();
    },

    refresh: function() {
      var center = this.map.getCenter();
      google.maps.event.trigger(this.map, "resize");
      this.map.setCenter(center);
    }
  });


  this.Controller = {
    start: function(options) {
      if (!options.region) throw new Error("A region to render in must be specified");
      if (!options.model) throw new Error("A model must be specified");

      this.region = options.region;
      this.model = options.model;
    },

    showMap: function() {
      var mapView = new SensorMaps.MapView({ model: this.model });
      this.region.show(mapView);

      // Fixes grey box when rendered while not being attached to the DOM
      mapView.refresh();
    }    
  };

  // Initialization
  this.on("before:start", function(options) {
    this.Controller.start(options);
  });

  this.on("start", function() {
    this.Controller.showMap();
  });
});
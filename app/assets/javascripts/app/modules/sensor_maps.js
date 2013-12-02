SensorApp.module("SensorMaps", function(SensorMaps, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.MapView = Marionette.ItemView.extend({
    template: "app/templates/sensor_maps/map",
    tagName: "div",
    id: "map",

    initialize: function(options) {
      this.listenTo(this.model, "change", this.updateMapModel);

      this.defaultLatLng = [41.38506, 2.17340];

      this.mapModel = new Backbone.GoogleMaps.Location({
        lat: this.model.get('latitude') || this.defaultLatLng[0],
        lng: this.model.get('longitude') || this.defaultLatLng[1]
      });
    },

    updateMapModel: function(model, value) {
      var self = this;
      if (model.changed.latitude) {
        this.mapModel.set('lat', model.changed.latitude);
      }
      else {
        this.mapModel.set('lng', model.changed.longitude);
      }

      // Render a marker if coordinates weren't provided (create action)
      if (!this.markerView && this.model.get('latitude') && this.model.get('longitude')) {
        this.markerView = new Backbone.GoogleMaps.MarkerView({
          model: self.mapModel,
          map: self.map
        });
        this.markerView.render();
      }
      this.map.panTo(new google.maps.LatLng(this.mapModel.get('lat'), this.mapModel.get('lng')));
    },

    onRender: function() {
      var self = this;
      this.map = new google.maps.Map(this.el, {
        center: new google.maps.LatLng(this.model.get('latitude') || this.defaultLatLng[0], 
                      this.model.get('longitude') || this.defaultLatLng[1]),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Only create the marker if coordinates are provided
      if (this.model.get('latitude') && this.model.get('longitude')) {
        this.markerView = new Backbone.GoogleMaps.MarkerView({
          model: self.mapModel,
          map: self.map
        });
        this.markerView.render();
      }
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
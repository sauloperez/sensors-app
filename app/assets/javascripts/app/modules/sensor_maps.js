SensorApp.module("SensorMaps", function(SensorMaps, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.MapView = Marionette.ItemView.extend({
    template: "app/templates/sensor_maps/map",
    tagName: "div",
    id: "map",

    initialize: function(options) {
      this.model = new Backbone.GoogleMaps.Location({
        lat: this.options.location[0],
        lng: this.options.location[1]
      });
    },

    onRender: function() {
      var self = this;
      this.map = new google.maps.Map(this.el, {
        center: new google.maps.LatLng(this.options.center[0], this.options.center[1]),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.markerView = new Backbone.GoogleMaps.MarkerView({
        model: self.model,
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
      if (!options.location) throw new Error("A center location must be specified");

      this.region = options.region;
      this.location = options.location;
    },

    showMap: function() {
      var mapView = new SensorMaps.MapView({ 
        center: this.location,
        location: this.location
      });
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
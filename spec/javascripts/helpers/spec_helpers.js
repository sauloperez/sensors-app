var SpecHelpers = {

  // Attach the needed HTML for the App to the DOM
  // and load the app regions
  loadRegions: function(app) {
    setFixtures("<div id='main'></div><div id='header'></div>");
    app.headerRegion.$el = $('#header');
    app.mainRegion.$el = $('#main');
  },

  mockGoogleMaps: function() {
    window.google = google = {};

    google.maps = {
      MapTypeId: {
        ROADMAP: 0
      },
      Animation: {
        DROP: 0
      }
    };

    google.maps.Marker = function(){
      return {
        setVisible: function(){}
      }
    };

    google.maps.Map = function(){
      return {
        getCenter: function(){},
        setCenter: function(){}
      }
    };

    google.maps.LatLng = function(){};

    google.maps.event = {
      addListener: function(){},
      trigger: function(){}
    };
  }
};
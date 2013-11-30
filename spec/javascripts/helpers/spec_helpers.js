var SpecHelpers = {

  // Attach the needed HTML for the App to the DOM
  // and load the app regions
  loadRegions: function(app) {
    setFixtures("<div id='main'></div><div id='header'></div>");
    app.headerRegion.$el = $('#header');
    app.mainRegion.$el = $('#main');
  }
};
SensorApp = (function(Backbone, Marionette) {
  "use strict";

  var App = new Marionette.Application();

  // Global configuration
  App.config = {
    bootstrap: true,
    root: "/",
    blackList: []
  };

  // Integrate JST into Marionette
  // Read more: https://github.com/marionettejs/backbone.marionette/wiki/Using-jst-templates-with-marionette
  Backbone.Marionette.Renderer.render = function(template, data) {
    if (!JST[template]) throw "Template '" + template + "' not found!";
    return JST[template](data);
  }

  // Globally capture clicks. If they are internal and not in the pass
  // through list, route them through Backbone's navigate method.
  // Heavily based on: http://artsy.github.io/blog/2012/06/25/replacing-hashbang-routes-with-pushstate/
  $(document).on("click", "a[href^='"+App.config.root+"']", function(event) {
    var href = $(event.currentTarget).attr('href');

    // chain 'or's for other black list routes
    if (App.config.blackList) {
      var passThrough = false;
      for (link in App.config.blackList) {
        passThrough = href.indexOf(link) >= 0;
      }
    }

    // Allow shift+click for new tabs, etc.
    if (!passThrough && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();

      // Remove leading slashes and hash bangs (backward compatablility)
      var url = href.replace(/^\//,'').replace('\#\!\/','');

      // Instruct Backbone to trigger routing events
      Backbone.history.navigate(url, { trigger: true });

      return false;
    }
  });

  // Regions
  App.addRegions({
    headerRegion: '#header',
    mainRegion: '#main'
  });

  // Inizialization
  App.on('initialize:before', function (options) {

    // Overwrite the config defaults
    if (options && options.config) {
      _.extend(App.config, options.config);
    }
    App.Sensor.start(options);
  });

  App.on('initialize:after', function (options) {
    Backbone.history.start({ pushState: true });
  });

  return App;
})(Backbone, Marionette);

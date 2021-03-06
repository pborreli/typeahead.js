/*
 * Twitter Typeahead
 * https://github.com/twitter/typeahead
 * Copyright 2013 Twitter, Inc. and other contributors; Licensed MIT
 */

(function() {
  var initializedDatasets = {},
      transportOptions = {},
      transport,
      methods;

  jQuery.fn.typeahead = typeahead;
  typeahead.configureTransport = configureTransport;

  methods = {
    initialize: function(datasetDefs) {
      var datasets = {};

      datasetDefs = utils.isArray(datasetDefs) ? datasetDefs : [datasetDefs];

      if (datasetDefs.length === 0) {
        throw new Error('no datasets provided');
      }

      delete typeahead.configureTransport;
      transport = transport || new Transport(transportOptions);

      utils.each(datasetDefs, function(i, datasetDef) {
        var dataset,
            name = datasetDef.name = datasetDef.name || utils.getUniqueId();

        // dataset by this name has already been intialized, used it
        if (initializedDatasets[name]) {
          dataset = initializedDatasets[name];
        }

        else {
          datasetDef.limit = datasetDef.limit || 5;
          datasetDef.template = datasetDef.template;
          datasetDef.engine = datasetDef.engine;

          if (datasetDef.template && !datasetDef.engine) {
            throw new Error('no template engine specified for ' + name);
          }

          dataset = initializedDatasets[name] = new Dataset({
            name: datasetDef.name,
            limit: datasetDef.limit,
            local: datasetDef.local,
            prefetch: datasetDef.prefetch,
            remote: datasetDef.remote,
            matcher: datasetDef.matcher,
            ranker: datasetDef.ranker,
            transport: transport
          });
        }

        datasets[name] = {
          name: datasetDef.name,
          limit: datasetDef.limit,
          template: datasetDef.template,
          engine: datasetDef.engine,
          getSuggestions: dataset.getSuggestions
        };
      });

      return this.each(function() {
        $(this).data({
          typeahead: new TypeaheadView({ input: this, datasets: datasets })
        });
      });
    }
  };

  function typeahead(method) {
    if (methods[method]) {
      methods[method].apply(this, [].slice.call(arguments, 1));
    }

    else {
      methods.initialize.apply(this, arguments);
    }
  }

  function configureTransport(o) {
    transportOptions = o;
  }
})();

(function() {
  var wantedGame, wantedGameView, wantedGames, wantedGamesUrl, wantedGamesView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  wantedGamesUrl = "";
  this.wanted = {
    init: function(urls, div) {
      wantedGamesUrl = urls.wantedGamesUrl;
      this.view = new wantedGamesView();
      this.view.initialize();
      return div.html(this.view.el);
    },
    getWantedGames: function() {
      return this.view.refresh();
    }
  };
  wantedGame = Backbone.Model.extend({
    name: function() {
      return this.get("Name");
    },
    console: function() {
      return this.get("Console");
    },
    owner: function() {
      return this.get("Owner").Handle;
    },
    shortName: function() {
      var name;
      name = this.name();
      if (name > 45) {
        name = name.substring(0, 40) + "... ";
      }
      return name += " (" + this.console() + ")";
    },
    undoRequest: function() {
      return $.post(this.get("DeleteWant"), {}, __bind(function() {
        preferred.getPreferredGames();
        return this.change();
      }, this));
    }
  });
  wantedGames = Backbone.Collection.extend({
    model: wantedGame,
    url: function() {
      return wantedGamesUrl;
    }
  });
  wantedGamesView = Backbone.View.extend({
    tagName: "span",
    initialize: function() {
      _.bindAll(this, 'render');
      this.wantedGames = new wantedGames();
      this.wantedGames.bind('reset', this.render);
      return this.wantedGames.fetch();
    },
    refresh: function() {
      return this.wantedGames.fetch();
    },
    addGame: function(game) {
      var view;
      view = new wantedGameView({
        model: game
      });
      view.initialize();
      view.render();
      return $(this.el).append(view.el);
    },
    render: function() {
      $(this.el).empty();
      return this.wantedGames.each(__bind(function(game) {
        return this.addGame(game);
      }, this));
    }
  });
  wantedGameView = Backbone.View.extend({
    className: 'border',
    initialize: function() {
      _.bindAll(this, "render", "apply");
      return this.model.bind('change', this.apply);
    },
    apply: function() {
      return $(this.el).fadeOut();
    },
    events: {
      "click .cancel": "undoRequest"
    },
    undoRequest: function() {
      return this.model.undoRequest();
    },
    render: function() {
      var game;
      game = $.tmpl(this.gameTemplate, {
        gameName: this.model.shortName(),
        owner: this.model.owner()
      });
      $(this.el).html(game);
      toolTip.init(game.find(".cancel"), "UndoRequest", "Don't want the game?<br/>Click to undo request.", "You get the idea...<br/>Undo request.", function() {
        return game.find(".cancel").offset().left - 125;
      }, function() {
        return game.find(".cancel").offset().top - 75;
      });
      return this;
    },
    gameTemplate: '\
  <div class="menubar">\
    <a href="javascript:;"\
       style="text-decoration: none; color: black; float: right; padding-left: 15px"\
       class="cancel">&nbsp;</a>\
    <div style="clear: both">&nbsp;</div>\
  </div>\
    <span style="float: right; font-size: 30px; color: silver; margin-right: 10px" class="brand">\
      Requested\
    </span>\
    <div style="font-size: 20px">${gameName}</div>\
    <div>${owner}</div>\
    '
  });
}).call(this);
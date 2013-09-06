define(['backbone.grid','backbone','jquery','backbone.db'],
function(Grid          , Backbone , $      , BackboneDB  ) {

	/**
	 * Build a jsonp database using Nail on Wall's database.
	 */
	var db = window.db = new BackboneDB([], {
		url: 'http://nail/cms/rest/artwork',
		pageLength: 100,
		ajaxOptions: {
			dataType: 'jsonp'
		},
	});


	/**
	 * A view constructor for the controls in the page.
	 */
	var ControlsView = Backbone.View.extend({
		initialize: function(options) {
			this.db = options.db;
		},

		events: {
			'click #more': 'more',
		},

		more: function() {
			var nextInitial = this.db.length + 1;

			this.db.request({}, nextInitial);
		}
	});

	var controls = new ControlsView({
		el: $('body'),
		db: db,
	});






	/**
	 * First fetch some items, then instantiate the grid.
	 */
	db.request({})
		.then(function() {

			/**
			 * The grid view
			 */
			var grid = window.grid = new Grid({
				rowSize: 5,

				el: $('#item-list-grid'),
				collection: db,

				itemData: function(model) {
					return model.attributes;
				},
				itemTemplate: function(data) {
					return '<li id='+ data.id +'>' + data.title + '</li>';
				},
				itemSelector: function(data) {
					return '#'+ data.id;
				}


			})

		});

});
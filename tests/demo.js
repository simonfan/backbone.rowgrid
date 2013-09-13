define(['backbone.rowgrid','backbone','jquery','backbone.db'],
function(RowGrid          , Backbone , $      , BackboneDB  ) {

	/**
	 * Build a jsonp database using Nail on Wall's database.
	 */
	var db = window.db = new BackboneDB([], {
		url: 'http://nailonwall.com/cms/rest/artwork',
		pageLength: 50,
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

			var ExtendedRowGrid = RowGrid.extend({


				beforeAdd: function(model, $el) {
					var $img = $el.find('img');

					$el.css({ opacity: 0});

					$img.load(function() {
						console.log($el.css('opacity'))
							$el.animate({ opacity: 1 }, { duration: 600 });
						})
				},

				afterAdd: function(model, $el) {},

				itemData: function(model) {
					return model.attributes;
				},
				itemTemplate: function(data) {
					return '<div id='+ data.id +' class="col-md-4"><img src="'+ data.image.thumbnail +'">'+ data.id + ' ' + data.title + '</div>';
				},
				itemSelector: function(data) {
					return '#'+ data.id;
				}

			})

			/**
			 * The grid view
			 */
			var grid = window.grid = new ExtendedRowGrid({
				rowSize: 3,

				el: $('#item-list-grid'),
				collection: db,
			})

		});

});
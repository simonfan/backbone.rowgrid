/** 
 * Defines how a collection of artworks should be displayed.
 */
define(['backbone.collectionview','jquery','backbone'],
function(CollectionView          , $      , Backbone ) {

	var RowGrid = CollectionView.extend({
		initialize: function(options) {

			/**
			 * Save row size before calling collectionview initialize method.
			 */
			this.rowSize = options.rowSize || 3;

			// initialize collection view
			CollectionView.prototype.initialize.call(this, options);

			/**
			 * bind methods
			 */
			_.bindAll(this, 'rowData','rowTemplate','rowSelector','_buildNewRow');
		},

		/**
		 * overwrite add method
		 */
		add: function(model, $el) {
				// find the incomplete row
				// or build a new one
			var $incomplete = this.$container.children('.__incomplete');

			// if $incomplete has length 0, create a new row
			$incomplete = $incomplete.length > 0 ? $incomplete : this._buildNewRow();

			//console.log($incomplete)

			$incomplete.append($el);

			/**
			 * Remove incomplete class if the row's children count equals the rowSize
			 */
			if ($incomplete.children().length >= this.rowSize) {
				$incomplete.removeClass('__incomplete');
			}
		},

		/**
		 * Methods to be overwritten:
		 */

		/**
		 * gets data for rendering a row
		 */
		rowData: function($container) {
			return {
				no: $container.children().length
			};
		},

		/**
		 * renders a row wrapper.
		 */
		rowTemplate: function(data) {
			return '<div class="row row-' + data.no + '"></div>';
		},

		/**
		 * returns a jq selector string to get a row at a given position
		 */
		rowSelector: function(no) {
			return '.row-' + no;
		},



		/**
		 * Internal methods
		 */
		_buildNewRow: function() {
			var data = this.rowData(this.$container),
				rowHtml = this.rowTemplate(data);

			return $(rowHtml).addClass('__incomplete').appendTo(this.$container);
		},


		/**
		 * API
		 */
		retrieveRow: function(no) {
			return this.$container.find(this.rowSelector(no));
		},
	});


	return RowGrid;

	var RowGrid = Backbone.RowGrid = CollectionView.extend({
		initialize: function(options) {
			CollectionView.prototype.initialize.call(this, options);


			/**
			 * Save options
			 */
			this.rowSize = options.rowSize || 3;

			/**
			 * Save row template
			 */
			this.rowTemplate = options.rowTemplate;
		},

		/**
		 * Method called after each li is added.
		 */
		afterAdd: function(artwork, $li) {

		},

		/**
		 * Calculate the orientation of the image
		 */
		orientationData: function(image) {

			var w = image.width,
				h = image.height,
				data = {
					orientation: 'unknown',
					spacing: 0
				};

			// no image, no height or no width
			if (!image || !h || !w) {
				return data;
			}

			if (h > w) {
				// portrait
				
				if ( h < (2*w) ) {
					// not very long
				//	$img.width( $wrapper.width() * 5/7 );
				//	$img.height('auto');
					data.orientation = 'portrait-short';
					data.spacing = 1;

				} else if ( h < (5/2*w) ){
					// very long
				//	$img.width( $wrapper.width() * 4/7 );
				//	$img.height('auto');
					data.orientation = 'portrait-medium';
					data.spacing = 1;

				} else {
					// very very very ridiculously long...
				//	$img.width( $wrapper.width() * 3/7 );
				//	$img.height('auto');
					data.orientation = 'portrait-long';
					data.spacing = 1;
				}
				
			} else if ( h < w ) {
				// landscape
				
				if ( (2 * h) > w ) {
					// then this is a normal landscape
				//	$img.width( $wrapper.width() * 6/7 )
				//		.addClass('landscape');
					data.orientation = 'landscape-short';
					data.spacing = 1;
					
				} else {

				//	$img.width( $wrapper.width() * 7/8 );
					// then this is a panoramic landscape
				//	$img.addClass('panorama');
					data.orientation = 'landscape-panorama';
					data.spacing = 1;

				}
			} else {
			//	$img.width($wrapper.width() * 7/8 );
				// square
			//	$img.addClass('square');
				data.orientation = 'square';
				data.spacing = 1;
			}

			return data;
		},

	});
});
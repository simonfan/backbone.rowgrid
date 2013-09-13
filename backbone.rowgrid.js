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
			this.rowSize = options.rowSize || this.rowSize;

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
});
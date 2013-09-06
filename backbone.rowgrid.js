/** 
 * Defines how a collection of artworks should be displayed.
 */
define(['backbone.collectionview','jquery'],
function(CollectionView          , $      ) {

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

				// get the orientation data.
			var orientationData = this.orientationData(artwork.get('image'));

			// add unaligned class to current li.
			$li.addClass('unaligned')
				// set data orientation-data
				.data('orientation-data', orientationData);

			var _this = this,
				$unaligned = this.$el.find('.unaligned'),

				elementsToAlign = [],
				spaceCount = 0;

			$unaligned.each(function(index, li) {

				var liSpacing = $(li).data('orientation-data').spacing;

				if (spaceCount + liSpacing > _this.rowSize) {
					_this.align($(elementsToAlign));
					return;
				} else {
					spaceCount += liSpacing;
					elementsToAlign.push(li);
				}
			});

		},

		/**
		 * Takes a list of jquery elements and sets their dimensions.
		 */
		align: function($els) {

			console.log('align');
			console.log($els);


			var _this = this,
				frameWidth = this.$el.width() || $(window).width(),
				tileWidth = frameWidth / this.rowSize,
				imgLoadDefers = _.map($els, function(el) {
					return _this._getImgHeight($(el).find('img'));
				});


			$els.removeClass('unaligned')
				.addClass('aligning');

			$els.each(function(index, el) {

				var $el = $(el),
					orientationData = $el.data('orientation-data'),
					spacing = orientationData.spacing,
					orientation = orientationData.orientation;

				$el.width( tileWidth * spacing );
			});


			return $.when.apply(null, imgLoadDefers)
						.then(function() {
							var heights = _.map($els, function(el) { return $(el).height(); }),
								highest = _.max(heights);

							_.each($els, function(el) {

								var $el = $(el);
								$el.height(highest);

							});

							$els.animate({ opacity: 1 })
								.removeClass('aligning');
						});


		},

		_getImgHeight: function($img) {
			var defer = $.Deferred(),
				h = $img.height(),
				w = $img.width();

			if (h && w) {
				defer.resolve({
					height: h,
					width: w
				});

			} else {

				$img.load(function() {
					defer.resolve({
						height: $img.height(),
						width: $img.width()
					});
				});

				$img.error(function() {
					defer.resolve({
						height: 0,
						width: 0,
					})
				});

			}

			return defer;
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


	return RowGrid;
});
/*
 * jQuery Chaos Sticky Elements
 * By Matthew Sigley
 * Based on work by Jonathan Davis - http://shopplugin.net
 * Version 1.0.0
 * Recent changes:
 * - Added document.readyState checks to make sure the window.load event isn't missed (1.0.0)
 * - Deferred attachement of window.scroll event to window.load (0.5.0)
 * - Added preservation of original top/bottom margin (0.4.0)
 * - Added sticking to bottom of relative element (0.4.0)
 * - Added relative element arguement (0.4.0)
 * - Added top position arguement (0.3.0)
 * - Added placeholder div behind sticky div to preserve content layout (0.2.0)
 * - Added setting width and height to lock rendered dimensions of sticky element (0.1.0)
 * Things left to do:
 * - Add support for multiple static items on the same page
 * - Add insufficent viewport space detection
 * - Preserve horizontal position of sticky element. Examples are elements floated left/right, positioned right/left, etc.
 * 
 * Arguements (passed to stickyElement function as an Array):
 * - verticalPosition (positive integer) : number of pixels to offset sticky effect from top of viewport. Default - 10.
 * - relativeElement (non-empty jQuery object) : block element to position the sticky element relative to. Default - nearest ancestor block element.
 * - stickToBottom (true/false) : whether the sticky div should stop at the bottom of the parent div or not. Default - false.
 */

(function( $ ) {
	$.fn.stickyElement = function(args) {
			var thisElement = $(this),
				thisDimensions = { 'width' : thisElement.width(), 
									'height' : thisElement.height(),
									'outerWidth' : thisElement.outerWidth(),
									'outerHeight' : thisElement.outerHeight(),
									'margin-bottom' : thisElement.css('margin-bottom'),
									'margin-top' : thisElement.css('margin-top') };
			
			//Default Arguement Values
			if(typeof(args) === 'undefined')
				 var args = new Array();
			if(typeof(args['verticalPosition']) === 'undefined') {
				verticalPosition = 10;
			} else {
				verticalPosition = args['verticalPosition'];
			}
			if(typeof(args['relativeElement']) === 'undefined') {
				relativeElement = thisElement.parent();
				while(relativeElement.css( "display" ) != 'block') {
					if(relativeElement.parents().length == 0)
						return this; //Just incase something is real screwed up to prevent an infinite loop
					relativeElement = relativeElement.parent();
				}
			} else {
				relativeElement = args['relativeElement'];
			}
			if(typeof(args['stickToBottom']) === 'undefined') {
				stickToBottom = false;
			} else {
				stickToBottom = args['stickToBottom'];
			}
			
			//Check for invalid topPosition value
			if(typeof verticalPosition !== 'number' || (verticalPosition%1) !== 0 || verticalPosition < 0) return this;
			
			//Check for non-existant or non-jQuery object in relativeElement
			if(typeof(relativeElement.jquery) === 'undefined' || relativeElement.length == 0) return this;
			
			//Non-block elements are not supported
			if(thisElement.css( "display" ) != 'block') return this;
			if(relativeElement.css( "display" ) != 'block') return this;
			
			//Quick fix for pre jQuery 1.8
			if($.fn.jquery < '1.8.0' && $.fn.jquery.indexOf('1.1.') != 0) {
				isBorderBox = thisElement.css( "box-sizing" ) === "border-box" || thisElement.css( "-moz-box-sizing" ) === "border-box"; 
				if (isBorderBox) {
					thisDimensions['width'] = thisDimensions['outerWidth'];
					thisDimensions['height'] = thisDimensions['outerHeight'];
				}
			}
			
			//Lock Elements Dimensions
			thisElement.width(thisDimensions['width']);
			thisElement.height(thisDimensions['height']);
			
			//Set relative to element
			relativeElement.css({'position':'relative'});
			
			//Set z-index to ridiculous
			thisElement.css({'z-index':'1000'});
			
			var moveElementWithScroll = function(e) {
				var windowElement = $(this),
					verticalScrollPosition = windowElement.scrollTop(),
					moveElement = e.data.moveElement,
					initialDimensions = e.data.initialDimensions;
					initialOffset = e.data.initialOffset;
					verticalPosition = e.data.verticalPosition,
					relativeElement = e.data.relativeElement,
					stickToBottom = e.data.stickToBottom,
					relativeBottom = relativeElement.offset().top + relativeElement.innerHeight();
				if (verticalScrollPosition < initialOffset.top-verticalPosition) {
					//Check for position static so this is not constantly being run on scroll
					if (moveElement.css('position') != 'static') {
						if( console ) console.log('returning top stuck element');
						//Return element to its default state
						moveElement.not('.sticky-placeholder').css({'position':'static', 'bottom':'', 'top':'', 'left':'', 
							'margin-top':initialDimensions['margin-top'], 'margin-bottom':initialDimensions['margin-bottom']});
						//Remove placeholder
						moveElement.siblings('.sticky-placeholder').remove();
					}
				} else if (stickToBottom && (verticalScrollPosition > relativeBottom-verticalPosition-initialDimensions['height'])) {
					//Check for position fixed so this is not constantly being run on scroll
					if (moveElement.css('position') != 'absolute') {
						if( console ) console.log('sticking element to bottom of container');
						moveElement.not('.sticky-placeholder').css({'position':'absolute', 'bottom':'0', 'top':'', 'left':'',
							'margin-top':'0', 'margin-bottom':'0'});
					}
				} else {
					//Check for position fixed so this is not constantly being run on scroll
					if (moveElement.css('position') != 'fixed') {
						if( console ) console.log('actually sticking element');
						//Reposition sticky element and insert placeholder directly after it
						var placeHolder = moveElement.clone();
						placeHolder.width(initialDimensions.outerWidth);
						placeHolder.height(initialDimensions.outerHeight);
						placeHolder.css({'box-sizing':'border-box', 'background':'transparent', 'border':'0', 'padding':'0', 'margin':'0'});
						placeHolder.html('');
						placeHolder.addClass('sticky-placeholder');
						placeHolder.insertAfter(moveElement);
						
						//Return element to its default state
						moveElement.not('.sticky-placeholder').css({'position':'fixed', 'bottom':'', 'top':verticalPosition+'px', 'left':'', 
							'margin-top':'0', 'margin-bottom':'0'});
					}
				}
			};
			
			if( document.readyState ) {
				if( document.readyState == "complete" ) {
					$(window).on( 'scroll', 
							{ 'moveElement' : thisElement, 
								'initialDimensions' : thisDimensions, 
								'initialOffset' : thisElement.offset(), 
								'verticalPosition' : verticalPosition,
								'relativeElement' : relativeElement,
								'stickToBottom' : stickToBottom }, 
							moveElementWithScroll );
				} else {
					$(window).load( function() {
						$(window).on( 'scroll', 
							{ 'moveElement' : thisElement, 
								'initialDimensions' : thisDimensions, 
								'initialOffset' : thisElement.offset(), 
								'verticalPosition' : verticalPosition,
								'relativeElement' : relativeElement,
								'stickToBottom' : stickToBottom }, 
							moveElementWithScroll );
					});
				}
			}
		return this;
	};
})( jQuery );
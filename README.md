jquery-chaos-sticky
===================

A jQuery plugin for making any element on a page always stay visible by sticking it to the top of the screen when the visitor scrolls past it.

Example Usage
-------------

```
<html>
	<head>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script>
			jQuery(document).ready(function($) {
				$('#sticky-subtotal').stickyElement({'verticalPosition' : 10, 
										'relativeElement' : $('#content'),
										'stickToBottom' : true
										});
			});
		</script>
	</head>
	<body>
		<div id="header">My Header</div>
		<div id="content">
			<div id="sticky">This element is always visible at the top of the window.</div>
			<h1>jQuery Chaos Sticky Element Example</h1>
			<h2>Headline</h2>
			<p>Content goes here</p>
		</div>
		<div id="footer">My Footer</div>
	</body>
</html>
```

Features
--------

* Stand alone JS file. No additional CSS file required.
* Content flow preservation. 
	* A blank placeholder element is inserted into the content when an element is stuck to the top of the page to prevent jumping and unreadable content.
* Relative parent bounds. 
	* An element can be set to stick to the bottom of its relative parent. This prevents stuck elements from overlapping sections of your site you didn't intend like your footer.

Options
-------

* verticalPosition
	* Integer of pixels the element is away from the top of the window when it is stuck.
* relativeElement
	* Parent element to position the element relative to when it is stuck. Defining your content wrapper div here is a good idea.
* stickToBottom
	* Boolean of whether to stick the element to the bottom of its relative parent instead of overflowing it.

Default Option Values
---------------------

```
{'verticalPosition' : 10, 
'relativeElement' : <nearest block level parent element>,
'stickToBottom' : false
}
```
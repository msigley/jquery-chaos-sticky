Change Log
==========

Recent changes
--------------
* Added document.readyState checks to make sure the window.load event isn't missed (1.0.0)
* Deferred attachement of window.scroll event to window.load (0.5.0)
* Added preservation of original top/bottom margin (0.4.0)
* Added sticking to bottom of relative element (0.4.0)
* Added relative element arguement (0.4.0)
* Added top position arguement (0.3.0)
* Added placeholder div behind sticky div to preserve content layout (0.2.0)
* Added setting width and height to lock rendered dimensions of sticky element (0.1.0)
 
Things left to do
-----------------
* Add support for multiple static items on the same page
* Add insufficent viewport space detection
* Preserve horizontal position of sticky element. Examples are elements floated left/right, positioned right/left, etc.
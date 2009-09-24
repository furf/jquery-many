(function($) {
  
  /**
   * Bind a callback to the completion of multiple events
   */
  $.fn.many = function() {

    if (this.length === 0) {
      return this;
    }

    var _complete   = $.fn.many.COMPLETE,
        _incomplete = $.fn.many.INCOMPLETE,
    
        // Whether or not to rebind callback after complete event
        _rebind = (typeof arguments[0] === 'boolean' &&
          Array.prototype.shift.call(arguments) === true),

        // Extract one events and replace with complete event           
        _types = $.trim(Array.prototype.splice.call(arguments, 0, 1, _complete)[0]),        
        _evts  = (_types !== '') ? _types.split(/\W+/) : [],
        _nEvts = _evts.length,

        // Arguments to apply to complete event
        _args = arguments,

        // Bind complete callback to completion of all events
        _many = function() {

          var $this  = $(this),
              fired  = [],
              nFired = 0,
              ret;

          // Subscribe callback the complete event
          $this.one.apply($this, _args);

          // Add a one-time listener to each specified event
          for (var i = 0; i < _nEvts; ++i) {

            $this.one(_evts[i], function(e) {
              
              // Push fired event onto the stack and compare length                
              fired.push(e.type);
              nFired = fired.length;
              
              ret = [e, nFired, _nEvts];
              
              if (nFired === _nEvts) {

                // Fire complete event if all specifed events have fired
                $this.trigger(_complete, ret);
                
                // Reset
                if (_rebind) {
                  _many.call(this);
                }
                
              // Fire secondary incomplete events 
              } else {
                $this.trigger(_incomplete, ret);                
                $this.trigger(_incomplete + ':' + nFired, ret);                
              }
              
            });        
          }
        };

    return (_nEvts > 0) ? this.each(_many) : this;
  };
  
  $.fn.many.COMPLETE   = 'many:complete';
  $.fn.many.INCOMPLETE = 'many';
  
})(jQuery);

(function($) {
  
  /**
   * Bind a callback to the completion of multiple events
   */
  $.fn.many = function() {

    if (this.length === 0) {
      return this;
    }

    var PREFIX    = $.fn.many.PREFIX,
        SEPARATOR = $.fn.many.SEPARATOR,
        COMPLETE  = PREFIX + SEPARATOR + $.fn.many.COMPLETE,
        
    // Arguments to apply to complete event
    args = Array.prototype.slice.call(arguments, 0),

    // Whether or not to rebind events after complete
    rebind = (typeof args[0] === 'boolean' && args.shift() === true),

    // Extract one event types and replace with complete event           
    types = $.trim(args.splice(0, 1, COMPLETE)[0]),        
    ones = (types !== '') ? types.split(/\W+/) : [],

    /**
     * Bind callback to completion of all events
     */
    many = function() {

      var $this = $(this),
          fired = [],
          ret;

      // Subscribe callback the complete event
      $this.one.apply($this, args);

      // Add a listener for each specified one event
      for (var i = 0, n = ones.length; i < n; ++i) {
        $this.one(ones[i], function(e) {
          
          // Push fired event onto the stack and compare length                
          fired.push(e.type);
          
          // Add'l arguments to pass to bound callbacks
          ret = [e, fired.length, ones.length];
          
          // Fire complete event if all specifed events have fired
          if (fired.length === ones.length) {
            $this.trigger(COMPLETE, ret);
            
            // Rebind
            if (rebind) {
              many.call(this);
            }
            
          // Fire partial events 
          } else {
            $this.trigger(PREFIX, ret);                
            $this.trigger(PREFIX + SEPARATOR + fired.length, ret);                
          }
          
        });        
      }
    };
    return (ones.length > 0) ? this.each(many) : this;
  };
  
  $.extend($.fn.many, {
    PREFIX:    'many',
    SEPARATOR: ':',
    COMPLETE:  'complete'
  });
  
})(jQuery);

define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');

    // base view that provides expected methods for all views that inherit it
    // close is overridden to include a onClose method
    // post render is used after page slider has finished its transition
    return Backbone.View.extend({

        // events that are bound to elements in the dom
        events: {
            'click .back'           : 'back',
            'click .menu'           : 'toggleMenu',
            'click .options'        : 'toggleOptions',
            'click .main-content'   : 'hideSidebars'
        }, 
        
        // initialize variables, models, and collections
        initialize: function (options) {
            
        },

        // method for rendering template to view
        render: function () {
            
        },
        
        // will be called after page slider finishes transition
        postRender: function() {
            
        },
        
        // remove view, unbind events, unbind data events
        // if view has onClose, call it
        // if view has timeout, clear it
        close : function(){
			this.remove();
			this.unbind();
			this.$el.removeData().unbind(); 
			if (this.onClose){
				this.onClose();
			}
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
		},
        
        // to be used in children views for extra data cleanup
        onClose: function() {
            
        },
        
        // go back
        back: function() {
            if(!document.referrer || document.referrer == "") {
               window.location = "#";
            } else {
               window.history.back();
            }
        },
        
        //left sidebar toggle
        toggleMenu: function(e) {
            this.toggleSidebar("left");
        },
        
        // right sidebar toggle
        toggleOptions: function() {
            this.toggleSidebar("right");
        },
        
        // toggle sidebar element
        toggleSidebar: function(dir) {
            if(!this.$page) {
                this.$page = $(".page");
            }
            var direction = "content-" + dir;
            if(this.$page.hasClass(direction)) {
                this.$page.removeClass(direction)
            } else {
                this.$page.addClass(direction);
            }
            /*
            if(this.$mainContent.hasClass("open")) {
                if(!scope.inTransition || scope.inTransition == false) {
                    // end of transition, hide it
                    sidebar.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                        scope.inTransition = false;
                        sidebar.css('display', 'none');
                        sidebar.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                    })
                }
                scope.inTransition = true;
                sidebar.removeClass("open");
            } else {
                // fadeIn, then open
                sidebar.css('display', 'block');
                setTimeout(function() {
                    sidebar.addClass("open");
                }, 0);
                //sidebar.fadeIn(1, "linear", function() {
                    
                //});
            }*/
        },
        
        // hide open sidebars
        hideSidebars: function(e) {
            if(this.leftSidebar && this.leftSidebar.hasClass('open')) {
                this.toggleSidebar(this.leftSidebar);
            }
            if(this.rightSidebar && this.rightSidebar.hasClass('open')) {
                this.toggleSidebar(this.rightSidebar);
            }
        }
        
    });

});
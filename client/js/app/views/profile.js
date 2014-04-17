define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        BaseView    = require('views/base'),
        tpl         = require('text!tpl/profile.html'),
        template    = _.template(tpl);

    return BaseView.extend({

        // on file button change, load image
        events: {
            'change #imagePicker'   : 'uploadAvatar'
        }, 
        
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.user = options.user; 
            this.render(); 
            this.renderAvatar();
            this.listenTo(this.user, 'sync', this.renderAvatar);
        },

        render: function () {
            this.$el.html(template());
            this.$uploadBtn = this.$el.find("#btnUpload");
            this.$imagePicker = this.$el.find("#imagePicker");
            this.$avatar = this.$el.find("#imgAvatar");
            this.$canvas = this.$el.find("#profile-canvas");
            this.ctx = this.$canvas[0].getContext('2d');
            return this;
        },
        
        postRender: function() {
            
        },
        
        onClose: function() {
            this.stopListening(this.user)
        },
        
        // render avatar when user has avatar
        renderAvatar: function() {
            if(this.user && this.user.has('avatar')) {
                this.$avatar.attr( "src", "");
                this.$avatar.attr( "src", this.user.get('avatar'));
            }  
        },
        
        // on file change, upload to firebase and render it
        uploadAvatar: function(e) {
            var scope = this;
            var files = event.target.files;
            if (files.length > 0) {
                var file = files[0];
                var FR= new FileReader();
                FR.onload = function(e) {
                    var data = e.target.result;
                    var avatar = scope.resizeImageCanvas(data);
                    scope.user.set({ avatar: avatar });
                    scope.renderAvatar();
                };       
                FR.readAsDataURL( file );
            } 
            e.preventDefault();
            return false;
        },
        
        resizeImageCanvas: function(data) {
            var img = new Image();
            img.src = data;
            var MAX_WIDTH = 800;
            var MAX_HEIGHT = 600;
            var width = img.width;
            var height = img.height;
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            this.$canvas[0].width = width;
            this.$canvas[0].height = height;
            this.ctx.drawImage(img, 0, 0, width, height);
            return this.$canvas[0].toDataURL("image/jpeg", 0.7);
        }
    });

});
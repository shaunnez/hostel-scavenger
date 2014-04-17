define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        BaseView    = require('views/base'),
        tpl         = require('text!tpl/tasks.html'),
        taskTpl     = require('text!tpl/task.html'),
        taskTemplate= _.template(taskTpl),
        template    = _.template(tpl);

    return BaseView.extend({

        events: {
            'change .task-file'   : 'uploadTaskPic'
        }, 
        
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.user = options.user;
            this.leader = options.leader;
            this.hunt = options.hunt;
            this.tasks = this.hunt.get('tasks');
            this.render(); 
        },

        render: function () {
            this.$el.html(template());
            this.$tbody = this.$el.find("tbody");
            this.$canvas = this.$el.find("#task-canvas");
            this.ctx = this.$canvas[0].getContext('2d');
            return this;
        },
        
        postRender: function() {
            this.renderTasks();
            this.listenTo(this.user, 'change', this.renderTasks);
        },
        
        onClose: function() {
            this.stopListening(this.user, 'change', this.renderTasks)
        },
        
        renderTasks: function() {
            var output = "";
            var userTasks = this.user.tasks();
            for(var i = 0, j = this.tasks.length; i < j; i++) {
                var task = this.tasks[i];
                var userTask = this.getTask(task.id, userTasks);
                var state = userTask && userTask.state != undefined ? userTask.state : "incomplete";
                output += taskTemplate({ task: this.tasks[i], state: state, userTask: userTask });
            }
            this.$tbody.html(output);
        },
        
        getTask: function(id, taskList) {
            var task = {};
            for(var i = 0, j = taskList.length; i < j; i++) {
                if(taskList[i].id.toString() == id.toString()) {
                    task = taskList[i];
                    break;
                }
            }
            return task;
        },
        
        
        uploadTaskPic: function(e) {
            var scope = this;
            var files = e.target.files;
            var $fileElm = $(e.currentTarget);
            var $row = $fileElm.closest("tr");
            var $inlineFiles = $row.find(".inline-file");
            // get the task from the task list
            var taskId = $fileElm.data('id');
            
            if (files.length > 0) {
                var file = files[0];
                var FR= new FileReader();
                FR.onload = function(e) {
                    var data = e.target.result;
                    $("<img src='" + data + "' style='float:left; height:18px; max-width:18px; margin-right: 10px' />").insertAfter(scope.$fileElm);
                    
                    $inlineFiles.addClass("pending");
                    // update in firebase
                    var task = scope.getTask(taskId, scope.tasks);
                    task.state = "pending";
                    task.image = scope.resizeImageCanvas(data);
                    task.date = $$.today();
                    var points = scope.leader.points() + task.points;
                    // update user tasks
                    var clonedUserTasks = _.clone(scope.user.tasks());
                    clonedUserTasks.push(task);
                    scope.user.set({ 'tasks': clonedUserTasks });
                    // update leader points
                    scope.leader.set({ 'points' :  points });
                    $$.notification("success", "Successfully sent photo");
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
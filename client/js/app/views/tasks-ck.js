define(function(e){"use strict";var t=e("jquery"),n=e("utils/globals"),r=e("underscore"),i=e("backbone"),s=e("views/base"),o=e("text!tpl/tasks.html"),u=e("text!tpl/task.html"),a=r.template(u),f=r.template(o);return s.extend({events:{"change .task-file":"uploadTaskPic"},initialize:function(e){this.events=r.extend({},s.prototype.events,this.events);this.user=e.user;this.leader=e.leader;this.hunt=e.hunt;this.tasks=this.hunt.get("tasks");this.render()},render:function(){this.$el.html(f());this.$tbody=this.$el.find("tbody");this.$canvas=this.$el.find("#task-canvas");this.ctx=this.$canvas[0].getContext("2d");return this},postRender:function(){this.renderTasks();this.listenTo(this.user,"change",this.renderTasks)},onClose:function(){this.stopListening(this.user,"change",this.renderTasks)},renderTasks:function(){var e="",t=this.user.tasks();for(var n=0,r=this.tasks.length;n<r;n++){var i=this.tasks[n],s=this.getTask(i.id,t),o=s&&s.state!=undefined?s.state:"incomplete";e+=a({task:this.tasks[n],state:o,userTask:s})}this.$tbody.html(e)},getTask:function(e,t){var n={};for(var r=0,i=t.length;r<i;r++)if(t[r].id.toString()==e.toString()){n=t[r];break}return n},uploadTaskPic:function(e){var i=this,s=e.target.files,o=t(e.currentTarget),u=o.closest("tr"),a=u.find(".inline-file"),f=o.data("id");if(s.length>0){var l=s[0],c=new FileReader;c.onload=function(e){var s=e.target.result;t("<img src='"+s+"' style='float:left; height:18px; max-width:18px; margin-right: 10px' />").insertAfter(i.$fileElm);a.addClass("pending");var o=i.getTask(f,i.tasks);o.state="pending";o.image=i.resizeImageCanvas(s);o.date=n.today();var u=i.leader.points()+o.points,l=r.clone(i.user.tasks());l.push(o);i.user.set({tasks:l});i.leader.set({points:u});n.notification("success","Successfully sent photo")};c.readAsDataURL(l)}e.preventDefault();return!1},resizeImageCanvas:function(e){var t=new Image;t.src=e;var n=800,r=600,i=t.width,s=t.height;if(i>s){if(i>n){s*=n/i;i=n}}else if(s>r){i*=r/s;s=r}this.$canvas[0].width=i;this.$canvas[0].height=s;this.ctx.drawImage(t,0,0,i,s);return this.$canvas[0].toDataURL("image/jpeg",.7)}})});
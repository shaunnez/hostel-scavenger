define(function(e){"use strict";var t=e("jquery"),n=e("underscore"),r=e("backbone");return r.View.extend({events:{"click .back":"back","click .menu":"toggleMenu","click .options":"toggleOptions","click .main-content":"hideSidebars"},initialize:function(e){},render:function(){},postRender:function(){},close:function(){this.remove();this.unbind();this.$el.removeData().unbind();this.onClose&&this.onClose();this.timeout&&clearTimeout(this.timeout)},onClose:function(){},back:function(){!document.referrer||document.referrer==""?window.location="#":window.history.back()},toggleMenu:function(e){this.toggleSidebar("left")},toggleOptions:function(){this.toggleSidebar("right")},toggleSidebar:function(e){this.$page||(this.$page=t(".page"));var n="content-"+e;this.$page.hasClass(n)?this.$page.removeClass(n):this.$page.addClass(n)},hideSidebars:function(e){this.leftSidebar&&this.leftSidebar.hasClass("open")&&this.toggleSidebar(this.leftSidebar);this.rightSidebar&&this.rightSidebar.hasClass("open")&&this.toggleSidebar(this.rightSidebar)}})});
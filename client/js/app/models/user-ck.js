define(function(e){"use strict";var t=e("jquery"),n=e("utils/globals"),r=e("backbone");return r.Firebase.Model.extend({initialize:function(e){this.firebase=new Firebase(n.FirebaseURL+"/users/"+e.id)},avatar:function(){return this.has("avatar")?this.get("avatar"):this.has("fbAvatar")?this.get("fbAvatar"):"/img/default-avatar.png"},tasks:function(){return this.has("tasks")?this.get("tasks"):[]},challenges:function(){return this.has("challenges")?this.get("challenges"):[]},points:function(){return this.has("points")?this.get("points"):0}})});
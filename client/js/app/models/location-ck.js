define(function(e){"use strict";var t=e("jquery"),n=e("utils/globals"),r=e("backbone");return r.Firebase.Model.extend({initialize:function(e){this.firebase=new Firebase(n.FirebaseURL+"/locations/"+n.today()+"/"+e.id)}})});
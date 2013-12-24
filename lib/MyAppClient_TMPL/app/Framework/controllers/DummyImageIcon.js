
var fontawesome = require('IconicFont').IconicFont({font:'FontAwesome'});

$.PictureSymbol.setFont({fontSize:"44dp", fontFamily:fontawesome.fontfamily()});
$.PictureSymbol.setText(fontawesome.icon('fa-picture-o'));

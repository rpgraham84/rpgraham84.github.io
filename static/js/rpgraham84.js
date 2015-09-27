$(window).load(function(){
    apod.get(new Date(),
        function(a){
            $('html').css('background-image', 'url(' + a.pictureURL + ')');
        }, function () {
            $('html').css('background-image', 'url(/static/images/underwater_stefanus_martanto_setyo_husodo.jpg)');
        });
});

$(document).ready(function(){
    $('input[name=_next]').val(window.location.origin + window.location.pathname);
});
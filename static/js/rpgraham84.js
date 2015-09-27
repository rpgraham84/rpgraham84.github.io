$(window).load(function(){
    apod.get(new Date(),
        function(a){
            $('html')
                .css('background', 'url(' + a.pictureURL + ') no-repeat center center fixed')
                .css('background-size', 'cover');
        }, function () {
            $('html')
                .css('background', 'url(/static/images/underwater_stefanus_martanto_setyo_husodo.jpg) no-repeat center center fixed')
                .css('background-size', 'cover');
        });
});

$(document).ready(function(){
    $('input[name=_next]').val(window.location.origin + window.location.pathname);
});
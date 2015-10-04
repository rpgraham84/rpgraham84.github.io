$(window).load(function(){
    apod.get(new Date(),
        function(a){
            $('html')
                .css('background', 'url(' + a.pictureURL + ') no-repeat center center fixed')
                .css('background-size', 'cover');
        }, function () {
            console.log(arguments);
            $('html')
                .css('background', 'url(/static/images/underwater_stefanus_martanto_setyo_husodo.jpg) no-repeat center center fixed')
                .css('background-size', 'cover');
        }
    );
});

$(document).ready(function(){
    var contentfile;

    // Set next value for contact form
    $('input[name=_next]').val(window.location.origin + window.location.pathname);

    window.renderContents = function(contentfile) {
        $pckry.empty();
        $.getJSON(contentfile, function(articles){
            var tmplArticle = _.template($('#articleTemplate').html());
            var elems = [];
            _.each(articles, function(e,i){
                var $ele = $(tmplArticle(e));
                elems.push($ele);
                $pckry.append($ele);
                $pckry.packery('appended', $ele);
                $pckry.packery();
            });
        });
    };

    window.clickDataLink = function (e) {
        var contentfile = e.target.getAttribute('data-file');
        renderContents(contentfile);
    };


    // Initialize packery instance
    window.$pckry = $('#pckry').packery();
    renderContents('/about.json');
});
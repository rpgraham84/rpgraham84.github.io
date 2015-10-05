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
                if ($ele.find('.github-card').length) {
                    console.log($ele.find('.github-card')[0]);
                    githubCard.render($ele.find('.github-card')[0]);
                }

            });
        });
    };

    window.clickDataLink = function (e) {
        var contentfile = e.target.getAttribute('data-file');
        renderContents(contentfile);
    };

    twttr.events.bind(
        'loaded',
        function (event) {
            event.widgets.forEach(function (widget) {
                console.log("Created widget", widget.id, $('iframe#twitter-widget-0').contents().find('div.timeline'));
                $('iframe#twitter-widget-0').contents().find('div.timeline').css({
                    "width": "100%",
                    "max-width": "none"
                });
            });
        }
    );

    // Initialize packery instance
    window.$pckry = $('#pckry').packery();
    renderContents('/about.json');

    // Initialize GH-cards function
    (function (e) {
        window.githubCard = {};
        var t = "//cdn.jsdelivr.net/github-cards/1.0.2/";
        var r, i = 0;
        var a = e.getElementsByTagName("meta");
        var n, d, l, c;
        for (r = 0; r < a.length; r++) {
            var s = a[r].getAttribute("name");
            var f = a[r].getAttribute("content");
            if (s === "gc:url") {
                n = f
            } else if (s === "gc:base") {
                t = f
            } else if (s === "gc:client-id") {
                d = f
            } else if (s === "gc:client-secret") {
                l = f
            } else if (s === "gc:theme") {
                c = f
            }
        }
        function u(t) {
            if (e.querySelectorAll) {
                return e.querySelectorAll("." + t)
            }
            var i = e.getElementsByTagName("div");
            var a = [];
            for (r = 0; r < i.length; r++) {
                if (~i[r].className.split(" ").indexOf(t)) {
                    a.push(i[r])
                }
            }
            return a
        }

        function g(e, t) {
            return e.getAttribute("data-" + t)
        }

        function h(e) {
            if (window.addEventListener) {
                window.addEventListener("message", function (t) {
                    if (e.id === t.data.sender) {
                        e.height = t.data.height
                    }
                }, false)
            }
        }

        function v(r, a) {
            a = a || n;
            if (!a) {
                var s = g(r, "theme") || c || "default";
                a = t + "cards/" + s + ".html"
            }
            var f = g(r, "user");
            var u = g(r, "repo");
            var v = g(r, "github");
            if (v) {
                v = v.split("/");
                if (v.length && !f) {
                    f = v[0];
                    u = u || v[1]
                }
            }
            if (!f) {
                return
            }
            i += 1;
            var o = g(r, "width");
            var m = g(r, "height");
            var b = g(r, "target");
            var w = g(r, "client-id") || d;
            var p = g(r, "client-secret") || l;
            var A = "ghcard-" + f + "-" + i;
            var y = e.createElement("iframe");
            y.setAttribute("id", A);
            y.setAttribute("frameborder", 0);
            y.setAttribute("scrolling", 0);
            y.setAttribute("allowtransparency", true);
            var E = a + "?user=" + f + "&identity=" + A;
            if (u) {
                E += "&repo=" + u
            }
            if (b) {
                E += "&target=" + b
            }
            if (w && p) {
                E += "&client_id=" + w + "&client_secret=" + p
            }
            y.src = E;
            y.width = o || Math.min(r.parentNode.clientWidth || 400, 400);
            if (m) {
                y.height = m
            }
            h(y);
            r.parentNode.replaceChild(y, r);
            $pckry.packery();
            console.log(y, r)
            return y
        }

        var o = u("github-card");
        for (r = 0; r < o.length; r++) {
            v(o[r])
        }

        window.githubCard.render = v

    })(document);
});


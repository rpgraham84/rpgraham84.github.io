/*jslint browser: true*/
/*global XDomainRequest*/

window.apod = (function () {
    'use strict';

    var jsonURLProtocol, jsonURLBase, apod;

    // Use the same protocol to load ScraperWiki data. If something other than
    // HTTP or HTTPS is being used (for example, file) default to HTTPS. This
    // allows the library to work both locally and while being hosted.
    jsonURLProtocol = (location.protocol.indexOf('http') > -1) ? location.protocol : 'https:';
    jsonURLBase = jsonURLProtocol + '//free-ec2.scraperwiki.com/apa2s5i/9b00174f1eb04c7/sql/?q=';

    /**
     * Return a human-readable representation of a Date object in YYYY-MM-DD
     * format.
     *
     * @param {Date} date
     *   The Date object that should be formatted.
     * @return {string}
     *   A human-readable representation of the given Date object in YYYY-MM-DD
     *   format.
     */

    function dateToYMD(date) {
        function pad(number) {
            var numberString = String(number);
            return (numberString.length === 1) ? '0' + numberString : numberString;
        }
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
    }

    /**
     * Return a Date object representing a human-readable date in YYYY-MM-DD
     * format.
     *
     * @param {string} ymd
     *   A human-readable date in YYYY-MM-DD format.
     * @return
     *   A Date object representing the given human-readable date.
     */

    function ymdToDate(ymd) {
        var components, y, m, d;

        function unpad(numberString) {
            return parseInt(numberString, 10);
        }

        // We cannot just pass ymd into the Date constructor. While that may work
        // in some browsers, all browsers parse human-readable dates differently.
        components = ymd.split('-');
        y = unpad(components[0]);
        m = unpad(components[1]) - 1;
        d = unpad(components[2]);

        return new Date(y, m, d);
    }

    /**
     * Run a callback on JSON data. This is similar to the $.getJSON function
     * in jQuery.
     *
     * @param {string} path
     *   The path to a JSON file.
     * @param {function}
     *   A callback to run on the data. The callback is passed one argument: the
     *   JSON data. The format of this data is identical to the format of the
     *   data returned by JSON.parse().
     */

    function getJSON(path, callback) {
        var request, data;

        // Logic shared by both the XDomainRequest implementation and the
        // XMLHttpRequest implementation.

        function runCallback() {
            data = JSON.parse(request.responseText);
            callback(data);
        }

        // Use XDomainRequest if it's available (to support IE8 and IE9 -- herp
        // derp). Otherwise, use XMLHttpRequest.
        if (window.XDomainRequest) {
            request = new XDomainRequest();
            request.onload = function () {
                runCallback();
            };
        } else {
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
                    runCallback();
                }
            };
        }

        request.open('GET', path);
        request.send();
    }

    /**
     * Simple constructor for an Astronomy Picture of the Day, used simply to
     * give public names to different types of data.
     *
     * See README.md for documentation on these names.
     */

    function APOD(title, explanation, pictureURL, url, date) {
        this.title = title;
        this.explanation = explanation;
        this.pictureURL = pictureURL;
        this.url = url;
        this.date = date;
    }

    /**
     * The API. See README.md for documentation and example usage.
     */
    apod = {

        get: function (date, success, failure) {
            var ymd, query, jsonURL;

            ymd = dateToYMD(date);
            query = 'SELECT * FROM `swdata` WHERE `date` = "' + ymd + '"';
            jsonURL = jsonURLBase + encodeURIComponent(query);

            getJSON(jsonURL, function (data) {
                var result, apodObject;
                if (data.length === 0) {
                    failure('NothingPublishedError', 'No Astronomy Picture of the Day published on specified date.');
                } else {
                    result = data[0];
                    apodObject = new APOD(result.title, result.explanation, result.picture_url, result.url, date);
                    success(apodObject);
                }
            });
        },

        getBetween: function (startDate, endDate, success, failure) {
            var startYMD, endYMD, query, jsonURL;

            if (startDate > endDate) {
                failure('TimespanError', 'End date cannot fall before start date.');
            } else {
                startYMD = dateToYMD(startDate);
                endYMD = dateToYMD(endDate);
                query = 'SELECT * FROM `swdata` WHERE `date` BETWEEN "' + startYMD + '" AND "' + endYMD + '"';
                jsonURL = jsonURLBase + encodeURIComponent(query);

                getJSON(jsonURL, function (data) {
                    var ascendingResults, i, result, resultDate, apods;
                    apods = [];

                    if (data.length === 0) {
                        failure('NothingPublishedError', 'No Astronomy Pictures of the Day published between specified dates.');
                    } else {
                        // Results are returned in descending order. Change that!
                        ascendingResults = data.reverse();
                        for (i = 0; i < ascendingResults.length; i += 1) {
                            result = ascendingResults[i];
                            resultDate = ymdToDate(result.date);
                            apods.push(new APOD(result.title, result.explanation, result.picture_url, result.url, resultDate));
                        }
                        success(apods);
                    }
                });
            }
        }

    };

    return apod;
}());

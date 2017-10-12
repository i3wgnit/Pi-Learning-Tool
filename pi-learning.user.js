// ==UserScript==
// @name        Pi Learning
// @namespace   http://fuuk.ml
// @description If I am going to waste my time, I might as well waste it like this.
// @include     http://*facebook.com/*
// @include     https://*facebook.com/*
// @include     http://*youtube.com/*
// @include     https://*youtube.com/*
// @include     http://*reddit.com/*
// @include     https://*reddit.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://rawgit.com/i3wgnit/Pi-Learning-Tool/master/pi-learning.user.js
// @version     2.4.2+
// ==/UserScript==
var GAME = {};

GAME.fetchPi = function() {
    if (GAME.pi.length * 1000 < GAME.digits + 100) {
        GAME.fetch().then((string) => {
            GAME.pi.push(JSON.parse(string.slice(1, -1))["pi_content"]);
            GAME.fetchPi();
        });
    } else {
        GAME.init();
    }
};

GAME.fetch = function() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://assets.piday.org/apps/million/fetch.php?page=" + (GAME.pi.length + 1),
            onload: (response) => resolve(response.responseText),
            onerror: (response) => reject(response.statusText)
        });
    });
};

GAME.init = function() {
    GAME.body = document.createElement("div");
    document.body.appendChild(GAME.body);
    GAME.body.style = "z-index:2147483647;position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:#fff;color:#000;text-align:left;vertical-align:middle;";

    GAME.spn1 = document.createElement("span");
    GAME.body.appendChild(GAME.spn1);

    GAME.spn2 = document.createElement("span");
    GAME.body.appendChild(GAME.spn2);

    GAME.div = document.createElement("div");
    GAME.body.appendChild(GAME.div);

    GAME.inp = document.createElement("input");
    GAME.body.appendChild(GAME.inp);

    GAME.btn = document.createElement("button");
    GAME.body.appendChild(GAME.btn);

    GAME.txt = "3.1";
    GAME.chgTxt(4);

    GAME.inp.type = "text";
    GAME.inp.size = "2";

    GAME.btn.innerHTML = "Validate";

    GAME.inp.addEventListener("input", function() {
        GAME.chgTxt(GAME.inp.value);
    });

    GAME.btn.addEventListener("click", GAME.vald, {
        once: true
    });
};

GAME.chgTxt = function(num) {
    const str = (num || "").toString();
    if (str.length > 0) {
        GAME.txt += str.replace(/[^0-9.]/g, "");
    } else {
        GAME.txt = GAME.txt.slice(0, -1);
    }

    var len = GAME.txt.replace(/[.]/g, "").length,
        max = Math.max(GAME.digits, GAME.num_of_digits);

    if (GAME.digits) {
        if (len > max) {
            GAME.txt = GAME.txt.slice(0, max - len);
        }
    }
    len = GAME.txt.replace(/[.]/g, "").length;
    GAME.div.innerHTML = GAME.txt.substring(Math.max(len - 3, 0));
    GAME.spn1.innerHTML = len;
    GAME.inp.value = " ";
};

GAME.getPi = function(indx) {
    const w = parseInt(indx / 1000),
        r = indx % 1000;
    return GAME.pi[w][r];
}

GAME.vald = function() {
    GAME.inp.style.display = "none";
    GAME.btn.innerHTML = "Continue";
    GAME.btn.addEventListener("click", function() {
        GAME.spn2.innerHTML = " ~ " + GAME.digits;
        GAME.btn.innerHTML = "Validate";
        GAME.inp.style.display = "inline-block";

        GAME.txt = "3";
        GAME.chgTxt();

        GAME.btn.addEventListener("click", GAME.vald, {
            once: true
        });
    }, {
        once: true
    });

    var test = GAME.txt.split("")
        .map(function(elem, indx) {
            var diff = ("" + elem).charCodeAt(0) - GAME.getPi(indx).charCodeAt(0);
            return diff;
        }),
        errors = [];

    GAME.digits = GAME.spn1.innerHTML;
    GAME.div.innerHTML = "";
    for (var i = 0; i < test.length; i++) {
        var color = "lightgreen";
        if (test[i] != 0) {
            color = "red";
            errors.push(i);
            if (GAME.digits > i) {
                GAME.digits = i + 1;
            }
        }

        GAME.div.innerHTML += "<a style='color:" +
            color + "'>" + GAME.txt[i] + "</a>";
    }


    if (errors.length > 0) {
        errors = errors.map(function(elem) {
            return [GAME.txt[elem], GAME.getPi(elem)];
        });
        GAME.div.innerHTML += "<br>" + JSON.stringify(errors);

        GAME.btn.innerHTML = "Reset";
    } else {
        if (GAME.digits > GAME.num_of_digits) {
            document.body.removeChild(GAME.body);
            GM_setValue("twl@pi-num-of-digits", GAME.digits);
            GM_setValue("twl@pi-last-tested-time", Date.now());
            GM_setValue("twl@pi-pi-digits", GAME.pi);
            main();
        }
        var output = "",
            digit = GAME.getPi(++GAME.digits);
        while (GAME.getPi(GAME.digits) == digit) {
            output += GAME.getPi(GAME.digits++);
        }
        GAME.div.innerHTML += "<br>Next digit: " + output;
    }
};

function find(selector, context) {
    return (context || document).querySelectorAll(selector);
}

function iframeDocument(node) {
    try {
        return node.contentWindow ? node.contentWindow.document : node.contentDocument;
    } catch (error) {
        return console.log("iframe document is not reachable: " + node.src), 0;
    }
}

function check(context) {
    var frames = [].slice.apply(find("iframe", context)),
        videoElements = [].slice.apply(find("video,audio", context));

    frames.forEach(function(element) {
        var frameDoc = iframeDocument(element);
        if (frameDoc) {
            [].push.apply(videoElements, check(frameDoc));
        }
    });

    return videoElements;
}

function main() {
    var time = Math.max(0, GM_getValue("twl@pi-last-tested-time", 0) + 3600000 - Date.now());
    console.log("Time left:", time);
    if (time) {
        setTimeout(main, time);
    } else {
        GAME.num_of_digits = GM_getValue("twl@pi-num-of-digits", 3);
        GAME.digits = 0;
        GAME.pi = GM_getValue("twl@pi-pi-digits", []);
        check(document).forEach(function(obj){obj.pause()});
        GAME.fetchPi();
    }
}
main();

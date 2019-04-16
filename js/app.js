"use strict";
(function initFV() {
    window.useInternal = true;
    Channels.init();

    Views.init();

    var chat = new Chatango(document.querySelector(".chat-area"));
    chat.asyncLoad();

    Config.init(document.querySelector(".config"));

    var mobileLogo = document.querySelector(".mobile-logo");
    mobileLogo.addEventListener("click", toggleMobileIcons);
})();

function toggleMobileIcons() {
    var controllers = document.querySelector(".controllers");
    if (controllers.className.match("default")) swapClass(controllers.classList, "default", "reveal");
    else swapClass(controllers.classList, "reveal", "default");
}

function defer(callback) {
    setTimeout(callback, 0);
}

function clone(obj) {
    if (!obj) throw "No object to clone";
    return JSON.parse(JSON.stringify(obj));
}

function getRandomWithinRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function indexOfDOMNode(nodeList, node) {
    return Array.prototype.slice.call(nodeList).indexOf(node);
}

function swapClass(classList, a, b) {
    if (!classList && !a && !b) throw "swapClass missing arguments!";
    classList.remove(a);
    classList.add(b);
    return classList;
}

function pickColor(seed, brightness) {
    var autoColor =
        "#" +
        "000000" +
        (
            parseInt(
                parseInt(seed, 36)
                    .toExponential()
                    .slice(2, -5),
                10
            ) & 0xffffff
        )
            .toString(16)
            .toUpperCase()
            .slice(-6);
    var num = parseInt(autoColor.slice(1), 16);
    var amt = Math.round(2.55 * brightness);
    var R = (num >> 16) + amt;
    var G = ((num >> 8) & 0x00ff) + amt;
    var B = (num & 0x0000ff) + amt;
    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
}

const ajax = {
    get: function get(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.responseText);
            };
            xhr.onerror = function() {
                reject("XMLHttpRequest failed!");
            };
            xhr.open("GET", url);
            xhr.send();
        });
    }
};

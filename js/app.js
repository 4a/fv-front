"use strict";

(function initFV() {
    Channels.init();

    var chat = new Chatango(document.querySelector(".chat-area"));
    chat.asyncLoad();

    Config.init(document.querySelector(".config"));
})();

function defer(callback) {
    setTimeout(callback, 0);
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

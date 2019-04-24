function Chatango(element, room, styles) {
    if (!element) throw "Chatango embed target has not been set!";

    const settingsTemplate = `{
        "handle":"fvumfe",
        "arch":"js",
        "styles":{
            "a":"000000",
            "b":0,
            "c":"FFFFFF",
            "d":"0099FF",
            "e":"000000",
            "f":50,
            "g":"FFFFFF",
            "i":0,
            "j":"FFFFFF",
            "k":"0099FF",
            "l":"383838",
            "m":"0099FF",
            "n":"FFFFFF",
            "p":9.9,
            "q":"000000",
            "r":100,
            "t":0,
            "u":1,
            "v":0,
            "w":0,
            "ab":1,
            "usricon":0.7,
            "cnrs":0.2,
            "sbc":"0086e0",
            "showhdr":0,
            "showx":0,
            "useonm":1
        }
    }`;

    this.target = element;
    this.room = room || JSON.parse(settingsTemplate).handle;
    this.styles = styles || JSON.parse(settingsTemplate).styles;

    this.asyncLoad = function chatangoAsyncLoad() {
        var script = document.createElement("script");
        var settings = JSON.parse(settingsTemplate);

        script.id = "cid0020000051538469084";
        script.src = "https://st.chatango.com/js/gz/emb.js";
        script.style.cssText = "width:100%; height:100%;";
        script.async = true;

        settings.handle = this.room || settings.handle;
        settings.styles = this.styles || settings.styles;

        script.text = JSON.stringify(settings);
        this.target.textContent = "";
        this.target.appendChild(script);
    };
}

// FIXME: probably impossible
Chatango.prototype.startKeyLogger = (function() {
    var _chatFocus = false;
    var _isTyping = false;
    var _typeTimeout;

    var _startTyping = function start() {
        if (!_chatFocus) return;
        clearTimeout(_typeTimeout);
        _typeTimeout = setTimeout(_stopTyping, 5000);
        if (!_isTyping) console.log("You are typing.");
        _isTyping = true;
    };

    var _stopTyping = function stop() {
        if (!_isTyping) return;
        clearTimeout(_typeTimeout);
        console.log("You stopped typing.");
        _isTyping = false;
    };

    var captureTyping = function capture() {
        document.body.addEventListener("mouseover", function(event) {
            if (event.target.tagName === "IFRAME") _chatFocus = true;
            else _chatFocus = false;
            _stopTyping();
        });
        document.addEventListener("keydown", _startTyping, true);
    };

    return captureTyping;
})();

function TwitchChat(element, room, styles) {
    if (!element) throw "Twitch chat embed target has not been set!";

    this.target = element;
    this.room = room;
    this.styles = styles || "darkpopout";

    function getHeight() {
        var streamArea = document.querySelector(".stream-area");
        var streams = document.querySelectorAll(".stream");
        var lastStream = streams[streams.length - 1];
        var offset = streamArea.getBoundingClientRect().bottom - lastStream.getBoundingClientRect().bottom;
        return `calc(100% - ${offset}px)`;
    }

    this.asyncLoad = function() {
        var iframe = document.createElement("iframe");
        iframe.src = `https://www.twitch.tv/embed/${this.room}/chat?${this.styles}`;
        iframe.style.height = getHeight();
        iframe.style.width = "100%";
        iframe.style.border = "0";
        this.target.textContent = "";
        this.target.appendChild(iframe);
    };
}

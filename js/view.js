const Views = (function ViewModule() {
    const Model = function View(template) {
        this._id = "FVS_" + Date.now();
        this.type = template ? template.type : "DOM";
        this.data = template ? template.data : null;
        this.playerAPI = null;
        this.element = null;
        this.history = [];
    };

    Model.prototype = {
        changeChannel,
        createViewElement,
        setActive,
        sudoku
    };

    const _viewPool = {};
    var _active = null;

    const ø = Object.create(null);
    const _events = {
        init: function startEventListeners() {
            // document.addEventListener("mouseup", _events.endResize);
        },
        addView: function addView() {
            var newView = add(this);
            handleAddClick.call(newView);
        },
        removeView: function removeView() {
            this.sudoku();
        },
        setActive: function setActive() {
            this.setActive();
        },
        startResize: function startResize(event) {
            document.documentElement.classList.add("drag");
            _events.activeReference = _events.captureMousePosition.bind(
                this,
                event.screenX,
                event.screenY,
                this.element.offsetWidth,
                this.element.offsetHeight
            );
            document.addEventListener("mousemove", _events.activeReference);
        },
        endResize: function endResize(xAdjustment, yAdjustment) {
            // this.element.style.width = xAdjustment + "px";
            // this.element.style.height = yAdjustment + "px";
            document.documentElement.classList.remove("drag");
            document.removeEventListener("mousemove", _events.activeReference);
            _events.activeReference = null;
        },
        captureMousePosition: function captureMousePosition(initX, initY, initWidth, initHeight, event) {
            var xAdjustment = event.screenX - initX + initWidth;
            var yAdjustment = event.screenY - initY + initHeight;
            console.log(xAdjustment, yAdjustment);
            this.element.style.width = xAdjustment + "px";
            // this.element.style.height = yAdjustment + "px";
            document.addEventListener("mouseup", _events.endResize.bind(this, xAdjustment, yAdjustment));
        },
        activeReference: null
    };

    const _sources = {
        twitch: {
            getUrl: function generateTwitchURL(channel) {
                return `https://player.twitch.tv/?channel=${channel}`;
            },
            embed: function embedTwitch(view, sameSrc = false) {
                if (sameSrc) return view.playerAPI.setChannel(view.data.channel), view.element;
                else if (window.Twitch) return createTwitchElement(view);
                else return createIframeElement(view);
            }
        },
        youtube: {
            getUrl: function generateYoutubeURL(v) {
                return `https://youtube.com/embed/${v}?autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1`;
            },
            embed: function embedYoutube(view, sameSrc = false) {
                createIframeElement(view);
            }
        },
        vaughnlive: {
            getUrl: function generateVaughnliveURL(channel) {
                return `https://vaughn.live/embed/video/${channel}?viewers=true&autoplay=true`;
            },
            embed: function embedVaughnlive(view, sameSrc = false) {
                createIframeElement(view);
            }
        },
        angelthump: {
            getUrl: function generateAngelthumpURL(channel) {
                return `https://player.angelthump.com/?channel=${channel}`;
            },
            embed: function embedAngelthump(view, sameSrc = false) {
                createIframeElement(view);
            }
        },
        any: {
            getUrl: function genericIframe(src) {
                return src;
            },
            embed: function embedGeneric(view, sameSrc = false) {
                createIframeElement(view);
            }
        }
    };

    function init() {
        var view = add();
        view.createViewElement();
        view.setActive();

        _events.init();
    }

    function getActive() {
        var view = _viewPool[_active];
        console.log(_active);
        return view;
    }

    function setActive() {
        _active = this._id;
        displayActiveElement(this._id);
        return this;
    }

    function displayActiveElement(id) {
        var active = document.getElementById(id);
        var views = document.querySelectorAll(".view");
        for (let view of views) {
            view.classList.remove("active");
        }
        active.classList.add("active");
    }

    function changeChannel(data) {
        var sameSrc = false;
        if (this.data && this.playerAPI) {
            sameSrc = this.data.src === data.src;
            this.history.push(this.data);
        }
        this.data = data;
        switch (this.type) {
            case "DOM":
                _sources[this.data.src].embed(this, sameSrc);
                break;
            case "window":
                console.log("hi");
                break;
            default:
                console.log("hey");
        }
        highlightViewedChannels();
    }

    function add(template) {
        var view = new Model(template);
        _viewPool[view._id] = view;
        return view;
    }

    function handleAddClick() {
        this.createViewElement();
        this.changeChannel(this.data);
    }

    function createViewElement() {
        var view = this;
        var container = document.querySelector(".stream-area");

        var viewElement = document.createElement("div");
        viewElement.id = view._id;
        viewElement.className = "view";

        var stream = document.createElement("div");
        stream.className = "stream";
        stream.style = "--aspect-ratio:16/9";

        var controller = document.createElement("div");
        controller.className = "view-controller";

        var addIcon = icon("add");
        addIcon.addEventListener("click", _events.addView.bind(view));

        var removeIcon = icon("remove");
        removeIcon.addEventListener("click", _events.removeView.bind(view));

        var starIcon = icon("star");
        starIcon.addEventListener("click", _events.setActive.bind(view));

        var chatIcon = icon("chat");
        var resizeIcon = icon("resize");
        resizeIcon.addEventListener("mousedown", _events.startResize.bind(view));

        controller.append(addIcon, removeIcon, starIcon, chatIcon, resizeIcon);

        viewElement.append(stream, controller);
        container.append(viewElement);

        this.element = viewElement;
        return viewElement;

        function icon(type) {
            var element = document.createElement("i");
            element.className = "material-icons " + type;
            return element;
        }
    }

    function createTwitchElement(view) {
        target = view.element.querySelector(".stream");
        target.id = view._id + "_twitch";
        target.textContent = "";
        var player = new window.Twitch.Player(target.id, {
            width: "100%",
            height: "100%",
            channel: view.data.channel,
            layout: "video",
            theme: "dark"
        });
        var iframe = player._bridge._iframe;
        iframe.className = "player";
        view.playerAPI = player;
        return iframe;
    }

    function createIframeElement(view) {
        target = view.element.querySelector(".stream");
        view.playerAPI = null;
        var url = _sources[view.data.src].getUrl(view.data.channel);
        var iframe = document.createElement("iframe");
        iframe.className = "player";
        iframe.src = url;
        target.textContent = "";
        target.appendChild(iframe);
        return iframe;
    }

    function highlightViewedChannels() {
        var icons = document.getElementsByClassName("channel");
        for (let icon of icons) {
            icon.classList.remove("active");
        }
        var views = Object.keys(_viewPool);
        for (let key of views) {
            let view = _viewPool[key];
            let id = "FV_" + view.data._id;
            document.getElementById(id).classList.add("active");
        }
    }

    function sudoku() {
        if (Object.keys(_viewPool).length < 2) throw "Should we delete the last element??";
        switch (this.type) {
            case "DOM":
                removeElementFromDOM.call(this);
                break;
            case "window":
                console.log("hi");
                break;
            default:
                console.log("hey");
        }
        delete _viewPool[this._id];
        return _viewPool;
    }

    function removeElementFromDOM() {
        this.element.parentNode.removeChild(this.element);
    }

    return {
        init,
        add,
        getActive,
        setActive,
        changeChannel,
        _viewPool
    };
})();

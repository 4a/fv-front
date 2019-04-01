const Views = (function ViewModule() {
    const Model = function View() {
        this.type = "DOM";
        this.data = null;
        this.apiObj = null;
        this.element = null;
        this.history = [];
    };

    Model.prototype = {
        changeChannel,
        sudoku
    };

    const _viewInstances = [];
    var _activeIndex = 0;

    const _sources = {
        twitch: {
            getUrl: function generateTwitchURL(channel) {
                return `https://player.twitch.tv/?channel=${channel}`;
            },
            embed: function embedTwitch(view, sameSrc = false) {
                if (sameSrc) return view.element.setChannel(view.data.channel), view.element;
                else if (Twitch) return createTwitchElement(view);
                else return createIframeElement(view);
            }
        },
        youtube: {
            getUrl: function generateYoutubeURL(v) {
                return `https://youtube.com/embed/v/${v}?autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1`;
            },
            embed: function embedYoutube(view, sameSrc = false) {
                createIframeElement(view);
            }
        }
    };

    function setActive() {
        var nodeList = document.querySelectorAll(".stream-area .stream");
        _activeIndex = indexOfDOMNode(nodeList, this.element);
        return _viewInstances[_activeIndex];
    }

    function changeChannel(data) {
        var sameSrc = false;
        var view = _viewInstances.length ? _viewInstances[_activeIndex] : add();
        if (view.data) {
            sameSrc = view.data.src === data.src;
            view.history.push(view.data);
        }
        view.data = data;
        switch (view.type) {
            case "DOM":
                view.element = _sources[view.data.src].embed(view, sameSrc);
                break;
            case "window":
                console.log("hi");
                break;
            default:
                console.log("hey");
        }
        highlightViewedChannels();
    }

    function add() {
        var view = new Model();
        _viewInstances.push(view);
        return view;
    }

    function createTwitchElement(view, target) {
        target = target || document.querySelector(".stream-area .stream");
        target.id = "twitch-embed";
        target.textContent = "";
        var player = new Twitch.Player("twitch-embed", {
            width: "100%",
            height: "100%",
            channel: view.data.channel,
            layout: "video",
            theme: "dark"
        });
        var element = player._bridge._iframe;
        element.className = "player";
        window.test = player;
        return player;
    }

    function createIframeElement(view, target) {
        target = target || document.querySelector(".stream-area .stream");
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
        for (let view of _viewInstances) {
            let id = "FV_" + view.data._id;
            document.getElementById(id).classList.add("active");
        }
    }

    function sudoku() {
        switch (this.type) {
            case "DOM":
                var nodeList = document.querySelectorAll(".stream-area .stream");
                var index = indexOfDOMNode(nodeList, this.element);
                removeElementFromDOM.call(this);
                break;
            case "window":
                console.log("hi");
                break;
            default:
                console.log("hey");
        }
        return _viewInstances.splice(index, 1);
    }

    function removeElementFromDOM() {
        this.element.parentNode.removeChild(this.element);
    }

    return {
        add,
        setActive,
        changeChannel
    };
})();

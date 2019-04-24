const Channels = (function ChannelModule() {
    const Model = function Channel(obj, id) {
        this.channel = obj.channel;
        this.icon = null;
        this.iconExternal = null;
        this.label = obj.channel;
        this.lastUpdate = Date.now();
        this.nodes = { icon: null, views: [] };
        this.online = false;
        this.popularity = 0;
        this.priority = 0;
        this.src = obj.src;
        this._id = id;
        return Object.assign(this, obj);
    };

    Model.prototype = {
        getUptime,
        createIconElement,
        updateIconElement,
        deleteIconElement
    };

    const _channelPool = {};
    const _lookup = {};
    /**
     * @affects DOM, _channelPool
     */
    async function init() {
        applyIconClicks();
        var data = await fetchData("api/channels");
        var channels = updateData(data);
        // addIconsToDOM(channels);
        pollAPI(true, 60000);
    }

    /**
     * @param {Boolean} loop Toggle looping functionality
     * @param {Number} interval Milliseconds to next loop
     * @affects DOM, _channelPool
     */
    var loops = 0;
    async function pollAPI(loop, interval) {
        if (loop && interval) {
            setTimeout(pollAPI.bind(this, true, interval), interval);
            console.log("Polling API. . .", "Loop: " + ++loops);
        }
        var data = await fetchData("api/channels");
        var channels = updateData(data);
        channels = deleteExpiredData(data);
        updateIconsInDOM(channels);
    }

    /**
     * @param {String} url Remote JSON address
     * @returns {Promise} Future data parsed from JSON response
     */
    async function fetchData(url) {
        var response = await fetch(url);
        if (response.status != 200) throw `Channels.fetchData Error: ${response.status}`;
        return response.json();
    }

    /**
     * @param {Object} data Data used to update _channelPool state
     * @affects _channelPool
     * @returns _channelPool reference after update
     */
    function updateData(data) {
        var channels = _channelPool;
        for (let _id in data) {
            if (!data.hasOwnProperty(_id)) continue; // skip prototype properties
            if (channels.hasOwnProperty(_id)) {
                Object.assign(channels[_id], data[_id]);
            } else {
                var source = new Model(data[_id]);
                addData(_id, source);
            }
        }
        return channels;
    }

    function addData(id, data) {
        var channels = _channelPool;
        channels[id] = data;
        addLookupEntry(channels[id]);
        console.log(`Created ${channels[id].label} data:`, channels[id]);
    }

    function addLookupEntry(data) {
        if (!_lookup.hasOwnProperty(data.src)) _lookup[data.src] = {};
        _lookup[data.src][data.channel] = "FV_" + data._id;
    }

    function deleteExpiredData(data) {
        var channels = _channelPool;
        for (let _id in channels) {
            if (_id[0] == "c") continue; // skip custom input channels
            if (!channels.hasOwnProperty(_id)) continue; // skip prototype properties
            if (!data.hasOwnProperty(_id)) {
                console.log(`Deleting ${channels[_id].label} data:`, channels[_id]);
                channels[_id].deleteIconElement();
                delete channels[_id];
            }
        }
        return channels;
    }

    function inputChannel(src, channel) {
        if (_lookup[src] && _lookup[src][channel]) {
            var id = _lookup[src][channel];
            var data = _channelPool[id];
        } else {
            var id = "c" + Date.now();
            var source = {};
            source[id] = { src, channel };
            var data = new Model(source[id], id);
            console.log(id, data);
            addData("FV_" + id, data);
        }
        var view = Views.getActive();
        view.changeChannel(data);
    }

    /**
     * @param {Object} channels Data iterated through, call createIconElement method on each
     * @affects DOM
     * @returns channels param reference (usually _channelPool)
     */
    function addIconsToDOM(channels) {
        for (let _id in channels) {
            if (!channels.hasOwnProperty(_id)) continue; // for inherited properties?
            let channel = channels[_id];
            channel.createIconElement();
        }
        return channels;
    }

    /**
     * @param {Object} channels Data iterated through, call updateIconElement method on each
     * @affects DOM
     * @returns channels param reference (usually _channelPool)
     */
    function updateIconsInDOM(channels) {
        var updatedDOM = false;
        for (let _id in channels) {
            if (!channels.hasOwnProperty(_id)) continue;
            let channel = channels[_id];
            if (channel.updateIconElement()) updatedDOM = true;
        }
        if (updatedDOM) sortIconsByPopularity(channels);
        return channels;
    }

    function getUptime() {
        console.log(this);
    }

    /**
     * @param {Boolean} allowDuplicates Allow duplicate DOM elements
     * @affects DOM, _channelPool
     * @returns DOM node reference
     */
    function createIconElement(allowDuplicates = false) {
        if (!allowDuplicates && this.nodes.icon) return this.nodes.icon;
        // console.log(`Created ${this.label} element:`, this);
        var id = "FV_" + this._id;

        var button = document.createElement("button");
        button.id = id;
        button.type = "button";
        button.classList = "channel";
        button.classList += this.online ? " online" : " offline";
        button.dataset.popularity = this.popularity;
        // button.disabled = !this.online;

        var icon = document.createElement("img");
        if (window.useInternal && this.icon !== "http://fightanvidya.com/SI/IC/") {
            icon.src = this.icon;
            icon.classList = "icon";
        } else if (this.iconExternal) {
            icon.src = this.iconExternal;
            icon.classList = "icon external";
            var border = generateIconBorder(this.channel);
            icon.style["border-top-color"] = border.top;
            icon.style["border-right-color"] = border.right;
            icon.style["border-left-color"] = border.left;
            icon.style["border-bottom-color"] = border.bottom;
        } else {
            icon.src = "http://fightanvidya.com/SI/IC/twitch.png";
            icon.classList = "icon external";
        }

        var label = document.createElement("label");
        label.htmlFor = id;
        label.classList = "label";
        label.textContent = this.popularity ? `${this.label} (${this.popularity})` : this.label;

        button.appendChild(icon);
        button.appendChild(label);

        document.querySelector(".online").appendChild(button);
        return (this.nodes.icon = button);
    }

    /**
     * @affects DOM
     * @returns DOM node reference
     */
    function updateIconElement() {
        var updated = false;
        if (!this.nodes.icon) {
            this.nodes.icon = this.createIconElement();
            updated = true;
        }
        var button = this.nodes.icon;
        var icon = button.querySelector(".icon");
        var label = button.querySelector(".label");

        var hasStatus = button.className.match(/o(n|ff)line/gi);
        var DOMStatus = hasStatus ? hasStatus[0] : "offline";
        var status = this.online ? "online" : "offline";
        if (DOMStatus !== status) {
            swapClass(button.classList, DOMStatus, status);
            console.log(`Updated ${this.label} element status:`, this);
            updated = true;
        }

        var DOMPopularity = button.dataset.popularity;
        if (DOMPopularity != this.popularity) {
            button.dataset.popularity = this.popularity;
            label.textContent = this.popularity ? `${this.label} (${this.popularity})` : this.label;
            console.log(`Updated ${this.label} element popularity:`, this);
            updated = true;
        }

        if (icon.className.match("external") && this.iconExternal && icon.src != this.iconExternal) {
            icon.src = this.iconExternal;
            console.log(`Updated ${this.label} element icon:`, this);
            updated = true;
        }

        return updated;
    }

    function deleteIconElement() {
        if (!this.nodes.icon) throw "Icon doesn't exist??";
        return this.nodes.icon.remove();
    }

    function generateIconBorder(channel) {
        const highlight = pickColor(channel, 15);
        const shadow = pickColor(channel, -15);
        return {
            top: highlight,
            right: highlight,
            bottom: shadow,
            left: shadow
        };
    }

    function applyIconClicks() {
        var delegator = document.querySelector(".channel-area");
        delegator.addEventListener("click", function(event) {
            var delegate = event.target.parentNode;
            if (!delegate.classList.contains("channel") || delegate.disabled) return;
            handleIconClick.call(_channelPool[delegate.id]);
        });
    }

    function handleIconClick() {
        console.log(`Clicked ${this.label} element:`, this);
        var view = Views.getActive();
        view.changeChannel(this);
        // if (!_views.length) setTarget(new View(target, url, this));
        // var view = _views[0];
        // console.log(_views);
        // view.changeChannel();
        // return view;
    }

    function createViewElement(allowDuplicates = true) {
        if (!allowDuplicates && this.nodes.views.length) return this.nodes.views;

        var div = document.createElement("div");
        div.classList = "channel";
        div.setAttribute("data-src", this.src);
        div.setAttribute("data-chan", this.channel);

        var icon = document.createElement("img");
        icon.classList = "channel-icon";
        icon.src = "http://fightanvidya.com/SI/IC/weebow.png";

        var label = document.createElement("label");
        label.classList = "channel-label";
        label.textContent = this.label;

        div.appendChild(icon);
        div.appendChild(label);

        document.querySelector(".online").appendChild(div);
        this.nodes.icons.push(div);
        return this.nodes.icons;
    }

    function sortIconsByPopularity(channels) {
        var ids = Object.keys(channels);
        ids.sort(function(b, a) {
            return channels[a].popularity - channels[b].popularity;
        });
        for (let id of ids) {
            let icon = channels[id].nodes.icon;
            icon.parentNode.append(icon);
        }
    }

    return {
        init,
        _channelPool,
        _lookup,
        inputChannel
    };
})();

function WaifuBox(element) {
    this.element = element;
    this.src = "twitch";
    var buttons = element.querySelectorAll("button");
    var input = element.querySelector("input");
    for (let button of buttons) {
        button.addEventListener("click", this.handleClick.bind(this, button, input));
    }
    input.addEventListener("keyup", this.submitInput.bind(this, input));
}

WaifuBox.prototype.handleClick = function(button, input, event) {
    var src = button.dataset.src;
    var channel = input.value;
    Channels.inputChannel(src, channel);
    this.src = src;
};

WaifuBox.prototype.submitInput = function(input, event) {
    if (event.key != "Enter") return;
    var src = this.src;
    var channel = input.value;
    Channels.inputChannel(src, channel);
};

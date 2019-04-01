const Channels = (function ChannelModule() {
    const Model = function Channel(obj) {
        this.nodes = { icon: null, views: [] };
        return Object.assign(this, obj);
    };

    Model.prototype = {
        getUptime,
        createIconElement,
        updateIconElement
    };

    const _channelPool = {};

    /**
     * @affects DOM, _channelPool
     */
    async function init() {
        applyIconClicks();
        var data = await fetchData("api/channels");
        var channels = updateData(data);
        addIconsToDOM(channels);
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
            if (!data.hasOwnProperty(_id)) continue;
            if (channels.hasOwnProperty(_id)) {
                Object.assign(channels[_id], data[_id]);
            } else {
                channels[_id] = new Model(data[_id]);
                console.log(`Created ${channels[_id].label} data:`, channels[_id]);
            }
        }
        return channels;
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
        for (let _id in channels) {
            if (!channels.hasOwnProperty(_id)) continue;
            let channel = channels[_id];
            channel.updateIconElement();
        }
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
        // button.disabled = !this.online;

        var icon = document.createElement("img");
        if (this.icon !== "http://fightanvidya.com/SI/IC/") {
            icon.src = this.icon;
            icon.classList = "icon";
        } else {
            icon.src = this.iconExternal;
            icon.classList = "icon external";
            var border = generateIconBorder(this.channel);
            icon.style["border-top-color"] = border.top;
            icon.style["border-right-color"] = border.right;
            icon.style["border-left-color"] = border.left;
            icon.style["border-bottom-color"] = border.bottom;
        }

        var label = document.createElement("label");
        label.htmlFor = id;
        label.classList = "label";
        label.textContent = this.label;

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
        if (!this.nodes.icon) this.nodes.icon = this.createIconElement();
        var button = this.nodes.icon;
        var hasStatus = button.className.match(/o(n|ff)line/gi);
        var DOMStatus = hasStatus ? hasStatus[0] : "offline";
        var status = this.online ? "online" : "offline";
        if (DOMStatus !== status) {
            swapClass(button.classList, DOMStatus, status);
            console.log(`Updated ${this.label} element:`, this);
        }
        return button;
    }

    function generateIconBorder(channel) {
        const highlight = pickColor(30);
        const shadow = pickColor(0);
        return {
            top: highlight,
            right: highlight,
            bottom: shadow,
            left: shadow
        };

        function pickColor(brightness) {
            var autoColor =
                "#" +
                "000000" +
                (
                    parseInt(
                        parseInt(channel.replace("_", ""), 36)
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
        Views.changeChannel(this);
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

    return {
        init
    };
})();

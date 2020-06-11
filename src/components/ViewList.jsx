import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { sourceMap } from "../common/SourceMap";
// @ts-ignore
// import Twitch from "twitch-embed";

import { View } from "./View";

class _ViewList extends Component {
    constructor(props) {
        super(props);
        this.element = createRef();

        this.state = {
            popout: null
        }

        // Bind event callbacks
        this.getPixelWidth = this.getPixelWidth.bind(this);
        this.trackViews = this.trackViews.bind(this);
    }

    async trackViews() {
        const payload = {
            views: []
        };
        for (let key in this.props.views) {
            const view = this.props.views[key];
            payload.views.push({
                host: view.host,
                embed_id: view.embed_id
            });
        }
        const data = await fetch(`${process.env.REACT_APP_API_URL}channels/trackViewer`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        this.props.updateChannels(data);
    }

    getPixelWidth() {
        return Number(this.element.current.offsetWidth);
    }

    renderViews() {
        const views = [];
        for (let key in this.props.views) {
            if (key === "popout") continue;
            const view = this.props.views[key];
            const element = (
                <View
                    key={key}
                    id={key}
                    active={key === this.props.active}
                    data={view}
                    getMaxWidth={this.getPixelWidth}
                    trackViews={this.trackViews}
                />
            );
            views.push(element);
        }
        return views;
    }

    renderPopout() {
        const popout = this.props.views.popout;
        const embed = (function() {
            const instance = this.state.popout;
            const src = sourceMap[popout.host].getSrc(popout.embed_id, 0);
            instance.document.title = popout.display.label;
            instance.document.body.background = "#000";
            instance.document.body.style.height = "100vh";
            instance.document.body.style.width = "100vw";
            instance.document.body.style.margin = "0";
            instance.document.body.innerHTML = `<iframe src="${src}" style="background: #000; height: 100%; width: 100%; border: 0" />`;
        }).bind(this);
        if (this.props.active === "popout") {
            if (this.state.popout === null || this.state.popout.closed) {
                this.setState({popout: window.open("", "", "width=853,height=480", "location=no")}, embed);
            } else {
                embed();
            }
        }
    }

    render() {
        const views = this.renderViews();
        this.renderPopout();
        return (
            <div className="stream-area" ref={this.element}>
                {views}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        active: state.views.active,
        views: state.views.list
    };
};

export const ViewList = connect(mapStateToProps)(_ViewList);

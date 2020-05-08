import React, { Component, createRef } from "react";
import { connect } from "react-redux";
// @ts-ignore
// import Twitch from "twitch-embed";

import { View } from "./View";

class _ViewList extends Component {
    constructor(props) {
        super(props);
        this.element = createRef();

        // Bind event callbacks
        this.getPixelWidth = this.getPixelWidth.bind(this);
    }

    getPixelWidth() {
        return Number(this.element.current.offsetWidth);
    }

    renderViews() {
        const views = [];
        for (let key in this.props.views) {
            const view = this.props.views[key];
            const element = (
                <View
                    key={key}
                    id={key}
                    active={key === this.props.active}
                    data={view}
                    getMaxWidth={this.getPixelWidth}
                />
            );
            views.push(element);
        }
        return views;
    }

    render() {
        const views = this.renderViews();
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

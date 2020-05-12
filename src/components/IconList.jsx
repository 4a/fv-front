import React, { Component } from "react";
import { connect } from "react-redux";
import { setChannel } from "../actions";

import { Icon } from "./Icon";

class _IconList_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFilter: 1
        };
        this.filters = {
            // className: Label
            online: "Online",
            "online-popular": "Online + Popular",
            popular: "Popular",
            other: "Other",
            history: "History",
            offline: "Offline",
            all: "Online + Offline"
        };

        this.renderFilterSelect = this.renderFilterSelect.bind(this);
    }

    changeFilter(step) {
        const min = 0;
        const max = Object.keys(this.filters).length - 1;
        const keepInRange = num => (num < min ? max : max < num ? min : num); // keep min < num < max, loop back when over/under
        this.setState(previousState => {
            const currentFilter = keepInRange(previousState.currentFilter + step);
            return { currentFilter };
        });
    }

    sort(icons) {
        icons = icons.sort((a, b) => a.props.data.groups.priority - b.props.data.groups.priority);
        switch (this.state.currentFilter) {
            case 1: // Online + Popular
            case 2: // Popular
                return icons.sort((a, b) => Object.keys(b.props.data.viewers).length - Object.keys(a.props.data.viewers).length);
            default:
                return icons;
        }
    }

    getActiveChannels(views) {
        const activeChannels = {};
        for (let key in views) {
            const view = views[key];
            activeChannels[`${view.host}_${view.embed_id}`] = true;
        }
        return activeChannels;
    }

    renderFilterSelect() {
        const indexes = {};
        Object.keys(this.filters).forEach((filter, i) => indexes[filter] = i);
        return (
            <select className="filter-select" onChange={(e) => this.setState({currentFilter: indexes[e.target.value]})}>
            {
                Object.keys(this.filters).map((filter, i) => {
                    return <option selected={i === this.state.currentFilter} value={filter}>{this.filters[filter]}</option>
                })
            }
            </select>
        );
    }

    renderIcons() {
        const channels = this.props.channels;
        const activeChannels = this.getActiveChannels(this.props.views);
        const icons = [];
        for (const id in channels) {
            const channel = channels[id];
            const isActive = activeChannels[`${channel.host}_${channel.embed_id}`] || false;
            const icon = <Icon key={id} data={channel} active={isActive} />;
            icons.push(icon);
        }
        return this.sort(icons);
    }

    render() {
        const filterClasses = Object.keys(this.filters);
        const filterClass = filterClasses[this.state.currentFilter];
        const label = this.filters[filterClass];
        const icons = this.renderIcons();
        return (
            // TODO: different arrow icons, option select dropdown for filters?
            <section className="icon-area">
                <h3 className="channel-header">
                    <span className="arrow left" onClick={() => this.changeFilter(-1)}>
                        «
                    </span>
                    {/* <span className="label">{label}</span> */}
                    { this.renderFilterSelect() }
                    <span className="arrow right" onClick={() => this.changeFilter(1)}>
                        »
                    </span>
                </h3>
                <section className={`channels ${filterClass}`}>{icons}</section>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        active: state.views.active,
        views: state.views.list
    };
};

const mapDispatchToProps = dispatch => ({
    setChannel: data => dispatch(setChannel(data))
});

export const IconList = connect(
    mapStateToProps,
    mapDispatchToProps
)(_IconList_);

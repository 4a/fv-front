import React, { Component } from "react";
import { connect } from "react-redux";
import { setChannel } from "../actions";
import { sourceMap } from "../common/SourceMap";
import { pickColor } from "../common/PickColor";

const mapDispatchToProps = dispatch => ({
    setChannel: data => dispatch(setChannel(data))
});

export class _Icon extends Component {
    constructor(props) {
        super(props);

        // Bind event callbacks
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.props.setChannel(this.props.data);
    }

    getImage(data) {
        const { icon, iconExternal } = data;
        const notFound = icon === "http://fightanvidya.com/SI/IC/";
        const iconDefault = "http://fightanvidya.com/SI/IC/twitch.png";
        return notFound ? iconExternal || iconDefault : icon;
    }

    getBorder(channel) {
        const highlight = pickColor(channel, 15);
        const shadow = pickColor(channel, -15);
        return { highlight, shadow };
    }

    render() {
        const data = this.props.data;
        const image = this.getImage(data);
        const url = sourceMap[data.src].getUrl(data.channel);
        const status = data.online ? "online" : "offline";
        const active = this.props.active ? "active" : "";
        const label = data.popularity ? `${data.label} (${data.popularity})` : data.label;
        const { highlight, shadow } = this.getBorder(data.channel);
        return (
            <a
                href={url}
                id={`FV_${data._id}`}
                className={`channel ${status} ${active}`}
                data-popularity={data.popularity}
                onClick={this.handleClick}
            >
                <img
                    className="icon"
                    src={image}
                    alt={data.channel}
                    style={{ borderColor: `${highlight} ${highlight} ${shadow} ${shadow}` }}
                />
                <span className="label">{label}</span>
            </a>
        );
    }
}

export const Icon = connect(
    null,
    mapDispatchToProps
)(_Icon);

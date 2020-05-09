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

    getImage(data) { // TODO: custom icon support
        return (true || data.display.use_custom_icon) ? `http://fightanvidya.com/SI/IC/${data.display.custom_icon}` : data.display.icon;
    }

    getBorder(channel) {
        const highlight = pickColor(channel, 15);
        const shadow = pickColor(channel, -15);
        return { highlight, shadow };
    }

    render() {
        const data = this.props.data;
        const image = this.getImage(data);
        const url = sourceMap[data.host] && sourceMap[data.host].getUrl(data.embed_id) || "test";
        const status = data.live ? "online" : "offline";
        const active = this.props.active ? "active" : "";
        const label = data.statistics.popularity ? `${data.display.label} (${data.statistics.popularity})` : data.display.label;
        const { highlight, shadow } = this.getBorder(data.embed_id);
        return (
            <a
                href={url}
                id={`FV_${data._id}`}
                className={`channel ${status} ${active}`}
                data-popularity={data.statistics.popularity}
                onClick={this.handleClick}
            >
                <img
                    className="icon"
                    src={image}
                    alt={data.embed_id}
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

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

    getImage(data) { // TODO: make less retarded
        const noImage = {
            twitch: 'jtv',
            ustream: 'ust',
            livestream: 'lst',
            youtube: 'yut',
            niconico: 'nnd',
            vaughnlive: 'vtv',
            any: 'any'
        };
        return (data.display.use_custom_icon) 
        ? `${process.env.REACT_APP_MEDIA_PATH}SI/IC/${data.display.custom_icon}` 
        : data.display.icon
        || `${process.env.REACT_APP_MEDIA_PATH}IS/${noImage[data.host]}2x.png`;
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
        const popularity = Object.keys(data.viewers).length;
        const label = popularity ? `${data.display.label} (${popularity})` : data.display.label;
        const borderClass = data.display.use_border ? "border" : "borderless";
        const { highlight, shadow } = this.getBorder(data.embed_id);
        return (
            <a
                href={url}
                id={`FV_${data._id}`}
                className={`channel ${status} ${active}`}
                data-popularity={popularity}
                onClick={this.handleClick}
            >
                <img
                    className={`icon ${borderClass}`}
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

import React, { Component } from "react";
import { connect } from "react-redux";
import { setChannel } from "../actions";

const mapDispatchToProps = dispatch => ({
    setChannel: data => dispatch(setChannel(data))
});

export class _UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = { host: "twitch", embed_id: "" };

        // Bind event callbacks
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleClick(event) {
        const host = event.target.alt;
        this.setState(x => ({ host }), this.changeChannel);
    }

    handleChange(event) {
        const embed_id = event.target.value;
        this.setState(x => ({ embed_id }));
    }

    handleKeyPress(event) {
        switch (event.key) {
            case "Enter":
                this.changeChannel();
                break;
            default:
                break;
        }
    }

    changeChannel() {
        const { host, embed_id } = this.state;
        this.props.setChannel({ host, embed_id });
    }

    render() {
        return (
            <section className="waifu-box">
                <button data-host="twitch" type="button" className={this.state.host === "twitch" ? "active" : ""}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/jtv.png`} alt="twitch" onClick={this.handleClick} />
                </button>
                <button data-host="livestream" type="button" className={this.state.host === "livestream" ? "active" : ""}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/lst.png`} alt="livestream" onClick={this.handleClick} />
                </button>
                <button data-host="youtube" type="button" className={this.state.host === "youtube" ? "active" : ""}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/yut.png`} alt="youtube" onClick={this.handleClick} />
                </button>
                <button data-host="nicovideo" type="button" className={this.state.host === "nicovideo" ? "active" : ""}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/nnd.png`} alt="nicovideo" onClick={this.handleClick} />
                </button>
                <button data-host="vaughnlive" type="button" className={this.state.host === "vaughnlive" ? "active" : ""}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/vtv.png`} alt="vaughnlive" onClick={this.handleClick} />
                </button>
                <button data-host="any" type="button" className={this.state.host === "any" ? "active" : ""}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/any.png`} alt="any" onClick={this.handleClick} />
                </button>
                <input
                    type="search"
                    placeholder="No Waifus Allowed"
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />
            </section>
        );
    }
}

export const UserInput = connect(
    null,
    mapDispatchToProps
)(_UserInput);

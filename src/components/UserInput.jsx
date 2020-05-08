import React, { Component } from "react";
import { connect } from "react-redux";
import { setChannel } from "../actions";

const mapDispatchToProps = dispatch => ({
    setChannel: data => dispatch(setChannel(data))
});

// FIXME: Use TypeScript

export class _UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = { src: "twitch", channel: "" };

        // Bind event callbacks
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleClick(event) {
        const src = event.target.alt;
        this.setState(λ => ({ src }), this.changeChannel);
    }

    handleChange(event) {
        const channel = event.target.value;
        this.setState(λ => ({ channel }));
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
        const { src, channel } = this.state;
        this.props.setChannel({ src, channel });
    }

    render() {
        return (
            <section className="waifu-box">
                <button data-src="twitch" type="button" className={this.state.src === "twitch" ? "active" : ""}>
                    <img src="http://fightanvidya.com/IS/jtv.png" alt="twitch" onClick={this.handleClick} />
                </button>
                <button data-src="livestream" type="button" className={this.state.src === "livestream" ? "active" : ""}>
                    <img src="http://fightanvidya.com/IS/lst.png" alt="livestream" onClick={this.handleClick} />
                </button>
                <button data-src="youtube" type="button" className={this.state.src === "youtube" ? "active" : ""}>
                    <img src="http://fightanvidya.com/IS/yut.png" alt="youtube" onClick={this.handleClick} />
                </button>
                <button data-src="nicovideo" type="button" className={this.state.src === "nicovideo" ? "active" : ""}>
                    <img src="http://fightanvidya.com/IS/nnd.png" alt="nicovideo" onClick={this.handleClick} />
                </button>
                <button data-src="vaughnlive" type="button" className={this.state.src === "vaughnlive" ? "active" : ""}>
                    <img src="http://fightanvidya.com/IS/vtv.png" alt="vaughnlive" onClick={this.handleClick} />
                </button>
                <button data-src="any" type="button" className={this.state.src === "any" ? "active" : ""}>
                    <img src="http://fightanvidya.com/IS/any.png" alt="any" onClick={this.handleClick} />
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

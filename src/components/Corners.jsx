import React, { Component } from "react";
import { pad } from "../common/Helpers";

export class Corners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cw: 40,
            cwl: 7
        }

        this.cycleCornerWaifu = this.cycleCornerWaifu.bind(this);
        this.cycleCornerWaifuLeft = this.cycleCornerWaifuLeft.bind(this);
    }

    cycleCornerWaifu() {
        const first = 1;
        const last = 40;
        const missing = {"30": 31, "38": 39};
        const next = this.state.cw === last ? first : missing[this.state.cw + 1] ? missing[this.state.cw + 1] : this.state.cw + 1;
        this.setState({cw: next});
    }

    cycleCornerWaifuLeft() {
        const first = 3;
        const last = 8;
        const missing = {"1": 3, "2": 3};
        const next = this.state.cwl === last ? first : missing[this.state.cwl + 1] ? missing[this.state.cwl + 1] : this.state.cwl + 1;
        this.setState({cwl: next});
    }

    render() {
        return (
            <>
                <div id="cw" onClick={this.cycleCornerWaifu}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/CWA/CW${pad(this.state.cw, 3)}.${ this.state.cw == 28 ? 'gif' : 'png' }`} />
                </div>
                <div id="cwl" onClick={this.cycleCornerWaifuLeft}>
                    <img src={`${process.env.REACT_APP_MEDIA_PATH}IS/CWA/CWL${pad(this.state.cwl, 3)}.png`} />
                </div>
            </>
        )
    }
};

import React, { Component } from "react";
import { pad } from "../common/Helpers";

export class Corners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cw: 40,
            cwl: 7,
            clicks: 0
        }
        this.unlockThreshold = 2;
        this.timeout = null;

        this.cycleCornerWaifu = this.cycleCornerWaifu.bind(this);
        this.cycleCornerWaifuLeft = this.cycleCornerWaifuLeft.bind(this);
        this.lock = this.lock.bind(this);
        this.delayLock = this.delayLock.bind(this);
    }

    cycleCornerWaifu() {
        const locked = this.state.clicks < this.unlockThreshold;
        this.delayLock();
        if (!locked) {
            const first = 1;
            const last = 40;
            const missing = {"8": 9, "30": 31, "38": 39};
            const next = this.state.cw === last ? first : missing[this.state.cw + 1] ? missing[this.state.cw + 1] : this.state.cw + 1;
            this.setState({cw: next});
        } else {
            this.setState({clicks: this.state.clicks + 1});
        }
    }

    cycleCornerWaifuLeft() {
        const locked = this.state.clicks < this.unlockThreshold;
        this.delayLock();
        if (!locked) {
            const first = 3;
            const last = 8;
            const missing = {"1": 3, "2": 3};
            const next = this.state.cwl === last ? first : missing[this.state.cwl + 1] ? missing[this.state.cwl + 1] : this.state.cwl + 1;
            this.setState({cwl: next});
        } else {
            this.setState({clicks: this.state.clicks + 1})
        }
    }

    lock() {
        this.setState({clicks: 0});
        this.timeout = null; // probably not necessary
    }

    delayLock() {
        if (this.timeout !== null) {
            clearInterval(this.timeout);
        }
        this.timeout = setTimeout(this.lock, 1000);
    }

    render() {
        const cw = this.props.theme === "robotpuke" ? 
            `${process.env.REACT_APP_MEDIA_PATH}IS/CWA/CW000.png` :
            `${process.env.REACT_APP_MEDIA_PATH}IS/CWA/CW${pad(this.state.cw, 3)}.${ this.state.cw == 28 ? 'gif' : 'png' }`;

        const cwl = this.props.theme === "robotpuke" ? 
            `${process.env.REACT_APP_MEDIA_PATH}IS/CWA/CWL000.png` :
            `${process.env.REACT_APP_MEDIA_PATH}IS/CWA/CWL${pad(this.state.cwl, 3)}.png`;

        return (
            <>
                <div id="theme-toggler" onClick={this.props.toggleTheme}></div>
                <div id="cw" onClick={this.cycleCornerWaifu}>
                    <img 
                        draggable="false" 
                        src={cw} 
                    />
                </div>
                <div id="cwl" onClick={this.cycleCornerWaifuLeft}>
                    <img
                        draggable="false"  
                        src={cwl} 
                    />
                </div>
            </>
        )
    }
};

// import { Props } from "./App.d";

import React, { Component } from "react";
// import { connect } from "react-redux";
// import "./App.css";
import { Header } from "./components/Header";
import { ViewList } from "./components/ViewList";
import { Chat } from "./components/Chat";
import { UserInput } from "./components/UserInput";
import { IconList } from "./components/IconList";
import { Corners } from "./components/Corners";

// const data = require("./channels.json");

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: "1500px",
            channels: {},
            theme: "robotpuke"
            // views: []
        };
        this.counter = 0;

        this.updateChannels = this.updateChannels.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.toggleTheme = this.toggleTheme.bind(this);
    }

    fetchChannelsLoop(interval) {
        const context = this;
        (function loop() {
            context.fetchChannels();
            setTimeout(loop, interval);
        })();
    }

    async fetchChannels() {
        const data = await fetch(`${process.env.REACT_APP_API_URL}channels`).then(res => res.json());
        console.log(this.counter++);
        this.updateChannels(data);
    }

    updateChannels(data) {
        this.setState({ channels: data });
    }

    componentDidMount() {
        this.fetchChannelsLoop(30000);
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    setWidth(newWidth) {
        this.setState({width: newWidth});
    }

    toggleTheme() { // TODO: support more than two themes
        const theme = this.state.theme === "fv" ? "robotpuke" : "fv";
        this.setState({theme})
    }

    render() {
        return (
            <div id="theme-wrapper" className={this.state.theme}>
                <main className="fv-main default">
                    <Header theme={this.state.theme} setWidth={this.setWidth} />
                    <section className="grid" style={{ width: this.state.width }}>
                        <section className="mobile-header">
                            <img
                                className="mobile-logo"
                                src={`${process.env.REACT_APP_MEDIA_PATH}IS/mob_logo.png`}
                                alt="Fightan Vidya"
                            />
                        </section>
                        <ViewList updateChannels={this.updateChannels} />
                        <div className="chat-area">
                            <Chat theme={this.state.theme} />
                        </div>
                    </section>
                    <div className="controllers">
                        <UserInput />
                        <IconList channels={this.state.channels} />
                    </div>
                    <footer />
                </main>
                <Corners theme={this.state.theme} toggleTheme={this.toggleTheme} />
            </div>
        );
    }
}

export default App;

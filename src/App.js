// import { Props } from "./App.d";

import React, { Component } from "react";
// import { connect } from "react-redux";
// import "./App.css";
import { Header } from "./components/Header";
import { ViewList } from "./components/ViewList";
import { Chat } from "./components/Chat";
import { UserInput } from "./components/UserInput";
import { IconList } from "./components/IconList";
import { fitToWidth, fitToHeight } from "./common/SetViewWidth";

// const data = require("./channels.json");

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channels: {},
            // views: []
        };
        this.counter = 0;

        this.updateChannels = this.updateChannels.bind(this);
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
        fitToHeight();
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        return (
            <main className="fv-main default">
                <Header />
                <section className="grid" style={{ width: "1500px" }}>
                    <section className="mobile-header">
                        <img
                            className="mobile-logo"
                            src={`${process.env.REACT_APP_MEDIA_PATH}IS/mob_logo.png`}
                            alt="Fightan Vidya"
                        />
                    </section>
                    <ViewList updateChannels={this.updateChannels} />
                    <div className="chat-area">
                        <Chat />
                    </div>
                </section>
                <div className="controllers">
                    <UserInput />
                    <IconList channels={this.state.channels} />
                </div>
                <footer />
            </main>
        );
    }
}

export default App;

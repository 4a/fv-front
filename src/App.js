// import { Props } from "./App.d";

import React, { Component } from "react";
// import { connect } from "react-redux";
// import "./App.css";
import { Header } from "./components/Header";
import { ViewList } from "./components/ViewList";
import { Chat } from "./components/Chat";
import { UserInput } from "./components/UserInput";
import { IconList } from "./components/IconList";

// const data = require("./channels.json");

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channels: {},
            // views: []
        };
        this.counter = 0;
    }

    fetchChannelsLoop(interval) {
        const context = this;
        (function loop() {
            context.fetchChannels();
            setTimeout(loop, interval);
        })();
    }

    async fetchChannels() {
        // const data = await fetch("http://fightanvidya.com/4a4a/2019/api/channels").then(res => res.json());
        const data = await fetch("http://localhost:8000/api/channels/").then(res => res.json());
        console.log(this.counter++);
        this.setState({ channels: data });
        return data;
    }

    componentDidMount() {
        this.fetchChannelsLoop(120000);
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
                            src="http://fightanvidya.com/IS/mob_logo.png"
                            alt="Fightan Vidya"
                        />
                    </section>
                    <ViewList />
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

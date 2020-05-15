import React, { Component } from "react";

export class Header extends Component {
    constructor(props) {
        super(props);
        
        this.fitToWidth = this.fitToWidth.bind(this);
        this.fitToHeight = this.fitToHeight.bind(this);
    }

    fitToWidth() {
        this.props.setWidth("99999999px");
    }

    fitToHeight() {
        const available_height = window.innerHeight;
        const viewport_y_offset = document.querySelector('.grid').getBoundingClientRect().top;
        const viewport_height = document.querySelector('.stream-area').getBoundingClientRect().height;
        const viewport_width = document.querySelector('.stream-area').getBoundingClientRect().width;
        const view_aspect_ratio = 16 / 9;
        const bottom_content_height = 161;
        const chat_width = document.querySelector('.chat-area').getBoundingClientRect().width;
        const new_view_height = available_height - (viewport_y_offset + (viewport_height - (viewport_width / view_aspect_ratio)) + bottom_content_height);
        const new_view_width = Math.round(new_view_height * view_aspect_ratio);
        const width = new_view_width + chat_width + "px";
        this.props.setWidth(width);
    }

    render() {
        return (
            <header>
                <a href="/">
                    <img alt="Fightan Vidya" src={`${process.env.REACT_APP_MEDIA_PATH}IS/FVLogo.png`} />
                </a>
                <nav className="menu">
                    <a href="/stream">
                        <img alt="Stream" src={`${process.env.REACT_APP_MEDIA_PATH}IS/STREAM.png`} />
                    </a>
                    <img alt="/" src={`${process.env.REACT_APP_MEDIA_PATH}IS/DIV.png`} />
                    <a href="/wiki">
                        <img alt="Wiki" src={`${process.env.REACT_APP_MEDIA_PATH}IS/WIKI.png`} />
                    </a>
                    <img alt="/" src={`${process.env.REACT_APP_MEDIA_PATH}IS/DIV.png`} />
                    <a href="/betmain">
                        <img alt="Bets" src={`${process.env.REACT_APP_MEDIA_PATH}IS/BETS.png`} />
                    </a>
                </nav>
                <div style={{padding: "1em"}}>
                    <span className="pseudo-link" onClick={this.fitToHeight}>Fit To Height</span>
                    / 
                    <span className="pseudo-link" onClick={this.fitToWidth}>Fit To Width</span>
                </div>
            </header>
        )
    }
};

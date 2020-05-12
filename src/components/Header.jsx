import React from "react";
import { fitToWidth, fitToHeight } from "../common/SetViewWidth";

export const Header = () => {
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
                <span className="pseudo-link" onClick={fitToWidth} >Fit To Width</span>
                /
                <span className="pseudo-link" onClick={fitToHeight} >Fit To Height</span>
            </div>
        </header>
    );
};

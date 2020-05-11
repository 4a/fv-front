import React from "react";

export const Header = () => {
    return (
        <header>
            <a href="/">
                <img alt="Fightan Vidya" src={`${process.env.REACT_APP_MEDIA_PATH}IS/FVLogo.png`} />
            </a>
            <nav className="menu">
                <a href="stream">
                    <img alt="Stream" src={`${process.env.REACT_APP_MEDIA_PATH}IS/STREAM.png`} />
                </a>
                <img alt="/" src={`${process.env.REACT_APP_MEDIA_PATH}IS/DIV.png`} />
                <a href="wiki">
                    <img alt="Wiki" src={`${process.env.REACT_APP_MEDIA_PATH}IS/WIKI.png`} />
                </a>
                <img alt="/" src={`${process.env.REACT_APP_MEDIA_PATH}IS/DIV.png`} />
                <a href="betmain">
                    <img alt="Bets" src={`${process.env.REACT_APP_MEDIA_PATH}IS/BETS.png`} />
                </a>
            </nav>
        </header>
    );
};

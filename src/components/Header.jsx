import React from "react";

export const Header = () => {
    return (
        <header>
            <a href="/">
                <img alt="Fightan Vidya" src="http://fightanvidya.com/IS/FVLogo.png" />
            </a>
            <nav className="menu">
                <a href="stream">
                    <img alt="Stream" src="http://fightanvidya.com/IS/STREAM.png" />
                </a>
                <img alt="/" src="http://fightanvidya.com/IS/DIV.png" />
                <a href="wiki">
                    <img alt="Wiki" src="http://fightanvidya.com/IS/WIKI.png" />
                </a>
                <img alt="/" src="http://fightanvidya.com/IS/DIV.png" />
                <a href="betmain">
                    <img alt="Bets" src="http://fightanvidya.com/IS/BETS.png" />
                </a>
            </nav>
        </header>
    );
};

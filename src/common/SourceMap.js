export const sourceMap = {
    twitch: {
        getSrc: channel => `https://player.twitch.tv/?channel=${channel}`,
        getUrl: channel => `https://twitch.tv/${channel}`
    },
    youtube: {
        getSrc: (v, s) =>
            `https://youtube.com/embed/${v}?autoplay=1&color=white&enablejsapi=1&showinfo=1&autohide=2&start=${s}`,
        getUrl: v => `https://youtube.com/watch?v=${v}`
    },
    livestream: {
        getSrc: v => `https://youtube.com/embed/${v}?autoplay=1&color=white&enablejsapi=1&showinfo=1&autohide=2`,
        getUrl: v => `https://youtube.com/watch?v=${v}`
    },
    vaughnlive: {
        getSrc: channel => `https://vaughn.live/embed/video/${channel}?viewers=true&autoplay=true`,
        getUrl: channel => `https://vaughn.live/${channel}`
    },
    angelthump: {
        getSrc: channel => `https://player.angelthump.com/?channel=${channel}`,
        getUrl: channel => `https://player.angelthump.com/?channel=${channel}`
    },
    any: {
        getSrc: src => src,
        getUrl: src => src
    }
};

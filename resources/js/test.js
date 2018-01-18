"use strict";

const embed = {
	"getHtml": (url) => `<iframe class='stream' src='${url}' frameborder=0 scrolling='no' allowfullscreen></iframe>`,
	"pattern": /(https?:\/\/)|(www.)|(twitch.tv\/)|(justin.tv\/)|(ustream.tv\/(channel\/)?)|(livestream.com\/)|((live.)?nicovideo.jp\/watch\/)|(hitbox.tv\/)|((gaming.)?youtube.com\/(watch\?v=)?(v\/)?)|(youtu.be\/)/gi,
	"ttv": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|(twitch.tv\/)/gi,
		"getStream": (channel) => embed.getHtml(`//player.twitch.tv/?channel=${channel}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"ust": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|(ustream.tv\/(channel\/)?)/gi,
		"getStream": (id) => embed.getHtml(`//www.ustream.tv/embed/${id}?html5ui&wmode=direct&autoplay=true`),
		"getVod": (id) => embed.getHtml(`//www.ustream.tv/embed/recorded/${id}?v=3&autoplay=true`)
	},
	"lst": {
		"bar": 29,
		"pattern": /(https?:\/\/)|(www.)|(livestream.com\/)/gi,
		"getStream": (channel) => embed.getHtml(`//player.twitch.tv/?channel=${channel}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"yut": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|((gaming.)?youtube.com\/(watch\?v=)?(v\/)?)|(youtu.be\/)/gi,
		"getStream": (v, start) => embed.getHtml(`//www.youtube.com/embed/${v}?autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1&start=${start}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"nnd": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|((live.)?nicovideo.jp\/watch\/)/gi,
		"getStream": (channel) => embed.getHtml(`//player.twitch.tv/?channel=${channel}`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	},
	"htv": {
		"bar": 0,
		"pattern": /(https?:\/\/)|(www.)|(hitbox.tv\/)/gi,
		"getStream": (channel) => embed.getHtml(`//www.hitbox.tv/embed/${channel}?popout=true&autoplay=true`),
		"getVod": (video) => embed.getHtml(`//player.twitch.tv/?autoplay=true&video=${video}`)
	}
}

class PageElement {
	constructor (selector) {
		this.element = $(selector);
	}
}

class StreamArea extends PageElement {
	constructor (selector) {
		super(selector)
	}
	addStream (obj) {
		if (!obj.el) this.element.append( obj.create() );
	}
}

class Stream {
	constructor (site, channel) {
		this.site = site;
		this.channel = channel;
		this.el = null;
		this.selected = 0;
		this.ratio = {
			"A": 16,
			"B": 9
		}
		this.ratioLocked = 1;
	}
	create () {
		const div = $('<div>').addClass('streamwrap');
		const iframe = embed[this.site].getStream(this.channel);
		this.el = div.html(iframe);
		return this.el;
	}
	destroy () {
		if (this.el) this.el.remove();
		this.el = null;
	}
}

class IconArea extends PageElement {
	constructor (selector) {
		super(selector);
		this.updateRate = 120000;
	}
	populate () {

	}
	update () {

	}
}

/*
icon object:
{
	"name": "",
	"alt": "",
	"icon": "",
	"chan": "",
	"site": "",
	"category": "",
	"visible": num,
	"priority": num,
	"live": num,
	"updated": date
}
*/
class Icon 
{
	constructor (parent, obj) {
		this.parent = $(parent);
		this.el = null;
		this.imgHtml = `<img src='${obj.icon}'>`;
	}
	create () {
		const el = $('<div>').addClass('icon');
		el.append(imgHtml);
		parent.append(el);
		this.el = el;
	}
	destroy () {

	}
	click () {
		
	}
	hover () {

	}
	update () {

	}
}
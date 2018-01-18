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
		this.position = null;
	}
	move () {

	}
	resize () {

	}
}

class StreamArea extends PageElement {
	constructor (selector) {
		super(selector)
		this.streams = [];
	}
	addStream (stream) {
		if (this.findStream(stream) > -1) this.removeStream(stream);
		stream.create();
		this.element.append( stream.jqEl );
		this.streams.push( stream );
	}
	findStream (stream) {
		return this.streams.indexOf(stream)
	}
	removeStream (stream) {
		stream.jqEl.remove();
		this.streams.splice(this.findStream(stream), 1);
	}
}

class Stream {
	constructor (site, channel) {
		this.site = site;
		this.channel = channel;
		this.jqEl = null;
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
		this.jqEl = div.html(iframe);
	}
	destroy () {
		if (this.el) this.el.remove();
		this.jqEl = null;
	}
}

class IconArea extends PageElement {
	constructor (selector, icons) {
		super(selector);
		this.icons = icons || [];
		this.updateRate = 120000;
	}
	init () {

	}
	update () {

	}
	addIcon (icon) {
		if (this.findIcon(icon) > -1) this.removeStream(icon);
		icon.create();
		this.element.append( icon.jqEl );
		this.streams.push( icon );
	}
	findIcon (icon) {
		return this.icons.indexOf(icon)
	}
	removeIcon (icon) {
		icon.jqEl.remove();
		this.streams.splice(this.findIcon(icon), 1);
	}
}

class Icon {
	constructor (obj) {
		this.jqEl = null;
		this.imgHtml = `<img src='${obj.icon}'>`;
	}
	create () {
		const div = $('<div>').addClass('icon');
		div.append(this.imgHtml);
		this.jqEl = div;
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
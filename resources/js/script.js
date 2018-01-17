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

const Stream = function(parent) {
	parent = $(parent);
	this.selected = 0;
	this.el = null;

	this.create = function() {
		const el = $('<div>').addClass('streamwrap');
		parent.append(el);
		this.el = el;
	}

	this.destroy = function() {
		this.el.remove();
		this.el = null;
	}

	this.embed = function(state, channel) {
		if (!this.el) this.create(); 
		this.el.html( embed[state].getStream(channel) );
	}
}

const Icon = function(parent, obj) {
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
	parent = $(parent);
	const self = this;
	this.el = null;

	const imgHtml = `<img src='${obj.icon}'>`;

	this.create = function() {
		const el = $('<div>').addClass('icon');
		el.append(imgHtml);
		parent.append(el);
		this.el = el;
	}

	this.destroy = function() {

	}

	this.click = function() {
		
	}

	this.hover = function() {

	}

	this.update = function() {

	}
}

var tbar = 32, ubar = 0, lbar = 29, ybar = 0, nbar = 0, hbar = 0;

var fit = 0, chat = 0, isHtml5, lazy;
var histCookie = localStorage.getItem("histStorage");

$(window).bind(
    "beforeunload", 
    function() { 
        var obj = {};
	$.ajax({
		method: 'get',
		url: 'resources/data/popular.data.php',
		data: obj,
		dataType: 'json'
	})
	.done(function(response){
		console.log(response);
	});
    }
)

function pageLoaded(){//note--can place a stream function in here to auto-select stream
	streamwrap = $(".streamwrap");
	setChannelListeners(streamwrap);
	$(".makeactivebutton").hide();
	$(".playbutton").hide();
	//$("body").mouseup(endResize);
	geton();
	if (fitCookie != null) {fitwidth(fitCookie);}
        //if (styleCookie) {styleToggler();}
	if (histCookie != "null") {$('#historycont').html(histCookie);dragDelete();}                
	ttv('srkevo1');
	//yut('edpfV-VPoo4');$('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='http://challonge.com/MeltyButtsII' target='_blank'><img alt='2' title='http://challonge.com/MeltyButtsII' src='http://www.google.com/s2/favicons?domain=http://challonge.com/MeltyButtsII'/></a>");
}

function dragDelete() {
    var current;
    function removeIcon(e) {
        if (current) {
            current.parentNode.removeChild(current);
            var histHTML = $('#historycont').html();
            localStorage.setItem("histStorage", histHTML);
        }
    }
    function prependIcon(e) {
        if (current) {
        //alert(current.innerHTML);
            document.getElementById('historycont').insertBefore(current, document.getElementById('historycont').firstChild);
            var histHTML = $('#historycont').html();
            localStorage.setItem("histStorage", histHTML);
        }
    }    
    function thisIcon() {
    	current = this;
    }
    function noDef(e) {
        e.preventDefault();
    }
    document.getElementById('historycont').addEventListener("dragleave", removeIcon);
//    document.getElementById('historycont').addEventListener("dragenter", noDef);
//    document.getElementById('historycont').addEventListener("dragover", noDef);
//    document.getElementById('historycont').addEventListener("drop", prependIcon);
    var draggables = document.querySelectorAll('#historycont li');
    for (var i = 0; i < draggables.length; i++) {
        draggables[i].addEventListener("dragstart", thisIcon);
    }
}

function newChannel(target, e){
	jqt = $(target);
	streamwrap = jqt.parents(".streamwrap");
	newstream = streamwrap.clone();
	newstream.insertBefore("#walllol");
	newstream.ready(function(){
		setChannelListeners(newstream);
		newstream.find(".makeactivebutton").show();
		newstream.find(".isactivebutton").hide();
		newstream.find(".astreamcontainer").removeAttr("id");//clears ID on the new channel
	});
	if (e.shiftKey && !(streamwrap.css("position") === "absolute")) {
		channelObj = newstream.find('.astreamcontainer').children().eq(0);
		channelObj.attr("height", parseInt(channelObj.height()/3));channelObj.attr("width", parseInt(channelObj.width()/3));
		newstream.css({"position": "absolute", "top": streamwrap.position().top, "left": streamwrap.position().left, "z-index": "9999"});
		newstream.find(".buttonwrap").addClass("dragwrap");
		//newstream.find(".astreamcontainer").attr("id", "STREAMCONTAINER");
		makeActive(newstream.find(".makeactivebutton"));
	} else if (streamwrap.css("position") === "absolute") {
		newstream.css("left", streamwrap.position().left + streamwrap.width());
	}
}

function setChannelListeners(jqt){
	jqt.find(".resize").mousedown(function(event){startResize(event.target)});
	jqt.find(".newchanbutton").click(function(event){newChannel(event.target, event)});
	jqt.find(".makeactivebutton").click(function(event){makeActive(event.target)});
	jqt.find(".removebutton").click(function(event){removeChannel(event.target)});
	jqt.find(".c2").mousedown(function(event){dragChannel(event.target, event)});
	//jqt.find(".playbutton").click(function(event){resume(event.target)});
	//jqt.find(".pausebutton").click(function(event){pause(event.target)});
}

function makeActive(target){
	oldactive = $("#STREAMCONTAINER").parent();
	oldactive.find(".isactivebutton").hide();
	oldactive.find(".makeactivebutton").show();
	$("#STREAMCONTAINER").removeAttr("id");
	console.log("Making active...");
	newactive = $(target).parents(".streamwrap");
	newactive.find(".astreamcontainer").attr("id", "STREAMCONTAINER");
	newactive.find(".isactivebutton").show();
	newactive.find(".makeactivebutton").hide();
}

function makePassive(target){
	jqt = $(target);
}

function removeChannel(target){
if ($('.streamwrap').length > 1) {
	jqt = $(target).parents(".streamwrap");
	jqt.remove();
	} else { 
	any('');
	}
	if ($(".dragwrap").length === 0) {
		$("#mainbox").css("overflow", "");
	}
}

function makeDraggable(target) {
	jqt = $(target).parents(".streamwrap");
	top = jqt.position().top;
	left = jqt.position().left;
	bar = jqt.find(".buttonwrap");
	if (!(jqt.css("position") === "absolute") && event.shiftKey) {
		jqt.css({"position": "absolute", "top": top, "left": left, "z-index": "9999"});	
		console.log('test');
		bar.addClass("dragwrap");
	} else {
		jqt.css({"position": "", "top": "", "left": "", "z-index": ""});
		bar.removeClass("dragwrap");
		if ($(".dragwrap").length === 0) {
			$("#mainbox").css("overflow", "");
		}
	}
}

function dragChannel(target, e){
	jqt = $(target).parents(".streamwrap");
	top = jqt.position().top;
	left = jqt.position().left;
	bar = jqt.find(".buttonwrap");
	if ((!(jqt.css("position") === "absolute") && e.shiftKey) || (jqt.css("position") === "absolute" && !(e.ctrlKey)) ) {
		if ($('.streamwrap').length > 0) {
			$("html").mouseup(endDrag);
			$("html").mouseleave(endDrag);
			$("#mainbox").css("overflow", "visible");
			$(".easyresize").show();
			bar.addClass("dragwrap");
			jqt.find('.astreamcontainer iframe').css({'box-shadow': '5px 5px 5px 0px rgba(0,0,0,0.5)'});
			nondrags = $('.streamwrap').length - $('.dragwrap').length;
			if (nondrags === 0) {
				$("#mainbox").css("min-height", $("#mainbox").height());
			}
			jqt.css({"position": "absolute", "top": top, "left": left, "z-index": "9999"});
			window.resizeX = null;
			window.resizeY = null;
			$("html").mousemove(function(event){
				if(window.resizeX != null) {
					xDif = event.pageX - window.resizeX;
					window.resizeX = event.pageX;
					yDif = event.pageY - window.resizeY;
					window.resizeY = event.pageY;
					curY = jqt.position().top;
					curX = jqt.position().left;
					newY = yDif + curY;
					newX = xDif + curX;
					jqt.css("top", newY);
					jqt.css("left", newX);
				} else {
					window.resizeX = event.pageX;
					window.resizeY = event.pageY;
				}
		
			});
		}
	} else if (e.ctrlKey) {
	//alert('test');
		jqt.css({"position": "", "top": "", "left": "", "z-index": ""});
		bar.removeClass("dragwrap");
		jqt.find('.astreamcontainer iframe').css('box-shadow', '');
		if ($(".dragwrap").length === 0) {
			$("#mainbox").css("overflow", "");
			$("#mainbox").css("min-height", "");
		}
	}
}

function endDrag(){
	$("html").unbind('mouseup');
	$("html").unbind('mousemove');
	$(".easyresize").hide();
}

function startResize(target){
$("html").mouseup(endResize);
$("html").mouseleave(endResize);
    var jqt = $(target).parents(".streamwrap");
    var mainW = document.getElementById("mainbox").offsetWidth;
    var chatW = document.getElementById("chatbox").offsetWidth;
    var streamW = document.getElementById("streamconstrain").offsetWidth;
    var playerW = mainW - chatW;
    var playerH = (playerW / (16 / 9));
    var bar = parseInt($(target).parents('.streamwrap').find('.astreamcontainer').attr("data-bar"),10);
    var ant = $(target).parents('.streamwrap').find('.astreamcontainer').attr("data-antecedent");
    var con = $(target).parents('.streamwrap').find('.astreamcontainer').attr("data-consequent");
    var easyresize = $(target).parents('.streamwrap').find('.easyresize');
    //var resizeColor = shadeColor1(stringHexNumber($(target).parents('.streamwrap').find('.astreamcontainer').attr("data-chan")), 0);
    //alert(resizeColor);
	var streamObj = $(target).parents('.streamwrap').find('object');
	var streamEmb = $(target).parents('.streamwrap').find('embed');
	var streamIfr = $(target).parents('.streamwrap').find('iframe');
	var dragwrap = $(target).parents('.dragwrap');
	console.log(dragwrap);
	window.resizeX = null;
	window.resizeY = null;
	console.log($("#chatbox").height());
$("#chatbox").height($("#chatbox").height());
$("#chatbox").find('.easyresize').height($("#mainbox").height());
	$("html").mousemove(function(event){
	$(".easyresize").show();
	easyresize.css("background-color", "#fff");
		if(window.resizeX != null){
			xDif = event.pageX - window.resizeX;
			window.resizeX = event.pageX;
			yDif = event.pageY - window.resizeY;
			window.resizeY = event.pageY;
			if (streamIfr.length) {
			curWidth = parseInt(streamIfr.attr("width"), 10);
			curHeight = parseInt(streamIfr.attr("height"), 10);
			} else {
			curWidth = parseInt(streamObj.attr("width"), 10);
			curHeight = parseInt(streamObj.attr("height"), 10);}			
			newWidth = xDif + curWidth;
			if (newWidth > playerW && !(event.altKey) && !(jqt.css("position") === "absolute")) {
				constrainWidth = playerW;
			}
			else if (newWidth <= ((playerW / 2) + 5) && newWidth >= ((playerW / 2) - 5) && !dragwrap.length) {
			constrainWidth = Math.floor(playerW / 2);}
			else if (newWidth <= ((playerW / 3) + 5) && newWidth >= ((playerW / 3) - 5) && !dragwrap.length) {
			constrainWidth = Math.floor(playerW / 3);}
			else if (newWidth <= ((playerW * (2 / 3)) + 5) && newWidth >= ((playerW * (2 / 3)) - 5) && !dragwrap.length) {
			constrainWidth = Math.floor(playerW * (2 / 3));}
			else {
			constrainWidth = newWidth;
			$("#streamconstrain").css("overflow", "visible");
			}
			if((event.ctrlKey)) {
				newHeight = yDif + curHeight;
				$(target).parents('.streamwrap').find('.astreamcontainer').attr("data-antecedent", newWidth);
   				$(target).parents('.streamwrap').find('.astreamcontainer').attr("data-consequent", newHeight);
  			} else if((event.shiftKey)) {
				constrainWidth = curWidth;
				newHeight = yDif + curHeight;
				newBar = newHeight - (constrainWidth / (ant/con));
				$(target).parents('.streamwrap').find('.astreamcontainer').attr("data-bar", newBar);
  			} else {
				if (($(target).parents('.streamwrap').find('.sitename').val() === "nnl") || ($(target).parents('.streamwrap').find('.sitename').val() === "nnd")) {
   				newHeight = (constrainWidth / ((ant/con) * 0.9836065573770492)) + bar;
   				} else {
   				newHeight = (constrainWidth / (ant/con)) + bar;
   				}
			}
			if (streamObj.length) {
			streamObj.attr("width", constrainWidth);
			streamObj.attr("height", newHeight);}
			if (streamEmb.length) {
			streamEmb.attr("width", constrainWidth);
			streamEmb.attr("height", newHeight);}
			if (streamIfr.length) {
			streamIfr.attr("width", constrainWidth);
			streamIfr.attr("height", newHeight);}
			//if (!guideW) {
			easyresize.css("width", constrainWidth);
			//}
			easyresize.css("height", newHeight);
		} else {
			window.resizeX = event.pageX;
			window.resizeY = event.pageY;
		}
	});
}

function endResize(e){
	$("html").unbind('mouseup');
	$("html").unbind('mousemove');
	$(".easyresize").hide();
	$(".easyresize").css("background-color", "transparent");
	//$("#chatbox").css("min-height", $("#chatbox").height());
	$("#chatbox").height("auto");
	var maxVidW = Math.max.apply(Math, $('.streamwrap').map(function(){ return $(this).width(); }).get());
	if (e.altKey) {
		$("#streamconstrain").width(maxVidW);
		$("#mainbox").width((maxVidW + $("#chatbox").width()));
		createCookie('userFit',maxVidW + $("#chatbox").width(),365);
	}
$("#streamconstrain").css("overflow", "hidden");
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

var fitCookie = readCookie('userFit');
var styleCookie = readCookie('rp');
//don't steal this part, it's extremely stupid!
function fitwidth(w) {
    "use strict";
    var availW, mainW, chatW, constrainW, newconstrainW, embedCode, i, len, streamW, playerW, playerH, bar, ant, con;
    if (w == undefined) {
    	availW = $(window).width();
    } else {
    	availW = parseInt(w);
    }
    $('#mainbox').css('max-width', 'none');
    $('#streamconstrain').css('max-width', 'none');
    if (fit === 0) {
        $('#mainbox').width(availW - 70);
        if ($('#mainbox').width() < 1040) {
            if (chat == 2) {$('#chatbox').width(0);}
            else {$('#chatbox').width(330);}
        } else {
            if (chat == 2) {$('#chatbox').width(0);}
            else {$('#chatbox').width(400);}
        }
if ($('.streamwrap').length === 1 && availW === $(window).width()) {
        $('#fittog').html("Fit to Height");
        fit = 2;
} else {
        $('#fittog').html("Center");
	fit = 1;
}
        createCookie('userFit',availW,365);
    } else if (fit === 2) {
      if ($('.streamwrap').length === 1) {
        var asrat = $('.streamwrap:eq(0)').find('.astreamcontainer').attr("data-antecedent")/$('.streamwrap:eq(0)').find('.astreamcontainer').attr("data-consequent");
        var bottomHeight = $('#onboxes').offset().top + 50 - $('#bottom').offset().top;
        if (bottomHeight > 0) {
          $('#onboxes').attr("data-offset", bottomHeight);
        }
        var barMaxOffset = 32 - $('.streamwrap:eq(0)').find('.astreamcontainer').attr("data-bar");
        var vidHeight = (($(window).height() - ($('#mainbox').offset().top + ($('#streamconstrain').height() - ($('#STREAMCONTAINER').width()/(asrat))) + ( parseInt($('#onboxes').attr('data-offset')) )) - 2) - barMaxOffset);
        var vidWidth = vidHeight * (asrat); vidWidth = Math.round(vidWidth);
        var fitchat;
        if (vidWidth > 640 && $('#chatbox').width() > 0) {
          fitchat = 400;
        } else if ($('#chatbox').width() > 0) {
          fitchat = 330;
        } else {
          fitchat = 0;
        }
        $('#mainbox').width(vidWidth + fitchat /*$('#chatbox').width()*/);
        if ($('#mainbox').width() < 1040) {
            if (chat == 2) {$('#chatbox').width(0);}
            else {$('#chatbox').width(330);}
        } else {
            if (chat == 2) {$('#chatbox').width(0);}
            else {$('#chatbox').width(400);}
        }
      }
        $('#fittog').html("Center");
        fit = 1;
        createCookie('userFit',vidWidth + fitchat + 70,365);//alert(fitchat + " " + $('#chatbox').width());
    } else  {
        $('#mainbox').width(970);
        if (chat == 2) {$('#chatbox').width(0);}
        else {$('#chatbox').width(330);}
        $('#fittog').html("Fit to Width");
        fit = 0;
        eraseCookie('userFit');
    } 
    mainW = $('#mainbox').width();
    chatW = $('#chatbox').width();
    constrainW = $('#streamconstrain').width();
    newconstrainW = mainW - chatW;
    embedCode = $('.streamwrap');
    for (i = 0, len = embedCode.length; i < len; i += 1) {
        streamW = $('.streamwrap:eq(' + i + ')').width();
        if (embedCode.length === 1) {
            playerW = newconstrainW;
        } else {
            playerW = Math.floor(newconstrainW * (streamW / constrainW));
        }
        ant = $('.streamwrap:eq(' + i + ')').find('.astreamcontainer').attr("data-antecedent");
        con = $('.streamwrap:eq(' + i + ')').find('.astreamcontainer').attr("data-consequent");
        bar = parseInt($('.streamwrap:eq(' + i + ')').find('.astreamcontainer').attr("data-bar"),10);
        if ((ant != "16") || (con != "9")) {
        	if (($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "nnl") || ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "nnd")) {
        		playerH = (playerW / ( (ant / con) * 0.9836065573770492 ));
		} else {
        		playerH = (playerW / (ant / con) );
        	}
        } else {
        	if (($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "nnl") || ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "nnd")) {
        		playerH = (playerW / (16 / 9.15));
        	} else {
        		playerH = (playerW / (16 / 9));
       		}
        }
        /*	
//        if ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "ttv" && !lazy) {
        if ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "ttv") {
            bar = tbar;
        } else if ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "jtv") {
            bar = tbar;
        } else if ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === 'ust') {
            bar = ubar;
        } else if ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === 'lst') {
            bar = lbar;
        } else if ($('.streamwrap:eq(' + i + ')').find('.sitename').val() === "nnd") {
            bar = nbar;           
        } else {
            bar = 0;
        }
        */
        if (embedCode[i].getElementsByTagName("object").length) {
            embedCode[i].getElementsByTagName("object")[0].setAttribute("width", playerW);
            embedCode[i].getElementsByTagName("object")[0].setAttribute("height", (playerH + bar));
        }
        if (embedCode[i].getElementsByTagName("embed").length) {
            embedCode[i].getElementsByTagName("embed")[0].setAttribute("width", playerW);
            embedCode[i].getElementsByTagName("embed")[0].setAttribute("height", playerH + bar);
        }
        if (embedCode[i].getElementsByTagName("iframe").length) {
            embedCode[i].getElementsByTagName("iframe")[0].setAttribute("width", playerW);
            embedCode[i].getElementsByTagName("iframe")[0].setAttribute("height", playerH + bar);
        }
    }
    $('#streamconstrain').width(newconstrainW);
}

function fitheight() {
fit = 2;
fitwidth();
}

function hidechat() {
	if (chat == 0) {
		$('#chatbox').hide();
		$('#chatbox2').show();
		if (lazy == true) {
		 if (style == 1) {
		  $('#chatbox').html('');
		  $('#chatbox2').html('<div class="easyresize" style="display:none;background:transparent;opacity:0.3;height:100%;width:100%;position:absolute;z-index:10"></div> <iframe width="100%" height="100%" src="embed/rpchat.php" frameborder=0 scrolling="no"></iframe>');
		 } else {
		  $('#chatbox').html('');
		  $('#chatbox2').html('<div class="easyresize" style="display:none;background:transparent;opacity:0.3;height:100%;width:100%;position:absolute;z-index:10"></div> <iframe width="100%" height="100%" src="embed/fvchat.php" frameborder=0 scrolling="no"></iframe>');
		 } 
		} 
		$('#fittog').html("Disabled");
		document.getElementById("mainbox").style.maxWidth = "100%";
	        document.getElementById("streamconstrain").style.maxWidth = "100%";
		document.getElementById("mainbox").style.width = "100%";
		document.getElementById("streamconstrain").style.width = "100%";
		$('#chattog').html("Hide Chat Box");
		fit = 2;
		chat = 1;
		mainW = document.getElementById("mainbox").offsetWidth;
		chatW = document.getElementById("chatbox").offsetWidth;
		playerW = mainW - chatW;
		document.getElementById("streamconstrain").style.width = playerW;
	} else if (chat == 1) {
		$('#chatbox2').hide();
		if (lazy) {
		  $('#chatbox').html('');
		  $('#chatbox2').html('');
		}
		$('#chattog').html("Fixed Chat Box");
		$('#fittog').html("Center");
		fit = 1;
		chat = 2;
		fitwidth();
		mainW = document.getElementById("mainbox").offsetWidth;
		chatW = document.getElementById("chatbox").offsetWidth;
		playerW = mainW - chatW;
		document.getElementById("streamconstrain").style.width = playerW;
	} else {
		$('#chatbox').show();
		if (lazy) {
		 if (style == 1) {
		  $('#chatbox').html('<iframe width="100%" height="100%" src="embed/rpchat.php" frameborder=0 scrolling="no"></iframe>');
		  $('#chatbox2').html('');
		 } else {
		  $('#chatbox').html('<iframe width="100%" height="100%" src="embed/fvchat.php" frameborder=0 scrolling="no"></iframe>');
		  $('#chatbox2').html('');
		 } 
		} 
		$('#chattog').html("Free Chat Box");
		fit = 1;
		chat = 0;
		fitwidth();
		mainW = document.getElementById("mainbox").offsetWidth;
		chatW = document.getElementById("chatbox").offsetWidth;
		playerW = mainW - chatW;
		document.getElementById("streamconstrain").style.width = playerW;
	}
}

function list_streams() {
	var obj = {};
	var streams = $('.astreamcontainer');
	for(var i = 0; i < streams.length; i++) {
		var site = $(streams[i]).attr('data-site');
		var chan = $(streams[i]).attr('data-chan');
		if (!obj.hasOwnProperty(site)) {
    			obj[site] = [];
		}
		if ( obj[site].indexOf(chan) < 0 ) {
			obj[site].push(chan);
    		}
	}
	$.ajax({
		method: 'get',
		url: 'resources/data/popular.data.php',
		data: obj,
		dataType: 'json'
	})
	.done(function(response){
		console.log(response);
		getwater();
	});
}

//dont copy these crazy if things, just use regular expressions
function jtv(obj) {
console.log("jtv");
    urlInput = document.getElementById('urlInput');
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent"))) + 32;
    var a = document.createElement('a');
    if ((obj.toLowerCase().substr(0, 9) === "justin.tv") || (obj.toLowerCase().substr(0, 10) === "justin.tv/") || (obj.toLowerCase().substr(0, 13) === "www.justin.tv") || (obj.toLowerCase().substr(0, 14) === "www.justin.tv/") || (obj.toLowerCase().substr(0, 9) === "twitch.tv") || (obj.toLowerCase().substr(0, 10) === "twitch.tv/") || (obj.toLowerCase().substr(0, 13) === "www.twitch.tv") || (obj.toLowerCase().substr(0, 14) === "www.twitch.tv/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 17) !== "http://justin.tv/") && (obj.toLowerCase().substr(0, 18) !== "https://justin.tv/") && (obj.toLowerCase().substr(0, 21) !== "http://www.justin.tv/") && (obj.toLowerCase().substr(0, 22) !== "https://www.justin.tv/") && (obj.toLowerCase().substr(0, 17) !== "http://twitch.tv/") && (obj.toLowerCase().substr(0, 18) !== "https://twitch.tv/") && (obj.toLowerCase().substr(0, 21) !== "http://www.twitch.tv/") && (obj.toLowerCase().substr(0, 22) !== "https://www.twitch.tv/")) {
        a.href = 'http://justin.tv/' + obj;
    }
    else {
        a.href = obj;
    }
    var urlPath = a.pathname.split("/");
    if ((a.pathname.toLowerCase().substr(0, 1) !== "/")) {
        var channel = urlPath[0];
        var vidtype = urlPath[1];
        var archive = urlPath[2];
        var archiveindex = 2;
    } else {
        var channel = urlPath[1];
        var vidtype = urlPath[2];
        var archive = urlPath[3];
        var archiveindex = 3;
    }
    var urlQuery = [],
        hash;
    var q = a.href.split('?')[1];
    if (q !== undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            urlQuery.push(hash[1]);
            urlQuery[hash[0]] = hash[1];
        }
    }
    if(urlQuery['t']) {
    	if (urlQuery['t'].indexOf('h') > -1) {var hours = urlQuery['t'].split('h')[0]*3600;}else{var hours = 0;}
    	if (urlQuery['t'].indexOf('m') > -1) {var minutes = urlQuery['t'].split('m')[0].split(/[A-Za-z]/); minutes = minutes[minutes.length -1]*60;}else{var minutes = 0;}
    	if (urlQuery['t'].indexOf('s') > -1) {var seconds = urlQuery['t'].split('s')[0].split(/[A-Za-z]/); seconds = seconds[seconds.length -1];}else{var seconds = 0;}
    	hours = parseInt(hours); minutes = parseInt(minutes); seconds = parseInt(seconds);
	var time = (hours + minutes + seconds);
	//alert(time);
    } else {
    	var time = 0;
    }
    if (urlPath.length > archiveindex) {
    	if (vidtype === "b") {
        	$("#STREAMCONTAINER").html("<object bgcolor='#000000' data='http://www-cdn.jtvnw.net/swflibs/JustinPlayer.swf' height='" + playerH + "' id='clip_embed_player_flash' type='application/x-shockwave-flash' width='" + playerW + "'><param name='movie' value='http://www-cdn.jtvnw.net/swflibs/JustinPlayer.swf'><param name='allowScriptAccess' value='always'><param name='allowNetworking' value='all'><param name='allowFullScreen' value='true'><param name='flashvars' value='channel=" + channel + "&auto_play=true&start_volume=100&archive_id=" + archive + "&initial_time=" + time + "&hostname=www.justin.tv'></object><input class='sitename hidden' type='text' value='jtv'>");
    	}
    	else if (vidtype === "c") {
    		$("#STREAMCONTAINER").html("<object bgcolor='#000000' data='http://www-cdn.jtvnw.net/swflibs/JustinPlayer.swf' height='" + playerH + "' id='clip_embed_player_flash' type='application/x-shockwave-flash' width='" + playerW + "'><param name='movie' value='http://www-cdn.jtvnw.net/swflibs/JustinPlayer.swf'><param name='allowScriptAccess' value='always'><param name='allowNetworking' value='all'><param name='allowFullScreen' value='true'><param name='flashvars' value='channel=" + channel + "&auto_play=true&start_volume=100&chapter_id=" + archive + "&initial_time=" + time + "'></object><input class='sitename hidden' type='text' value='jtv'>");
    	}
    }
    else {
        $("#STREAMCONTAINER").html("<object type='application/x-shockwave-flash' height='" + playerH + "' width='" + playerW + "' id='live_embed_player_flash' data='http://www.justin.tv/widgets/live_embed_player.swf?channel=" + channel + "' bgcolor='#000000'><param name='wmode' value='opaque' /><param name='allowFullScreen' value='true' /><param name='allowScriptAccess' value='always' /><param name='allowNetworking' value='all' /><param name='movie' value='http://www.justin.tv/widgets/live_embed_player.swf' /><param name='flashvars' value='channel=" + channel + "&auto_play=true' /></object><input class='sitename hidden' type='text' value='ttv'>");
        /*$("#STREAMCONTAINER").html("<object type='application/x-shockwave-flash' height='" + playerH + "' width='" + playerW + "' id='live_embed_player_flash' data='http://www-cdn.jtvnw.net/widgets/live_embed_player.r63276f112912c920ca1c0bb17d8eee84e8062304.swf?channel=" + channel + "&auto_play=true' bgcolor='#000000'></object><input class='sitename hidden' type='text' value='ttv'>");*/
    }
    document.getElementById("sitename").setAttribute("value", "jtv");
    $(".streamoption_selected").attr('class', '');
    $("#jtv-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "jtv");
    $("#STREAMCONTAINER").attr("data-chan", channel);
    $("#STREAMCONTAINER").attr("data-bar", "32");
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    var urlRegex = /(https?:\/\/[\S]+)|([^\/\s]+\.(com|tv|org|net|be|jp|uk|us|ly)(\/[\S]*)?)|(\@[\S]+)/gi;
    $.getJSON("http://api.justin.tv/api/stream/list.json?channel="+ channel +"&jsonp=?", function(data){
    	if (data[0]["title"] != null /*|| data[0]["channel_count"] != null*/) { 
    		info = data[0]["title"];
    	} else {
    		info= "";
    	}
    	viewers = data[0]["channel_count"];
    	game = data[0]["meta_game"]; 
    	
    	for (var i = 0; i < info.match(urlRegex).length; i++) {
        if (info.match(urlRegex)[i].toLowerCase().substr(0, 1) === "@") {
        $('#STREAMCONTAINER').parent().find('.urls').append("<a href='http://twitter.com/" + info.match(urlRegex)[i].replace('@','') + "' target='_blank'><img alt='" + (i+1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=twitter.com'/></a>");
        } else if (info.match(urlRegex)[i].toLowerCase().substr(0, 4) !== "http") {
            $('#STREAMCONTAINER').parent().find('.urls').append("<a href='http://" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i+1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" +  info.match(urlRegex)[i] + "'/></a>");
        } else {
           $('#STREAMCONTAINER').parent().find('.urls').append("<a href='" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i+1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" +  info.match(urlRegex)[i].replace('http://','') + "'/></a>");
        }
    }
    		
    $('#STREAMCONTAINER').find('object').attr('title', info);});
    $('#STREAMCONTAINER').find('object').attr('onmouseover', '$.getJSON("http://api.justin.tv/api/stream/list.json?channel='+ channel +'&jsonp=?", function(data){if (data[0]["title"] != null){info = data[0]["title"];} else {info= "";}viewers = data[0]["channel_count"];game = data[0]["meta_game"];});$(this).attr("title", info)'); 
    $('.urls').html("");   
}

function ttv(obj) {
    /*
    if (event.shiftKey) {
    	newChannel($("#STREAMCONTAINER"), event);
    }
    */
    var urlInput = document.getElementById('urlInput');
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent"))) + tbar;
    var bar = tbar;
    var a = document.createElement('a');
    if ((obj.toLowerCase().substr(0, 9) === "justin.tv") || (obj.toLowerCase().substr(0, 10) === "justin.tv/") || (obj.toLowerCase().substr(0, 13) === "www.justin.tv") || (obj.toLowerCase().substr(0, 14) === "www.justin.tv/") || (obj.toLowerCase().substr(0, 9) === "twitch.tv") || (obj.toLowerCase().substr(0, 10) === "twitch.tv/") || (obj.toLowerCase().substr(0, 13) === "www.twitch.tv") || (obj.toLowerCase().substr(0, 14) === "www.twitch.tv/")) {
        a.href = 'http://' + obj;
    } else if ((obj.toLowerCase().substr(0, 17) !== "http://justin.tv/") && (obj.toLowerCase().substr(0, 18) !== "https://justin.tv/") && (obj.toLowerCase().substr(0, 21) !== "http://www.justin.tv/") && (obj.toLowerCase().substr(0, 22) !== "https://www.justin.tv/") && (obj.toLowerCase().substr(0, 17) !== "http://twitch.tv/") && (obj.toLowerCase().substr(0, 18) !== "https://twitch.tv/") && (obj.toLowerCase().substr(0, 21) !== "http://www.twitch.tv/") && (obj.toLowerCase().substr(0, 22) !== "https://www.twitch.tv/")) {
        a.href = 'http://twitch.tv/' + obj;
    } else {
        a.href = obj;
    }
    var urlPath = a.pathname.split("/");
    if ((a.pathname.toLowerCase().substr(0, 1) !== "/")) {
        var channel = urlPath[0];
        var vidtype = urlPath[1];
        var archive = urlPath[2];
        var archiveindex = 2;
    } else {
        var channel = urlPath[1];
        var vidtype = urlPath[2];
        var archive = urlPath[3];
        var archiveindex = 3;
    }
    var urlQuery = [],
        hash;
    var q = a.href.split('?')[1];
    if (q !== undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            urlQuery.push(hash[1]);
            urlQuery[hash[0]] = hash[1];
        }
    }
    if (urlQuery['t']) {
        if (urlQuery['t'].indexOf('h') > -1) {
            var hours = urlQuery['t'].split('h')[0] * 3600;
        } else {
            var hours = 0;
        }
        if (urlQuery['t'].indexOf('m') > -1) {
            var minutes = urlQuery['t'].split('m')[0].split(/[A-Za-z]/);
            minutes = minutes[minutes.length - 1] * 60;
        } else {
            var minutes = 0;
        }
        if (urlQuery['t'].indexOf('s') > -1) {
            var seconds = urlQuery['t'].split('s')[0].split(/[A-Za-z]/);
            seconds = seconds[seconds.length - 1];
        } else {
            var seconds = 0;
        }
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);
        var time = (hours + minutes + seconds);
    } else {
        var time = 0;
    }
    /*
    if(event.ctrlKey) {
    	var embedtarget = $("#STREAMCONTAINER").children(".pip");
    	embedtarget.css('display','block');
    	playerW = 255; playerH = 344 + 31;
    } else {
    	var embedtarget = $("#STREAMCONTAINER");
    }
    */
    if (urlPath.length > archiveindex) {
        if (vidtype === "b") {
            $("#STREAMCONTAINER").html("<object bgcolor='#000000' data='http://www.twitch.tv/widgets/archive_embed_player.swf' height='" + playerH + "' id='clip_embed_player_flash' type='application/x-shockwave-flash' width='" + playerW + "'><param name='movie' value='http://www.twitch.tv/widgets/archive_embed_player.swf'><param name='allowScriptAccess' value='always'><param name='allowNetworking' value='all'><param name='allowFullScreen' value='true'><param name='flashvars' value='channel=" + channel + "&auto_play=true&start_volume=100&archive_id=" + archive + "&initial_time=" + time + "&hostname=www.twitch.tv'></object><input class='sitename hidden' type='text' value='jtv'>");
        } else if (vidtype === "c") {
            $("#STREAMCONTAINER").html("<object bgcolor='#000000' data='http://www.twitch.tv/widgets/archive_embed_player.swf' height='" + playerH + "' id='clip_embed_player_flash' type='application/x-shockwave-flash' width='" + playerW + "'><param name='movie' value='http://www.twitch.tv/widgets/archive_embed_player.swf'><param name='allowScriptAccess' value='always'><param name='allowNetworking' value='all'><param name='allowFullScreen' value='true'><param name='flashvars' value='channel=" + channel + "&auto_play=true&start_volume=100&chapter_id=" + archive + "&initial_time=" + time + "'></object><input class='sitename hidden' type='text' value='jtv'>");
        } else if (vidtype === "v") {
            if (lazy) {
                playerH = (playerH - tbar);
                bar = 0;
                $("#STREAMCONTAINER").html("<iframe src='http://player.twitch.tv/?video=v" + archive + "&time=" + time + "s' width='" + playerW + "' height='" + playerH + "' frameborder=0 scrolling='no' allowfullscreen></iframe><input class='sitename hidden' type='text' value='ttv'>");
            } else {
                $("#STREAMCONTAINER").html("<object bgcolor='#000000' data='http://www.twitch.tv/swflibs/TwitchPlayer.swf' height='" + playerH + "' id='clip_embed_player_flash' type='application/x-shockwave-flash' width='" + playerW + "'><param name='movie' value='http://www.twitch.tv/swflibs/TwitchPlayer.swf'><param name='allowScriptAccess' value='always'><param name='allowNetworking' value='all'><param name='allowFullScreen' value='true'><param name='flashvars' value='channel=" + channel + "&auto_play=true&start_volume=100&videoId=v" + archive + "&initial_time=" + time + "'></object><input class='sitename hidden' type='text' value='jtv'>");
            }
        }
    } else {
        if (isHtml5) {
            playerH = (playerH - tbar);
            bar = 0;
            $("#STREAMCONTAINER").html("<iframe src='http://player.twitch.tv/?channel=" + channel + "' width='" + playerW + "' height='" + playerH + "' frameborder=0 scrolling='no' allowfullscreen></iframe><input class='sitename hidden' type='text' value='ttv'>");
        } else if (!isHtml5 && lazy) {
            playerH = (playerH - tbar);
            bar = 0;
            $("#STREAMCONTAINER").html("<iframe src='http://player.twitch.tv/?channel=" + channel + "' width='" + playerW + "' height='" + playerH + "' frameborder=0 scrolling='no' allowfullscreen></iframe><input class='sitename hidden' type='text' value='ttv'>");
        } else {
            playerH = (playerH - tbar);
            bar = 0;
            $("#STREAMCONTAINER").html("<iframe src='http://player.twitch.tv/?channel=" + channel + "' width='" + playerW + "' height='" + playerH + "' frameborder=0 scrolling='no' allowfullscreen></iframe><input class='sitename hidden' type='text' value='ttv'>");  
        }
    }
    document.getElementById("sitename").setAttribute("value", "ttv");
    $(".streamoption_selected").attr('class', '');
    $("#jtv-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "ttv");
    $("#STREAMCONTAINER").attr("data-chan", channel);
    if (lazy) {
        $("#STREAMCONTAINER").attr("data-bar", bar);
    } else {
        $("#STREAMCONTAINER").attr("data-bar", tbar);
    }
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    var urlRegex = /(https?:\/\/[\S]+)|([^\/\s]+\.(com|tv|org|net|be|jp|uk|us|ly)(\/[\S]*)?)|(\@[\S]+)/gi;
    var cleanurl = /[^A-Za-z1-9\-\.\_\~\:\/\?\#\[\]\@\$\&\'\(\)\*\+\,\;\=\%]+/gi;
		//maybe include possible first brace characters in regex and then make conditional that erases 1st & last chars if it finds theyre closed at end?
	$.ajax({
	    type: "GET",
	    url: "https://api.twitch.tv/kraken/streams?channel=" + channel.toLowerCase(),
	    headers: {
	        "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
	    },
	    success: function(data) {
	        var urlRegex = /(https?:\/\/[\S]+)|([^\/\s]+\.(com|tv|org|net|be|jp|uk|us|ly)(\/[\S]*)?)|(\@[\S]+)/gi;
	        if (data["streams"][0]["channel"]["status"]) {
	            info = "\n" + data["streams"][0]["channel"]["status"];
	        } else {
	            info = "";
	        }
	        if (info.match(urlRegex)) {
	            for (var i = 0; i < info.match(urlRegex).length; i++) {
	                if (info.match(urlRegex)[i].toLowerCase().substr(0, 1) === "@") {
	                    $('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='http://twitter.com/" + info.match(urlRegex)[i].replace('@', '') + "' target='_blank'><img alt='" + (i + 1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=twitter.com'/></a>");
	                } else if (info.match(urlRegex)[i].toLowerCase().substr(0, 4) !== "http") {
	                    $('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='http://" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i + 1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" + info.match(urlRegex)[i] + "'/></a>");
	                } else {
	                    $('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i + 1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" + info.match(urlRegex)[i].replace('http://', '') + "'/></a>");
	                }
	            }
	        }
	    }
	});		
		
    if (channel) {
        $('#STREAMCONTAINER').parent().find('.urls').append("<a href='javascript:popout(\"http://www.twitch.tv/" + channel + "/chat?popout\", 392, 330)'><img alt='chat' title='Twitch Chat' src='IS/chat.png'/></a>");
    }
    if (channel) {
        $('#STREAMCONTAINER').parent().find('.urls').append("<a href='resources/data/m3u.php?channel=" + channel + "'>!</a>");
    }
    $('#STREAMCONTAINER').parent().find('.c2').unbind("mouseover");
    $('#STREAMCONTAINER').parent().find('.c2').on("mouseover", function(){
        ttvInfo($(this), channel);
    });
    list_streams();
}

function ttvInfo(el, channel) {
        console.log('function test: ' + channel);
        $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/kraken/streams?channel=" + channel.toLowerCase(),
            headers: {
                "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
            },
            success: function(data) {
                var info = "";
                var viewers = null;
                var game = "";
                var plural = "";
                var urlRegex = /(https?:\/\/[\S]+)|([^\/\s]+\.(com|tv|org|net|be|jp|uk|us|ly)(\/[\S]*)?)|(\@[\S]+)/gi;
                if (data["streams"][0]["channel"]["status"]) {
                    info = "\n" + data["streams"][0]["channel"]["status"];
                }
                viewers = data["streams"][0]["viewers"];
                if (viewers !== 1) {
                    plural = "s";
                }
                if (data["streams"][0]["channel"]["game"]) {
                    game = "\n[" + data["streams"][0]["channel"]["game"] + "]";
                }
                el.attr('title', viewers.toLocaleString() + " viewer" + plural + " " + game + info);
            }
        });
    }

function ust(obj) {
    urlInput = document.getElementById('urlInput');
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent"))) + ubar;
    var a = document.createElement('a');
    if ((obj.toLowerCase().substr(0, 19) === "ustream.tv/channel/") || (obj.toLowerCase().substr(0, 23) === "www.ustream.tv/channel/") || (obj.toLowerCase().substr(0, 20) === "ustream.tv/recorded/") || (obj.toLowerCase().substr(0, 24) === "www.ustream.tv/recorded/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 8) === "channel/") || (obj.toLowerCase().substr(0, 9) === "recorded/")) {
        a.href = "http://www.ustream.tv/" + obj;
    }
    else if ((obj.toLowerCase().substr(0, 9) === "/channel/") || (obj.toLowerCase().substr(0, 10) === "/recorded/")) {
        a.href = "http://www.ustream.tv" + obj;
    }
    else if ((obj.toLowerCase().substr(0, 26) === "http://ustream.tv/channel/") || (obj.toLowerCase().substr(0, 27) === "http://ustream.tv/recorded/") || (obj.toLowerCase().substr(0, 27) === "https://ustream.tv/channel/") || (obj.toLowerCase().substr(0, 28) === "https://ustream.tv/recorded/") || (obj.toLowerCase().substr(0, 30) === "http://www.ustream.tv/channel/") || (obj.toLowerCase().substr(0, 31) === "http://www.ustream.tv/recorded/") || (obj.toLowerCase().substr(0, 31) === "https://www.ustream.tv/channel/") || (obj.toLowerCase().substr(0, 32) === "https://www.ustream.tv/recorded/")) {
        a.href = obj;
    }
    else {
        a.href = "http://www.ustream.tv/channel/" + obj;
    }
    var urlPath = a.pathname.split("/");
    if ((a.pathname.toLowerCase().substr(0, 1) !== "/")) {
        var channel = urlPath[0];
        var id = urlPath[1];
        var codeeindex = 1;
    } else {
        var channel = urlPath[1];
        var id = urlPath[2];
        var archiveindex = 2;
    }
    if (channel === "recorded") {
        $("#STREAMCONTAINER").html("<object width='" + playerW + "' height='" + playerH + "' data='http://www.ustream.tv/embed/recorded/" + id + "?v=3&amp;autoplay=true&amp;volume=50''></object><input class='sitename hidden' type='text' value='ust'>");
    }
    else if (isNaN(id)){
	$.getJSON("http://api.ustream.tv/json/channel/" + id + "/getInfo?callback=?", function(data)
	{ 
	if (data !== null) { var id = data['id']; }	
	//$("#STREAMCONTAINER").html("<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' width='" + playerW + "' height='" + playerH + "' id='utv799408'><param name='flashvars' value='autoplay=true&amp;volume=50&amp;brand=embed&amp;cid=" + id + "'/><param name='wmode' value='opaque'></param><param name='allowfullscreen' value='true'/><param name='allowscriptaccess' value='always'/><param name='movie' value='http://www.ustream.tv/flash/viewer.swf'/><embed flashvars='autoplay=true&amp;brand=embed&amp;cid=" + id + "' width='" + playerW + "' height='" + playerH + "' wmode='opaque' allowfullscreen='true' allowscriptaccess='always' id='utv799408' name='utv_n_274276' src='http://www.ustream.tv/flash/viewer.swf' type='application/x-shockwave-flash' /></object><input class='sitename hidden' type='text' value='ust'>");
	$("#STREAMCONTAINER").html("<iframe width='" + playerW + "' height='" + playerH + "' src='http://www.ustream.tv/embed/" + id + "?html5ui&amp;wmode=direct&amp;autoplay=true' scrolling='no' frameborder='0' webkitallowfullscreen='true' allowfullscreen='true' style='border: 0px none transparent;'></iframe><input class='sitename hidden' type='text' value='ust'>");
	});
    }
    else {
        $("#STREAMCONTAINER").html("<iframe width='" + playerW + "' height='" + playerH + "' src='http://www.ustream.tv/embed/" + id + "?html5ui&amp;wmode=direct&amp;autoplay=true' scrolling='no' frameborder='0' webkitallowfullscreen='true' allowfullscreen='true' style='border: 0px none transparent;'></iframe><input class='sitename hidden' type='text' value='ust'>");
    }
    document.getElementById("sitename").setAttribute("value", "ust");
    $(".streamoption_selected").attr('class', '');
    $("#ust-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site","ust");
    $("#STREAMCONTAINER").attr("data-chan",id);
    $("#STREAMCONTAINER").attr("data-bar", ubar);
    $('#STREAMCONTAINER').parent().find('.urls').html("");

var urlRegex = /(https?:\/\/[\S]+)|([^\/\s]+\.(com|tv|org|net|be|jp|uk|us|ly)([\S]*))|(\@[\S]+)/gi;
$.getJSON("http://api.ustream.tv/json/channel/"+id+"/getInfo?callback=?", function (data) {
    var info = data['description'].replace(/(<([^>]+)>)/ig, "");
    for (var i = 0; i < info.match(urlRegex).length; i++) {
        if (info.match(urlRegex)[i].toLowerCase().substr(0, 1) === "@") {
            $('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='http://twitter.com/" + info.match(urlRegex)[i].replace('@', '') + "' target='_blank'><img alt='" + (i + 1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=twitter.com'/></a>");
        } else if (info.match(urlRegex)[i].toLowerCase().substr(0, 4) !== "http") {
            $('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='http://" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i + 1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" + info.match(urlRegex)[i] + "'/></a>");
        } else {
            $('#STREAMCONTAINER').parent().find('.urls').prepend("<a href='" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i + 1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" + info.match(urlRegex)[i].replace('http://', '') + "'/></a>");
        }
    }
//$('#STREAMCONTAINER').find('iframe').attr('title', info.replace('\n',' ');
});
if (id){$('#STREAMCONTAINER').parent().find('.urls').append("<a href='javascript:popout(\"http://www.ustream.tv/socialstream/" + id + "?siteMode=1&activeTab=ircChat&hideVideoTab=1&colorScheme=light&v=6\", 392, 330)'><img alt='chat' title='Ustream Chat' src='IS/chat.png'/></a>");}
    list_streams();
}

function lst(obj) {
    urlInput = document.getElementById('urlInput');
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent"))) + lbar;
    var a = document.createElement('a');
    if ((obj.toLowerCase().substr(0, 15) === "livestream.com/") || (obj.toLowerCase().substr(0, 19) === "www.livestream.com/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 22) === "http://livestream.com/") || (obj.toLowerCase().substr(0, 23) === "https://livestream.com/") || (obj.toLowerCase().substr(0, 26) === "http://www.livestream.com/") || (obj.toLowerCase().substr(0, 27) === "https://www.livestream.com/")) {
        a.href = obj;
    }
    else {
        a.href = "http://www.livestream.com/" + obj;
    }
    var urlPath = a.pathname.split("/");
    var urlQuery = [],
        hash;
    var q = a.href.split('?')[1];
    if (q !== undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            urlQuery.push(hash[1]);
            urlQuery[hash[0]] = hash[1];
        }
    }
    if ((a.pathname.toLowerCase().substr(0, 1) !== "/")) {
        var channel = urlPath[0];
        var archive = urlPath[1];
        var archiveindex = 1;
    } else {
        var channel = urlPath[1];
        var archive = urlPath[2];
        var archiveindex = 2;
    }
    var clipId = urlQuery['clipId'];
    if (archive === "video" || archive === "share") {
        $("#STREAMCONTAINER").html("<object width='" + playerW + "' height='" + playerH + "' id='lsplayer' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='http://cdn.livestream.com/grid/LSPlayer.swf?channel=" + channel + "&amp;clip=" + clipId + "&amp;color=0x000000&amp;autoPlay=true&amp;mute=false&amp;iconColorOver=0xe7e7e7&amp;iconColor=0xcccccc'></param><param name='allowScriptAccess' value='always'></param><param name='allowFullScreen' value='true'></param><embed name='lsplayer' wmode='opaque' src='http://cdn.livestream.com/grid/LSPlayer.swf?channel=" + channel + "&amp;clip=" + clipId + "&amp;color=0x000000&amp;autoPlay=true&amp;mute=false&amp;iconColorOver=0xe7e7e7&amp;iconColor=0xcccccc' width='" + playerW + "' height='" + playerH + "' allowScriptAccess='always' allowFullScreen='true' type='application/x-shockwave-flash'></embed></object><input class='sitename hidden' type='text' value='lst'>");
    }
    else {
        $("#STREAMCONTAINER").html("<object width='" + playerW + "' height='" + playerH + "' id='lsplayer' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='http://cdn.livestream.com/grid/LSPlayer.swf?channel=" + channel + "&amp;color=0x000000&amp;autoPlay=true&amp;mute=false&amp;iconColorOver=0xe7e7e7&amp;iconColor=0xcccccc'></param><param name='allowScriptAccess' value='always'></param><param name='allowFullScreen' value='true'></param><embed name='lsplayer' wmode='opaque' src='http://cdn.livestream.com/grid/LSPlayer.swf?channel=" + channel + "&amp;color=0x000000&amp;autoPlay=true&amp;mute=false&amp;iconColorOver=0xe7e7e7&amp;iconColor=0xcccccc' width='" + playerW + "' height='" + playerH + "' allowScriptAccess='always' allowFullScreen='true' type='application/x-shockwave-flash'></embed></object><input class='sitename hidden' type='text' value='lst'>");
    }
    document.getElementById("sitename").setAttribute("value", "lst");
    $(".streamoption_selected").attr('class', '');
    $("#lst-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "lst");
    $("#STREAMCONTAINER").attr("data-chan", channel);
    $("#STREAMCONTAINER").attr("data-bar", lbar);
    $('#STREAMCONTAINER').find('embed').attr('onmouseover', '$(this).attr("title", this.getCurrentContentTitle())');
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    list_streams();
}

function yut(obj) {
    urlInput = document.getElementById('urlInput');
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent")) + ybar);
    var a = document.createElement('a');
    if ((obj.toLowerCase().substr(0, 12) === "youtube.com/") || (obj.toLowerCase().substr(0, 16) === "www.youtube.com/") || (obj.toLowerCase().substr(0, 23) === "youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 27) === "www.youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 19) === "gaming.youtube.com/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 4) === "user") || (obj.toLowerCase().substr(0, 2) === "v/") || (obj.toLowerCase().substr(0, 8) === "playlist") || (obj.toLowerCase().substr(0, 5) === "watch") || (obj.toLowerCase().substr(0, 7) === "results")) {
        a.href = "http://www.youtube.com/" + obj;
    }
    else if ((obj.toLowerCase().substr(0, 5) === "/user") || (obj.toLowerCase().substr(0, 3) === "/v/") || (obj.toLowerCase().substr(0, 9) === "/playlist") || (obj.toLowerCase().substr(0, 6) === "/watch") || (obj.toLowerCase().substr(0, 8) === "/results")) {
        a.href = "http://www.youtube.com" + obj;
    }
    else if ((obj.toLowerCase().substr(0, 1) === "/") && (obj.toLowerCase().substr(0, 5) !== "/user") && (obj.toLowerCase().substr(0, 3) !== "/v/") && (obj.toLowerCase().substr(0, 9) !== "/playlist") && (obj.toLowerCase().substr(0, 6) !== "/watch") && (obj.toLowerCase().substr(0, 8) !== "/results")) {
        a.href = "http://www.youtube.com" + obj;
    }
    else if ((obj.toLowerCase().substr(0, 19) === "http://youtube.com/") || (obj.toLowerCase().substr(0, 30) === "http://youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 20) === "https://youtube.com/") || (obj.toLowerCase().substr(0, 31) === "https://youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 23) === "http://www.youtube.com/") || (obj.toLowerCase().substr(0, 34) === "http://www.youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 24) === "https://www.youtube.com/") || (obj.toLowerCase().substr(0, 35) === "https://www.youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 26) === "http://gaming.youtube.com/") || (obj.toLowerCase().substr(0, 27) === "https://gaming.youtube.com/")) {
        a.href = obj;
    }
    else if (((obj.length === 11) && (obj.indexOf(' ') === -1)) || (obj.match(/&t=|#t=/g))) {
        a.href = "http://www.youtube.com/watch?v=" + obj;
    }
    else if ((obj.toLowerCase().substr(0, 9) === "youtu.be/")) {
    	obj = obj.replace('?', '&');
    	obj = obj.replace('youtu.be/', 'http://www.youtube.com/watch?v=');
    	a.href = obj;
    }
    else if ((obj.toLowerCase().substr(0, 16) === "http://youtu.be/") || (obj.toLowerCase().substr(0, 17) === "https://youtu.be/")) {
	obj = obj.replace('?', '&');
    	obj = obj.replace('youtu.be/', 'www.youtube.com/watch?v=');
    	a.href = obj;
    }
    else {
        a.href = "http://www.youtube.com/results?search_query=" + obj;
    }
    var urlPath = a.pathname.split("/");
    var urlFragment = [], 
    	fhash;
    var f = a.href.split('#')[1];
    if (f !== undefined) {
    	a.href = a.href.split('#')[0];
        fhash = f.split('=');
        urlFragment[fhash[0]] = fhash[1];
    } 
    var urlQuery = [],
        hash;
    var q = a.href.split('?')[1];
    if (q !== undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            urlQuery.push(hash[1]);
            urlQuery[hash[0]] = hash[1];
        }
    }      
    if ((a.pathname.toLowerCase().substr(0, 1) !== "/")) {
        var channel = urlPath[0];
        var video = urlPath[1];

    } else {
        var channel = urlPath[1];
        var video = urlPath[2];
    }
    if (channel === "v") {
        var v = video;
    } else {
        var v = urlQuery['v'];
    }
    if(urlQuery['t'] || urlFragment['t']) {
    var stamp;
    	if(urlQuery['t']) {stamp = urlQuery['t'];}
    	if(urlFragment['t']) {stamp = urlFragment['t'];}
    	if (stamp.indexOf('h') > -1) {var hours = stamp.split('h')[0]*3600;}else{var hours = 0;}
    	if (stamp.indexOf('m') > -1) {var minutes = stamp.split('m')[0].split(/[A-Za-z]/); minutes = minutes[minutes.length -1]*60;}else{var minutes = 0;}
    	if (stamp.indexOf('s') > -1) {var seconds = stamp.split('s')[0].split(/[A-Za-z]/); seconds = seconds[seconds.length -1];}else{var seconds = 0;}
    	if (stamp.indexOf('h') === -1 && stamp.indexOf('m') === -1 && stamp.indexOf('s') === -1) {var seconds = stamp;}
    	hours = parseInt(hours); minutes = parseInt(minutes); seconds = parseInt(seconds);
	var time = (hours + minutes + seconds);
	//alert(time);
    } else {
    	var time = "";
    }
    var list = urlQuery['list'];
    var search = urlQuery['search_query'];
    if (channel === "playlist") {
        $("#STREAMCONTAINER").html("<iframe id='ytplayer' width='" + playerW + "' height='" + playerH + "' src='https://www.youtube.com/embed/videoseries?list=" + list + "&autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1' frameborder='0' allowfullscreen></iframe><input class='sitename hidden' type='text' value='yut'>");
        player = new YT.Player('ytplayer', {events: {'onReady': onPlayerReady, 'onPlaybackQualityChange': onPlaybackQualityChange}});
    }
    else if (channel === "results") {
        $("#STREAMCONTAINER").html("<iframe id='ytplayer' width='" + playerW + "' height='" + playerH + "' src='https://www.youtube.com/embed?listType=search&list=" + search + "&autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1' frameborder='0' allowfullscreen></iframe><input class='sitename hidden' type='text' value='yut'>");
        player = new YT.Player('ytplayer', {events: {'onReady': onPlayerReady, 'onPlaybackQualityChange': onPlaybackQualityChange}});
    }
    else if (channel === "user") {
        $("#STREAMCONTAINER").html("<iframe id='ytplayer' width='" + playerW + "' height='" + playerH + "' src='https://www.youtube.com/embed?listType=user_uploads&list=" + video + "&autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1' frameborder='0' allowfullscreen></iframe><input class='sitename hidden' type='text' value='yut'>");
        player = new YT.Player('ytplayer', {events: {'onReady': onPlayerReady, 'onPlaybackQualityChange': onPlaybackQualityChange}});
    }    
    else if ((channel !== "watch") && (channel !== "v") && (channel !== "playlist") && (channel !== "results") && (channel !== "user")) {
        $("#STREAMCONTAINER").html("<iframe id='ytplayer' width='" + playerW + "' height='" + playerH + "' src='https://www.youtube.com/embed?listType=user_uploads&list=" + channel + "&autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1' frameborder='0' allowfullscreen></iframe><input class='sitename hidden' type='text' value='yut'>");
        player = new YT.Player('ytplayer', {events: {'onReady': onPlayerReady, 'onPlaybackQualityChange': onPlaybackQualityChange}});
    }
    else {
    
        //$("#STREAMCONTAINER").html("<object width='" + playerW + "' height='" + playerH + "'><param name='movie' value='http://www.youtube.com/v/" + v + "?version=3&hl=en_US&autoplay=1&showinfo=1&autohide=2'></param><param name='allowFullScreen' value='true'></param><param name='wmode' value='opaque'></param><param name='allowscriptaccess' value='always'></param><embed src='http://www.youtube.com/v/" + v + "?version=3&hl=en_US&autoplay=1&showinfo=0&autohide=2&start=" + time +"' wmode='opaque' type='application/x-shockwave-flash' width='" + playerW + "' height='" + playerH + "' allowscriptaccess='always' allowfullscreen='true'></embed></object><input class='sitename hidden' type='text' value='yut'>");
        //$('#STREAMCONTAINER').parent().find('.urls').append("<a href='javascript:yutFrameAdv(\""+ v +"\", "+ (0 + time) +")' title='Show Advanced Controls'>!</a>");
        $("#STREAMCONTAINER").html("<iframe id='ytplayer' width='" + playerW + "' height='" + playerH + "' src='https://www.youtube.com/embed/" + v + "?autoplay=1&hl=en_US&color=white&enablejsapi=1&showinfo=1&autohide=2&html5=1&start=" + time +"' frameborder='0' allowfullscreen></iframe><input class='sitename hidden' type='text' value='yut'>");
        player = new YT.Player('ytplayer', {events: {'onReady': onPlayerReady, 'onPlaybackQualityChange': onPlaybackQualityChange}});
    }
    
    document.getElementById("sitename").setAttribute("value", "yut");
    $(".streamoption_selected").attr('class', '');
    $("#yut-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "yut");
if (v) {
    $("#STREAMCONTAINER").attr("data-chan", v);
} else {
    $("#STREAMCONTAINER").attr("data-chan", "");
}
    $("#STREAMCONTAINER").attr("data-bar", ybar);
/*    
    if (typeof player === 'undefined') { 
    $.getJSON("http://gdata.youtube.com/feeds/api/videos/"+ v +"?v=2&alt=json", function(data){
    	if (data['entry']['title']['$t'] != null) { 
    		info = data['entry']['title']['$t'];
    		viewers = "\n" + parseInt(data['entry']['yt$statistics']['viewCount']).toLocaleString() + " views";
    	} else {
    		info= "";
    		viewers = "";
    	}	
    $('#STREAMCONTAINER').find('object').attr('title', info + viewers);});
    //$('#STREAMCONTAINER').find('object').attr('onmouseover', '$.getJSON("http://gdata.youtube.com/feeds/api/videos/'+ v +'?v=2&alt=json", function(data){if (data["entry"]["title"]["$t"] != null){info = data["entry"]["title"]["\$t"];viewers = "\n" + parseInt(data["entry"]["yt$statistics"]["viewCount"]).toLocaleString() + " views";} else {info= "";viewers = "";}});$(this).attr("title", info + viewers)');   
    } 
*/ 
    list_streams();    
}

function yutFrameAdv(obj, time) {
    var v = obj;
    if (time === 0){time = "";}
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent")) + ybar);
    $("#STREAMCONTAINER").html("<iframe id='ytplayer' width='" + playerW + "' height='" + playerH + "' src='https://www.youtube.com/embed/" + v + "?autoplay=1&hl=en_US&autohide=2&start=" + time + "&enablejsapi=1&version=3&showinfo=0&html5=1' frameborder='0' allowfullscreen></iframe><input class='sitename hidden' type='text' value='yut'>");
    player = new YT.Player('ytplayer', {events: {'onReady': onPlayerReady}});
    //v = player.getVideoUrl().replace('https://www.youtube.com/watch?v=', '');
    $("#STREAMCONTAINER").attr("data-bar", ybar);
}

function onPlayerReady(event) {

    $('#STREAMCONTAINER').parent().find('.urls').append("<input type='number' value='1' id='step' style='width:40px' title='Frames to advance'> @ <select id='fps' title='Frames per second \n (Match FPS to video)'><option value='1'>Seconds</option><option value='24'>24fps</option><option value='25'>25fps</option><option value='29.97'>29.97fps</option><option value='30' selected>30fps</option><option value='48'>48fps</option><option value='50'>50fps</option><option value='59.94'>59.94fps</option><option value='60'>60fps</option></select><a id='prev' style='font-size:20px' href='javascript:prevFrame($( \"#step\" ).val())' title='Step Backward \nHold to Rewind'>&larr;</a><a id='loopstart' href='javascript:loop($(\"#loopstart\"))' title='Set loop start'>|</a><a id='timer' href='javascript:pausePlay()' title='Pause/Play \n Current frame'></a><a id='loopend' href='javascript:loop($(\"#loopend\"))' title='Set loop end'>|</a><a id='next' style='font-size:20px' href='javascript:nextFrame($( \"#step\" ).val())' title='Step Forward'>&rarr;</a>");

//    $('#STREAMCONTAINER').parent().find('.urls').append("<input type='number' value='1' id='step' style='width:40px' title='Frames to advance'> @ <select id='fps' title='Frames per second \n (Match FPS to video)'><option value='24'>24fps</option><option value='25'>25fps</option><option value='29.97'>29.97fps</option><option value='30' selected>30fps</option><option value='48'>48fps</option><option value='50'>50fps</option><option value='59.94'>59.94fps</option><option value='60'>60fps</option></select><a id='prev' style='font-size:20px' href='javascript:prevFrame($( \"#step\" ).val())' title='Step Backward \nHold to Rewind'>&larr;</a><a id='loopstart' href='javascript:loop($(\"#loopstart\"))' title='Set loop start'>|</a><input type='number' id='timer' href='javascript:pausePlay()' title='Pause/Play \n Current frame'></input><a id='loopend' href='javascript:loop($(\"#loopend\"))' title='Set loop end'>|</a><a id='next' style='font-size:20px' href='javascript:nextFrame($( \"#step\" ).val())' title='Step Forward'>&rarr;</a>");
    updateTimer();
    instance();
    var timeoutId = 0;

if (player.getPlaybackQuality() === "hd1080" ||
    player.getPlaybackQuality() === "hd720" ||
    player.getPlaybackQuality() === "highres") {
      $('#fps').val(60);
    }
    
$('#prev').mousedown(function() {
    timeoutId = setTimeout(rewind, 1000);
    down = 1;
}).bind('mouseup mouseleave', function() {
    clearTimeout(timeoutId);
    down = 0;
});

/*
var v = player.getVideoUrl().replace('https://www.youtube.com/watch?v=', '');
//alert(player.getVideoUrl());
$.getJSON("http://gdata.youtube.com/feeds/api/videos/"+ v +"?v=2&alt=json", function(data){
    	if (data['entry']['title']['$t'] != null) { 
    		info = data['entry']['title']['$t'];
    	} else {
    		info= "";
    	}	
    $('#ytplayer').attr('title', info);});
    //$('#ytplayer').attr('onmouseover', '$.getJSON("http://gdata.youtube.com/feeds/api/videos/'+ v +'?v=2&alt=json", function(data){if (data["entry"]["title"]["$t"] != null){info = data["entry"]["title"]["$t"];} else {info= "";}$(this).attr("title", info)';});
*/
}

function onPlaybackQualityChange(event) {
  if (player.getPlaybackQuality() === "hd1080" ||
    player.getPlaybackQuality() === "hd720" ||
    player.getPlaybackQuality() === "highres") {
      $('#fps').val(60);
    } else {
      $('#fps').val(30);
    }
}

function loop(obj){
  if (!obj.attr("data-time") && !(($('#loopend').attr('data-time') - player.getCurrentTime()) < 0)) {
    obj.attr("data-time", player.getCurrentTime());
    obj.html("!");
  } else {
    obj.removeAttr("data-time");
    obj.html("|")
  }
}

function checkfps() {
alert($( "#fps" ).val());
}

function pausePlay() {
    if (player.getPlayerState() === 1) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

var start = new Date().getTime(), time = 0, elapsed = 0, currentFrame = 0;
function instance()
{
    if (player.getPlayerState() === 1){
      time += 100;
    }
    var fps = $('#fps').val()/100;
    elapsed = time/10;
    elapsed = Math.floor(elapsed * fps);
    //if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
    if (player.getPlayerState() === 1){
    //  document.getElementById('timer').innerText = elapsed;
    }
    if ($('#loopstart').attr('data-time') && $('#loopend').attr('data-time')) {
      if (time/1000 >= $('#loopend').attr('data-time')) {
        player.seekTo($('#loopstart').attr('data-time'));
        time = $('#loopstart').attr('data-time')*1000;
        //start = new Date().getTime();
      }  
    }
    //var diff = (new Date().getTime() - start) - time;
    //var diff = player.getCurrentTime() - time/1000;
    //$('#diff').html(diff);
    //$('#real').html(Math.floor((new Date().getTime() - start)/1000));
    //$('#start').html(start);
    //$('#new').html(new Date().getTime());
    //window.setTimeout(instance, 1000/$( "#fps" ).val());
    window.setTimeout(instance, 100);
}
var adjust = 0;
function updateTimer() {
    var numSpeed = 1000/$( "#fps" ).val();
    currentFrame = parseInt((Math.round(player.getCurrentTime() * Math.pow(10, 5)) / Math.pow(10, 5) * $( "#fps" ).val()));
    //var diff = currentFrame - time;
      function timerB() {
        if (player.getPlayerState() === 1){
          time = currentFrame;
          $("#timer").html(time += 1);
          //console.log(diff);
        }
        setTimeout(timerB, numSpeed);
      }
    //timerB();
    //elapsed = currentFrame;
    //time = (currentFrame/($('#fps').val()/200)) * 5;
//    if (Math.abs(time/1000 - player.getCurrentTime()) > 0.5) {
    time = player.getCurrentTime()*1000;
//document.getElementById('timer').innerText = currentFrame;
//console.log('adjusted time ' + adjust++ +' times');
//    }
    document.getElementById('timer').innerText = currentFrame;
    //$('#timer').val(currentFrame);
    if($('#timer').length){
        setTimeout(updateTimer, 500);
    }
}

function nextFrame(step) {
    var state = player.getPlayerState();
    player.pauseVideo();
    var currentTime = player.getCurrentTime();
    var framesPerSecond = $( "#fps" ).val();
    var numFramesToAdvance = step;
    var timeToAdvance = (1/framesPerSecond) * numFramesToAdvance;
    var newTime = currentTime + timeToAdvance;
    player.seekTo(newTime);
    if (state === 1 && framesPerSecond == 1){player.playVideo();}
}

function prevFrame(step) {
    var state = player.getPlayerState();
    player.pauseVideo();
    var currentTime = player.getCurrentTime();
    var framesPerSecond = $( "#fps" ).val();
    var numFramesToAdvance = step;
    var timeToAdvance = (1/framesPerSecond) * numFramesToAdvance;
    var newTime = currentTime - timeToAdvance;
    player.seekTo(newTime);
    if (state === 1 && framesPerSecond == 1){player.playVideo();}
}

function rewind() {
var modF = 1;
modS = 1;
rate = player.getPlaybackRate();
if (rate > 1){modF = 1; modS = rate;}
if (rate < 1){modF = rate; modS = 1;}
  prevFrame(10 * modF);
    if(down === 1){setTimeout(rewind, 450/modS);}
}

function changeRate(rate) {
    player.setPlaybackRate(rate);
    player.playVideo();
}

function htv(obj) {
    urlInput = document.getElementById('urlInput');
    var playerW = $("#STREAMCONTAINER").width();
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent")) + hbar);
    var a = document.createElement('a');
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    if ((obj.toLowerCase().substr(0, 10) === "hitbox.tv/") || (obj.toLowerCase().substr(0, 14) === "www.hitbox.tv/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 17) === "http://hitbox.tv/") || (obj.toLowerCase().substr(0, 18) === "https://hitbox.tv/") || (obj.toLowerCase().substr(0, 21) === "http://www.hitbox.tv/") || (obj.toLowerCase().substr(0, 22) === "https://www.hitbox.tv/")) {
        a.href = obj;
    }
    else {
        a.href = "http://www.hitbox.tv/" + obj;
    }
    var urlPath = a.pathname.split("/");
    if ((a.pathname.toLowerCase().substr(0, 1) != "/")) {
            var channel = urlPath[0];
    } else {
            var channel = urlPath[1];
    }
        $("#STREAMCONTAINER").html("<iframe src='http://www.hitbox.tv/embed/" + channel + "?popout=true&autoplay=true' width='" + playerW + "' height='" + playerH + "' frameborder=0 scrolling='no' allowfullscreen='true' allowscriptaccess='always'></iframe><input class='sitename hidden' type='text' value='htv'>");
       var urlRegex = /(https?:\/\/[\S]+)|([^\/\s]+\.(com|tv|org|net|be|jp|uk|us|ly)([\S]*))|(\@[\S]+)/gi;
       $.getJSON("http://api.hitbox.tv/media/live/"+channel.toLowerCase()+".json", function(data){
    	if (data["livestream"][0]["media_is_live"] === "1") { 
    		info = data["livestream"][0]["media_description"];
    	} else {
    		info= "";
    	}
        for (var i = 0; i < info.match(urlRegex).length; i++) {
        if (info.match(urlRegex)[i].toLowerCase().substr(0, 1) === "@") {
        $('#STREAMCONTAINER').parent().find('.urls').append("<a href='http://twitter.com/" + info.match(urlRegex)[i].replace('@','') + "' target='_blank'><img alt='" + (i+1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=twitter.com'/></a>");
        } else if (info.match(urlRegex)[i].toLowerCase().substr(0, 4) !== "http") {
            $('#STREAMCONTAINER').parent().find('.urls').append("<a href='http://" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i+1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" +  info.match(urlRegex)[i] + "'/></a>");
        } else {
           $('#STREAMCONTAINER').parent().find('.urls').append("<a href='" + info.match(urlRegex)[i] + "' target='_blank'><img alt='" + (i+1) + "' title='" + info.match(urlRegex)[i] + "' src='http://www.google.com/s2/favicons?domain=" +  info.match(urlRegex)[i].replace('http://','') + "'/></a>");
        }
    }
	
    //$('#STREAMCONTAINER').find('object').attr('title', info);
    });
    //$('#STREAMCONTAINER').find('object').attr('onmouseover', '$.getJSON("http://api.hitbox.tv/media/live/'+ channel.toLowerCase() +'.json", function(data){if (data["livestream"][0]["media_is_live"] === "1"){info = data["livestream"][0]["media_description"];} else {info= "";}});$(this).attr("title", info)');
                        
    document.getElementById("sitename").setAttribute("value", "htv");
    $(".streamoption_selected").attr('class', '');
    $("#htv-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "htv");
    $("#STREAMCONTAINER").attr("data-chan", channel);
    $("#STREAMCONTAINER").attr("data-bar", hbar);
    list_streams();
}

function nnd(obj) {
    urlInput = document.getElementById('urlInput');
    var a = document.createElement('a');
    if ((obj.toLowerCase().substr(0, 18) === "live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 22) === "www.live.nicovideo.jp/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 25) === "http://live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 26) === "https://live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 29) === "http://www.live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 30) === "https://www.live.nicovideo.jp/")) {
        a.href = obj;
    }
    else if ((obj.toLowerCase().substr(0, 13) === "nicovideo.jp/") || (obj.toLowerCase().substr(0, 14) === "nicovideo.jp/") || (obj.toLowerCase().substr(0, 17) === "www.nicovideo.jp/") || (obj.toLowerCase().substr(0, 18) === "www.nicovideo.jp/")) {
        a.href = 'http://' + obj;
    }
    else if ((obj.toLowerCase().substr(0, 20) === "http://nicovideo.jp/") || (obj.toLowerCase().substr(0, 21) === "https://nicovideo.jp/") || (obj.toLowerCase().substr(0, 24) === "http://www.nicovideo.jp/") || (obj.toLowerCase().substr(0, 25) === "https://www.nicovideo.jp/")) {
        a.href = obj;
    }
    else if ((obj.toLowerCase().substr(0, 2).match(/sm|nm/g))) {
        a.href = "http://nicovideo.jp/watch/" + obj;
    }
    else {
        a.href = "http://live.nicovideo.jp/watch/" + obj;
    }
    var urlPath = a.pathname.split("/");
    if ((a.pathname.toLowerCase().substr(0, 1) != "/")) {
            var channel = urlPath[1];
    } else {
            var channel = urlPath[2];
    }
    var domain = a.href.replace('http://','').replace('https://','').replace('www.','').replace('.jp','').split(/[/?#]/)[0];
    if (domain === "nicovideo") {
        var playerW = $("#STREAMCONTAINER").width();
    	var playerH = (playerW / ( ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent")) * 0.9836065573770492 )) + 27;
    	$("#STREAMCONTAINER").html('<iframe src="nico?' + channel + '" width="' + playerW + '" height="' + playerH + '" frameborder="0" scrolling="no"></iframe><input class="sitename hidden" type="text" value="nnd">');
    	$("#STREAMCONTAINER").attr("data-site", "nnd");
    	$("#STREAMCONTAINER").attr("data-bar", "27"); 
    } else {
        var playerW = $("#STREAMCONTAINER").width();
    	var playerH = (playerW / ( ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent")) * 0.9836065573770492 ));
    	$("#STREAMCONTAINER").html('<iframe src="http://live.nicovideo.jp/nicoliveplayer.swf?131009162241&languagecode=en-us&v=' + channel + '" width="' + playerW + '" height="' + playerH + '" frameborder="0" scrolling="no"></iframe><input class="sitename hidden" type="text" value="nnl">');
    	$("#STREAMCONTAINER").attr("data-site", "nnl");
    	$("#STREAMCONTAINER").attr("data-bar", "0"); 
    }
    document.getElementById("sitename").setAttribute("value", "nnd");
    $(".streamoption_selected").attr('class', '');
    $("#nnd-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-chan", channel);
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    $('#STREAMCONTAINER').parent().find('.urls').append("<a href='javascript:popout(\"http://www.nicovideo.jp/login\", 600, 400)'>Login</a>");
    list_streams();
}

/*
function any(obj, bar) {
    urlInput = document.getElementById('urlInput');
    if (isNaN(bar)) {bar = 0};
    var playerW = document.getElementById("STREAMCONTAINER").offsetWidth;
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent"))) + parseInt(bar);
    if ((obj.toLowerCase().substr(0, 7) == "http://") || (obj.toLowerCase().substr(0, 8) == "https://")) {
        document.getElementById("STREAMCONTAINER").innerHTML = "<object data='" + obj + "' width='" + playerW + "' height='" + playerH +"' allowScriptAccess='always'></object><input class='sitename hidden' type='text' value='any'>";
    }
    else if (obj.length === 0) {
    document.getElementById("STREAMCONTAINER").innerHTML = "<object width='" + playerW + "' height='" + playerH + "' allowScriptAccess='always'></object><input class='sitename hidden' type='text' value='any'>";
    }
    else {
        document.getElementById("STREAMCONTAINER").innerHTML = obj + "<input class='sitename hidden' type='text' value='any'>";
    }
    document.getElementById("sitename").setAttribute("value", "any");
    $(".streamoption_selected").attr('class', '');
    $("#any-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "any");
    $("#STREAMCONTAINER").attr("data-chan", "");
    $("#STREAMCONTAINER").attr("data-bar", bar);
    $('#STREAMCONTAINER').parent().find('.urls').html("");
}
*/

function any(obj, bar) {
    urlInput = document.getElementById('urlInput');
    if (isNaN(bar)) {bar = 0};
    var playerW = document.getElementById("STREAMCONTAINER").offsetWidth;
    var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent"))) + parseInt(bar);
    if ((obj.toLowerCase().substr(0, 7) == "http://") || (obj.toLowerCase().substr(0, 8) == "https://")) {
        document.getElementById("STREAMCONTAINER").innerHTML = "<iframe src='" + obj + "' width='" + playerW + "' height='" + playerH +"' frameborder=0 allowScriptAccess='always' allowfullscreen='true'></iframe><input class='sitename hidden' type='text' value='any'>";
    }
    else if (obj.length === 0) {
    document.getElementById("STREAMCONTAINER").innerHTML = "<iframe src='" + obj + "' width='" + playerW + "' height='" + playerH + "' frameborder=0 allowScriptAccess='always' allowfullscreen='true'></iframe><input class='sitename hidden' type='text' value='any'>";
    }
    else {
        document.getElementById("STREAMCONTAINER").innerHTML = obj + "<input class='sitename hidden' type='text' value='any'>";
    }
    document.getElementById("sitename").setAttribute("value", "any");
    $(".streamoption_selected").attr('class', '');
    $("#any-icon").attr('class', 'streamoption_selected');
    $("#STREAMCONTAINER").attr("data-site", "any");
    $("#STREAMCONTAINER").attr("data-chan", "");
    $("#STREAMCONTAINER").attr("data-bar", bar);
    $('#STREAMCONTAINER').parent().find('.urls').html("");
    list_streams();
}


function shadeColor1(color, percent) {
    var num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function stringHexNumber(x) {
    return '#' + 000000 + (
    parseInt(
    parseInt(x, 36)
        .toExponential()
        .slice(2, -5), 10) & 0xFFFFFF).toString(16).toUpperCase().slice(-6);
}

//lol
function history(obj) {
var icon, label, link, isVideo;
var sitename = $('#sitename').val();
var objregex = /(https?:\/\/)|(www.)|(twitch.tv\/)|(justin.tv\/)|(ustream.tv\/(channel\/)?)|(livestream.com\/)|((live.)?nicovideo.jp\/watch\/)|(hitbox.tv\/)|((gaming.)?youtube.com\/(watch\?v=)?(v\/)?)|(youtu.be\/)/gi;
//(playlist\?list=)?(results\?search_query=)?(user)?
var specialchar = /(\?)|(\/)|(\=)|(\.)|(\#)|(\&)|(\+)|[\s]/g;
var objlink = new Array();
		objlink["ttv"] = "http://twitch.tv/";
		objlink["jtv"] = "http://justin.tv/";
		if (obj.replace(/(https?:\/\/)|(www.)|(ustream.tv\/)/g, '').toLowerCase().substr(0,9) === "recorded/") {
			objlink["ust"] = "http://ustream.tv/";
		} else {
			objlink["ust"] = "http://ustream.tv/channel/";
		}
		objlink["lst"] = "http://livestream.com/";
		if (obj.toLowerCase().substr(0,2) === "sm" || obj.replace(/(https?:\/\/)|(www.)/g, '').toLowerCase().substr(0,13) === "nicovideo.jp/"){
			objlink["nnd"] = "http://nicovideo.jp/watch/";
		} else {
			objlink["nnd"] = "http://live.nicovideo.jp/watch/";
		}
		objlink["htv"] = "http://hitbox.tv/"
		if (obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,8) === "playlist" || obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,7) === "results" || obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,4) === "user" || obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,1) === "/") {
			objlink["yut"] = "http://youtube.com/";
		}
		else if (obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,9) === "youtu.be/" || obj.match(/&t=|#t=/g)) {
			objlink["yut"] = "http://youtube.com/watch?v=";
			isVideo = true;
		}
		else if (obj.replace(objregex, '').length !== 11 || obj.match(/[\s]/)) {
    			objlink["yut"] = "http://youtube.com/results?search_query=";
    		}
		else {
			objlink["yut"] = "http://youtube.com/watch?v=";
			isVideo = true;
		}
if (obj.length === 0) {return;}
obj = obj.replace(/'/g, '"');
	if (sitename.match(/(ttv|jtv|ust|lst|nnd|htv|yut)/) ) {
		obj = obj.replace(objregex, '');
		link = objlink[sitename];
	} 
	else if (obj.toLowerCase().substr(0,4) === "http") {
		link = "";
	} else {
		link = sitename+": ";
	}
	if (sitename === "ttv") {
		icon = "IS/jtv.png";
	} else if (sitename === "nnd" && obj.toLowerCase().substr(0, 2) === "co") {
		icon = "http://icon.nimg.jp/community/"+obj.toLowerCase().substr(2, (obj.length - 6))+"/"+obj+".jpg";
	} else if (sitename === "nnd" && obj.toLowerCase().substr(0, 2) === "ch") {
		icon = "http://icon.nimg.jp/channel/s/"+obj.toLowerCase()+".jpg";
	} else if (sitename === "nnd" && obj.toLowerCase().substr(0, 2).match(/sm|nm/g)) {
		icon = "http://tn-skr3.smilevideo.jp/smile?i="+obj.toLowerCase().substr(2, obj.length);
	}/* else if (sitename === "yut" && /playlist|results|user/g.test(obj) === false) {
		icon = "http://i1.ytimg.com/vi/"+obj+"/default.jpg";	
	}*/ else {
		icon = "IS/"+sitename+".png";
	}
	if (obj.match(/<|>/g)) {
		label = "html";
	} else {
		label = obj;
	}
	if (label.substr(0,4) === "html" && sitename !== "any") {return;}

var sitenameID = sitename+'-'+label.toLowerCase();
sitenameID = sitenameID.replace(specialchar, '');
	if ($('#h-'+sitenameID).length && label !== "html") {
		$('#h-'+sitenameID).prependTo('#historycont');
		//$('#h-'+sitename+'-'+label.toLowerCase()+' span').html(label);
		if (sitename === "ttv" && $('#h-'+sitenameID+' img').attr('src') === "IS/jtv.png") {
		label = label.split("/")[0];
 $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/kraken/streams?channel=" + label.toLowerCase(),
            headers: {
                "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
            },
            success: function(data) {
    				if (data.streams[0].channel.logo != null) { 
    					$('#h-'+sitenameID+' img').attr('src', data.streams[0].channel.logo);
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #6542a6',
    					'border-right': 'solid 2px #6542a6',
    					'border-bottom': 'solid 2px #4e3380',
    					'border-left': 'solid 2px #4e3380',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					localStorage.setItem("histStorage", $('#historycont').html());
				}
			}	
			});
		}
		if (sitename === "jtv" && $('#h-'+sitenameID+' img').attr('src') === "IS/jtv.png") {
			$.getJSON("http://api.justin.tv/api/stream/list.json?channel="+ label.toLowerCase() +"&jsonp=?", function(data){
    				if (data[0]["channel"]["image_url_tiny"] != null) { 
    					$('#h-'+sitenameID+' img').attr('src', data[0]["channel"]["image_url_tiny"]);
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #6542a6',
    					'border-right': 'solid 2px #6542a6',
    					'border-bottom': 'solid 2px #4e3380',
    					'border-left': 'solid 2px #4e3380',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					localStorage.setItem("histStorage", $('#historycont').html());
				}	
			});
		}
	} 
	
	else if ($('#'+sitenameID).length) {
		$('#historycont').prepend("<li id='h-"+sitenameID+"' onclick='history(&#39;"+obj+"&#39;)'>"+$('#'+sitename+'-'+label.toLowerCase()).html()+"</li>");
	}
	else if (sitename === "any") {
		$('#historycont').prepend("<li id='h-"+sitename+"-"+label.toLowerCase()+"' onclick='$(this).prependTo(&#39;#historycont&#39;)'><a href='"+link+obj+"' onclick='"+sitename+"(&#39;"+obj+"&#39;);return false;'><img src='"+icon+"' width='50px' height='50px' /><span>"+label+"</span></a></li>");
	} else {
		$('#historycont').prepend("<li id='h-"+sitenameID+"' onclick='history(&#39;"+obj+"&#39;)'><a href='"+link+obj+"' onclick='"+sitename+"(&#39;"+obj+"&#39;);return false'><img src='"+icon+"' width='50px' height='50px' /><span>"+label+"</span></a></li>");
		if (sitename === "ttv") {
			var vodId = label.split("/");vodId.shift();vodId = vodId.join('');
			label = label.split("/")[0];
if (vodId) {
			$.getJSON("https://api.twitch.tv/kraken/videos/"+ vodId, function(data){
    				if (data["preview"] != null) { 
    					$('#h-'+sitenameID+' img').attr('src', data["preview"]);
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #6542a6',
    					'border-right': 'solid 2px #6542a6',
    					'border-bottom': 'solid 2px #4e3380',
    					'border-left': 'solid 2px #4e3380',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					if (data["title"]) {
    						$('#h-'+sitenameID+' span').html(data["title"]);
    					} else {
    						$('#h-'+sitenameID+' span').html(label + " " + vodId);
    					}
    					localStorage.setItem("histStorage", $('#historycont').html());
				}	
			});
} else {


//			$.getJSON("https://api.twitch.tv/kraken/channels/"+ label.toLowerCase(), function(data){

 $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/kraken/streams?channel=" + label.toLowerCase(),
            headers: {
                "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
            },
            success: function(data) {
    				if (data.streams[0].channel.logo != null) { 
    					$('#h-'+sitenameID+' img').attr('src', data.streams[0].channel.logo);
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #6542a6',
    					'border-right': 'solid 2px #6542a6',
    					'border-bottom': 'solid 2px #4e3380',
    					'border-left': 'solid 2px #4e3380',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					$('#h-'+sitenameID+' span').html(data.streams[0].channel.display_name.split(/(?=[A-Z][a-z])/).join(" ").replace(/_/g," "));
    					localStorage.setItem("histStorage", $('#historycont').html());
				}	
				
			}
		});
}
		}
		if (sitename === "jtv") {
			$.getJSON("http://api.justin.tv/api/stream/list.json?channel="+ label.toLowerCase() +"&jsonp=?", function(data){
    				if (data[0]["channel"]["image_url_tiny"] != null) { 
    					$('#h-'+sitenameID+' img').attr('src', data[0]["channel"]["image_url_tiny"]);
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #6542a6',
    					'border-right': 'solid 2px #6542a6',
    					'border-bottom': 'solid 2px #4e3380',
    					'border-left': 'solid 2px #4e3380',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					localStorage.setItem("histStorage", $('#historycont').html());
				}	
			});
		}
		if (sitename === "ust") {
			$.getJSON("http://api.ustream.tv/json/channel/"+ label.toLowerCase() +"/getInfo?callback=?", function(data){
    					$('#h-'+sitenameID+' img').attr('src', data["imageUrl"]["small"].replace('120x90','90x90'));
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #09f',
    					'border-right': 'solid 2px #09f',
    					'border-bottom': 'solid 2px #05b',
    					'border-left': 'solid 2px #05b',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					$('#h-'+sitenameID+' span').html(data["title"]);
    					localStorage.setItem("histStorage", $('#historycont').html());
			});
		}
		if (sitename === "lst") {
			$.getJSON("http://x"+ label.toLowerCase() +"x.api.channel.livestream.com/2.0/info.json?callback=?", function(data){
    					$('#h-'+sitenameID+' img').attr('src', data["channel"]["image"]["url"]);
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #09f',
    					'border-right': 'solid 2px #09f',
    					'border-bottom': 'solid 2px #05b',
    					'border-left': 'solid 2px #05b',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					localStorage.setItem("histStorage", $('#historycont').html());
			});
		}
		if (sitename === "nnd" && obj.toLowerCase().substr(0, 2).match(/co|ch|sm|nm/)) {
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #edff2b',
    					'border-right': 'solid 2px #edff2b',
    					'border-bottom': 'solid 2px #8da200',
    					'border-left': 'solid 2px #8da200',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					localStorage.setItem("histStorage", $('#historycont').html());
		}
		if (sitename === "yut") {
					$('#h-'+sitenameID+' img').attr("onerror", "this.onerror=null;this.src='IS/yut.png'");
    					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #edff2b',
    					'border-right': 'solid 2px #edff2b',
    					'border-bottom': 'solid 2px #8da200',
    					'border-left': 'solid 2px #8da200',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					if (isVideo) {
    					$.getJSON("http://gdata.youtube.com/feeds/api/videos/"+label.replace(/(\#|\&|\?)t=[\S]+/, '')+"?v=2&alt=json", function(data){
					        $('#h-'+sitenameID+' span').html(data['entry']['title']['$t']);
					});
					}
					if (label.toLowerCase().substr(0,8) === "playlist") {
					$.getJSON("http://gdata.youtube.com/feeds/api/playlists/"+label.replace(/playlist\?list=/, '')+"?v=2&alt=json", function(data){
					        $('#h-'+sitenameID+' span').html(data['feed']['title']['$t']);
					});
					}
					if (label.toLowerCase().substr(0,4) === "user" || label.toLowerCase().substr(0,1) === "/") {
					$.getJSON("http://gdata.youtube.com/feeds/api/users/"+label.replace(/(user)?\/?/, '')+"?v=2&alt=json", function(data){
					        $('#h-'+sitenameID+' span').html(data['entry']['title']['$t']);
					        $('#h-'+sitenameID+' img').attr('src', data['entry']['media$thumbnail']['url']);
					});
					} else if (!isVideo) {
					//$('#h-'+sitenameID+' img').attr('src', 'http://'+label.replace(/(playlist\?list=)?(results\?search_query=)?(user)?/g, '').replace(/\#?\&?\??t=[\S]+/, '').replace(' ', '_').replace(specialchar, '')+'.jpg.to');
					} else {
					$('#h-'+sitenameID+' img').attr('src', 'http://i1.ytimg.com/vi/'+label.replace(/(\#|\&|\?)t=[\S]+/, '')+'/default.jpg');
					}
    					localStorage.setItem("histStorage", $('#historycont').html());
    					
		}
		if (sitename === "htv") {
$('#h-'+sitenameID+' img').attr('src', 'IS/hitbox.png');
			$.getJSON("http://api.hitbox.tv/media/live/"+label+".json", function(data){
					$('#h-'+sitenameID+' img').css({
    					/*
    					'border-top': 'solid 2px #edff2b',
    					'border-right': 'solid 2px #edff2b',
    					'border-bottom': 'solid 2px #8da200',
    					'border-left': 'solid 2px #8da200',
    					*/
    					'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
    					'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
    					'border-radius': '4px'
    					});
    					$('#h-'+sitenameID+' img').attr('height', '46px');
    					$('#h-'+sitenameID+' img').attr('width', '46px');
    					$('#h-'+sitenameID+' img').attr('src', 'http://edge.vie.hitbox.tv'+data['livestream'][0]['channel']['user_logo_small']);
    					$('#h-'+sitenameID+' span').html(data['livestream'][0]['media_user_name']);
    					localStorage.setItem("histStorage", $('#historycont').html());
			});
		}
	}
if ($('#historycont li').length > 30) {
        $('#historycont li:last-child').remove();
    }
    var histHTML = $('#historycont').html();
    localStorage.setItem("histStorage", histHTML);   
    dragDelete();  
}

function waifu(obj) {
    if ((obj.toLowerCase().substr(0, 1) == "<") || (obj.toLowerCase().substr(0, 7) == "http://") || (obj.toLowerCase().substr(0, 8) == "https://") || (obj.toLowerCase().substr(0, 4) == "www.") || (obj.toLowerCase().substr(0, 10) === "justin.tv/") || (obj.toLowerCase().substr(0, 10) === "twitch.tv/") || (obj.toLowerCase().substr(0, 11) === "ustream.tv/") || (obj.toLowerCase().substr(0, 15) === "livestream.com/") || (obj.toLowerCase().substr(0, 12) === "youtube.com/") || (obj.toLowerCase().substr(0, 9) === "youtu.be/")  || (obj.toLowerCase().substr(0, 23) === "youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 9) === "hashd.tv/") ||  (obj.length === 0) || (obj.toLowerCase().substr(0, 13) === "nicovideo.jp/") || (obj.toLowerCase().substr(0, 18) === "live.nicovideo.jp/")) {
        if ((obj.toLowerCase().substr(0, 17) === "http://justin.tv/") || (obj.toLowerCase().substr(0, 18) === "https://justin.tv/") || (obj.toLowerCase().substr(0, 21) === "http://www.justin.tv/") || (obj.toLowerCase().substr(0, 22) === "https://www.justin.tv/") || (obj.toLowerCase().substr(0, 10) === "justin.tv/") || (obj.toLowerCase().substr(0, 14) === "www.justin.tv/")) {
            jtv(obj);
        }
        else if ((obj.toLowerCase().substr(0, 17) === "http://twitch.tv/") || (obj.toLowerCase().substr(0, 18) === "https://twitch.tv/") || (obj.toLowerCase().substr(0, 21) === "http://www.twitch.tv/") || (obj.toLowerCase().substr(0, 22) === "https://www.twitch.tv/") || (obj.toLowerCase().substr(0, 10) === "twitch.tv/") || (obj.toLowerCase().substr(0, 14) === "www.twitch.tv/")) {
            ttv(obj);
        }
        else if ((obj.toLowerCase().substr(0, 18) === "http://ustream.tv/") || (obj.toLowerCase().substr(0, 19) === "https://ustream.tv/") || (obj.toLowerCase().substr(0, 22) === "http://www.ustream.tv/") || (obj.toLowerCase().substr(0, 23) === "https://www.ustream.tv/") || (obj.toLowerCase().substr(0, 11) === "ustream.tv/") || (obj.toLowerCase().substr(0, 15) === "www.ustream.tv/")) {
            ust(obj);
        }
        else if ((obj.toLowerCase().substr(0, 22) === "http://livestream.com/") || (obj.toLowerCase().substr(0, 23) === "https://livestream.com/") || (obj.toLowerCase().substr(0, 26) === "http://www.livestream.com/") || (obj.toLowerCase().substr(0, 27) === "https://www.livestream.com/") || (obj.toLowerCase().substr(0, 15) === "livestream.com/") || (obj.toLowerCase().substr(0, 19) === "www.livestream.com/")) {
            lst(obj);
        }
        else if ((obj.toLowerCase().substr(0, 19) === "http://youtube.com/") || (obj.toLowerCase().substr(0, 30) === "http://youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 20) === "https://youtube.com/") || (obj.toLowerCase().substr(0, 31) === "https://youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 23) === "http://www.youtube.com/") || (obj.toLowerCase().substr(0, 34) === "http://www.youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 24) === "https://www.youtube.com/") || (obj.toLowerCase().substr(0, 35) === "https://www.youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 12) === "youtube.com/") || (obj.toLowerCase().substr(0, 16) === "www.youtube.com/") || (obj.toLowerCase().substr(0, 23) === "youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 27) === "www.youtube.googleapis.com/") || (obj.toLowerCase().substr(0, 9) === "youtu.be/") || (obj.toLowerCase().substr(0, 16) === "http://youtu.be/") || (obj.toLowerCase().substr(0, 17) === "https://youtu.be/") || (obj.toLowerCase().substr(0, 19) === "gaming.youtube.com/") || (obj.toLowerCase().substr(0, 26) === "http://gaming.youtube.com/") || (obj.toLowerCase().substr(0, 27) === "https://gaming.youtube.com/")) {
            yut(obj);
        }
        else if ((obj.toLowerCase().substr(0, 17) === "http://hitbox.tv/") || (obj.toLowerCase().substr(0, 18) === "https://hitbox.tv/") || (obj.toLowerCase().substr(0, 21) === "http://www.hitbox.tv/") || (obj.toLowerCase().substr(0, 22) === "https://www.hitbox.tv/") || (obj.toLowerCase().substr(0, 10) === "hitbox.tv/") || (obj.toLowerCase().substr(0, 14) === "www.hitbox.tv/")) {
            htv(obj);
        }
        else if ((obj.toLowerCase().substr(0, 20) === "http://nicovideo.jp/") || (obj.toLowerCase().substr(0, 25) === "http://live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 21) === "https://nicovideo.jp/") || (obj.toLowerCase().substr(0, 26) === "https://live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 24) === "http://www.nicovideo.jp/") || (obj.toLowerCase().substr(0, 29) === "http://www.live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 25) === "https://www.nicovideo.jp/") || (obj.toLowerCase().substr(0, 30) === "https://www.live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 13) === "nicovideo.jp/") || (obj.toLowerCase().substr(0, 18) === "live.nicovideo.jp/") || (obj.toLowerCase().substr(0, 17) === "www.nicovideo.jp/") || (obj.toLowerCase().substr(0, 22) === "www.live.nicovideo.jp/")) {
            nnd(obj);
        }
        else if (obj.length === 0) {
            var playerW = document.getElementById("STREAMCONTAINER").offsetWidth;
            var playerH = (playerW / ($('#STREAMCONTAINER').attr("data-antecedent") / $('#STREAMCONTAINER').attr("data-consequent")));
            var randomNumber = Math.floor(Math.random() * 125);
            var bgs = "<object data='http://fightanvidya.com/IS/BGS/bg_" + randomNumber + ".gif' width='" + playerW + "' height='" + playerH + "' allowScriptAccess='always'></object>";
            any(bgs);
        }
        else {
            any(obj);
        }
    }
    else if (obj.toLowerCase().substr(0,2) === "a=") {    
    	    var clean = obj.replace('a=','');
    	    var ratio = clean.split(":");
    	    alert("aspect ratio set to "+ratio[0]+":"+ratio[1]);
            $("#STREAMCONTAINER").attr("data-antecedent", ratio[0]);
            $("#STREAMCONTAINER").attr("data-consequent", ratio[1]);
    } else if (obj.toLowerCase().substr(0,4) === "bar=") {    
    	    var clean = obj.replace('bar=','');
    	    alert("control bar set to "+clean);
            $("#STREAMCONTAINER").attr("data-bar", clean);
    } 
    else {
        window[document.getElementById('sitename').value](obj);
    }
history(obj);
}
/*
=======================================================================
*/
var lazy = true;
if (!(navigator.appVersion.indexOf("Win")!=-1)) {isHtml5 = true}
function popout(url, h, w)
{
	streamwindow=window.open(url,url,'height=' + h + ',width=' + w);
	if (window.focus) {streamwindow.focus()}
}
var snowOn = 0;
function getTTVInfo(channel) {
$.getJSON("https://api.twitch.tv/kraken/streams?channel="+ channel.toLowerCase() +"&callback=?", function(data){if (data["streams"][0]["channel"]["status"] != null){info = "\\n" + data["streams"][0]["channel"]["status"];} else {info= "test";}viewers = data["streams"][0]["viewers"];if (viewers === 1) {vWord = " viewer";}else{vWord = " viewers";}game = data["streams"][0]["channel"]["game"];});$(this).attr("title", viewers.toLocaleString() + vWord + info)
}
function snow() {
	if (snowOn == 0) {
		window.scrollTo(0,0);
		var scrollTop     = $(window).scrollTop(),elementOffset = $('#mainbox').offset().top,distance = (elementOffset - scrollTop - 8);
    		if (distance > 160) {distance = 160;}
		$('body').snowfall({flakeCount : 150, maxSpeed : 5, collection : '#mainbox', collectionHeight : distance});
		snowOn = 1;
	} else {
		$('body').snowfall('clear');
		snowOn = 0;
		//$('canvas').click(function() {
		$('canvas').remove();
		//});
	}
}

var update;

function geton() {
	clearTimeout(update);
	$.ajax({
		url: "resources/data/channels.data.php?live=1",
		type: "GET",
		success: function(data) {
			$('#oncont').html(data);
			update = setTimeout(geton,120000);
			$('a#liveicons').text('Online');
			$('#oncont li[id^="ttv"]').on("mouseover", function(){ttvInfo($(this).find('span'), $(this).attr('id').substring(4))});
		},
		error: function(x, t, m) {
			if(t==="timeout") {
				$('a#liveicons').text('Online | Timed out: Click to refresh');
			} else {
				$('a#liveicons').text('Online | Error: Click to refresh');
			}
		}
	});
}

function getoff() {
    clearTimeout(update);
    $.get('resources/data/channels.data.php?live=0',
      function(data) {
        $('#offcont').html(data);
      })
}
function getother() {
    clearTimeout(update);
    $.get('resources/data/channels.data.php?live=2',
      function(data) {
        $('#othercont').html(data);
      })
}

/* ============ Views test ================== */

function make_button(obj, sitename, views) {
var icon, label, link, isVideo;
//var sitename = $('#sitename').val();
var objregex = /(https?:\/\/)|(www.)|(twitch.tv\/)|(justin.tv\/)|(ustream.tv\/(channel\/)?)|(livestream.com\/)|((live.)?nicovideo.jp\/watch\/)|(hitbox.tv\/)|((gaming.)?youtube.com\/(watch\?v=)?(v\/)?)|(youtu.be\/)/gi;
//(playlist\?list=)?(results\?search_query=)?(user)?
var specialchar = /(\?)|(\/)|(\=)|(\.)|(\#)|(\&)|(\+)|[\s]/g;
var objlink = new Array();
        objlink["ttv"] = "http://twitch.tv/";
        objlink["jtv"] = "http://justin.tv/";
        if (obj.replace(/(https?:\/\/)|(www.)|(ustream.tv\/)/g, '').toLowerCase().substr(0,9) === "recorded/") {
            objlink["ust"] = "http://ustream.tv/";
        } else {
            objlink["ust"] = "http://ustream.tv/channel/";
        }
        objlink["lst"] = "http://livestream.com/";
        if (obj.toLowerCase().substr(0,2) === "sm" || obj.replace(/(https?:\/\/)|(www.)/g, '').toLowerCase().substr(0,13) === "nicovideo.jp/"){
            objlink["nnd"] = "http://nicovideo.jp/watch/";
        } else {
            objlink["nnd"] = "http://live.nicovideo.jp/watch/";
        }
        objlink["htv"] = "http://hitbox.tv/"
        if (obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,8) === "playlist" || obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,7) === "results" || obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,4) === "user" || obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,1) === "/") {
            objlink["yut"] = "http://youtube.com/";
        }
        else if (obj.replace(/(https?:\/\/)|(www.)|(youtube.com\/)/g, '').toLowerCase().substr(0,9) === "youtu.be/" || obj.match(/&t=|#t=/g)) {
            objlink["yut"] = "http://youtube.com/watch?v=";
            isVideo = true;
        }
        else if (obj.replace(objregex, '').length !== 11 || obj.match(/[\s]/)) {
                objlink["yut"] = "http://youtube.com/results?search_query=";
            }
        else {
            objlink["yut"] = "http://youtube.com/watch?v=";
            isVideo = true;
        }
if (obj.length === 0) {return;}
obj = obj.replace(/'/g, '"');
    if (sitename.match(/(ttv|jtv|ust|lst|nnd|htv|yut)/) ) {
        obj = obj.replace(objregex, '');
        link = objlink[sitename];
    } 
    else if (obj.toLowerCase().substr(0,4) === "http") {
        link = "";
    } else {
        link = sitename+": ";
    }
    if (sitename === "ttv") {
        icon = "IS/jtv.png";
    } else if (sitename === "nnd" && obj.toLowerCase().substr(0, 2) === "co") {
        icon = "http://icon.nimg.jp/community/"+obj.toLowerCase().substr(2, (obj.length - 6))+"/"+obj+".jpg";
    } else if (sitename === "nnd" && obj.toLowerCase().substr(0, 2) === "ch") {
        icon = "http://icon.nimg.jp/channel/s/"+obj.toLowerCase()+".jpg";
    } else if (sitename === "nnd" && obj.toLowerCase().substr(0, 2).match(/sm|nm/g)) {
        icon = "http://tn-skr3.smilevideo.jp/smile?i="+obj.toLowerCase().substr(2, obj.length);
    }/* else if (sitename === "yut" && /playlist|results|user/g.test(obj) === false) {
        icon = "http://i1.ytimg.com/vi/"+obj+"/default.jpg";    
    }*/ else {
        icon = "IS/"+sitename+".png";
    }
    if (obj.match(/<|>/g)) {
        label = "html";
    } else {
        label = obj;
    }
    if (label.substr(0,4) === "html" && sitename !== "any") {return;}

var sitenameID = sitename+'-'+label.toLowerCase();
sitenameID = sitenameID.replace(specialchar, '');
sitenameID = sitenameID.replace('%20', '');
    if ($('#w-'+sitenameID).length && label !== "html") {
        $('#w-'+sitenameID).prependTo('#watercont');
        $('#w-'+sitenameID+' strong.views').text(" ("+views+")");
        if (sitename === "ttv" && ($('#w-'+sitenameID+' img').attr('src') === "IS/jtv.png" || $('#w-'+sitenameID+' img').attr('src') === "IS/PENGUIN.png") ) {
        label = label.split("/")[0];
            $.ajax({
            type: "GET",
            url: "https://api.twitch.tv/kraken/streams?channel=" + label.toLowerCase(),
            headers: {
                "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
            },
            success: function(data) {
                    if (data.streams.length) { 
                        $('#w-'+sitenameID+' img').attr('src', data.streams[0].channel.logo);
                        $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
                } else {
                	//console.log('hiding: ' +sitenameID)
                	$('#w-'+sitenameID).css('filter', 'grayscale(1)');
                }
                
            }   
            });
        }

    } 
    
    else if ($('#'+sitenameID).length && $('#'+sitenameID + ' img').attr('src') !== "SI/IC/PENGUIN.png" && $('#'+sitenameID + ' img').attr('src') !== "SI/IC/SH.png") {
    
        $('#watercont').prepend("<li id='w-"+sitenameID+"' class='test'>"+$('#'+sitename+'-'+label.toLowerCase()).html()+"</li>");
        console.log( "HEY", $('#w-'+sitenameID).html() );
        $('#w-'+sitenameID+' span').append("<strong class='views'> ("+views+")</strong>");
    }
    else if (sitename === "any") {
        $('#watercont').prepend("<li id='w-"+sitename+"-"+label.toLowerCase()+"'><a href='"+link+obj+"' onclick='"+sitename+"(&#39;"+obj+"&#39;);return false;'><img src='"+icon+"' width='50px' height='50px' /><span>"+label+"<strong class='views'> ("+views+")</strong></span></a></li>");
    } else {
        $('#watercont').prepend("<li id='w-"+sitenameID+"'><a href='"+link+obj+"' onclick='"+sitename+"(&#39;"+obj+"&#39;);return false'><img src='"+icon+"' width='50px' height='50px' /><span>"+label+"<strong class='views'> ("+views+")</strong></span></a></li>");
        if (sitename === "ttv") {
            var vodId = label.split("/");vodId.shift();vodId = vodId.join('');
            label = label.split("/")[0];
if (vodId) {
            $.getJSON("https://api.twitch.tv/kraken/videos/"+ vodId, function(data){
                    if (data["preview"] != null) { 
                        $('#w-'+sitenameID+' img').attr('src', data["preview"]);
                        $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
                        if (data["title"]) {
                            $('#w-'+sitenameID+' span').html(data["title"]);
                        } else {
                            $('#w-'+sitenameID+' span').html(label + " " + vodId + ' (' + views +')');
                        }
                }   
            });
} else {
$.ajax({
            type: "GET",
            url: "https://api.twitch.tv/kraken/streams?channel=" + label.toLowerCase(),
            headers: {
                "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
            },
            success: function(data) {
                    if (data.streams.length) { 
                    	var logo = data.streams[0].channel.logo;
                    	var title = data.streams[0].channel.display_name;
                    	title = title.split(/(?=[A-Z][a-z])/).join(" ").replace(/_/g," ");
                        $('#w-'+sitenameID+' img').attr('src', logo);
                        $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
                        $('#w-'+sitenameID+' span').html(title + ' ('+ views +')' );
                } else {
                	//console.log('hiding: ' +sitenameID)
                	$('#w-'+sitenameID).css('filter', 'grayscale(1)');
                }
                
            }   
            });
}
        }
        if (sitename === "ust") {
            $.getJSON("https://api.ustream.tv/channels/"+ label.toLowerCase() +".json", function(data){
            		if (data.channel && data.channel.status !== "offair") {
            			var logo = data.channel.picture['48x48'];
	                        $('#w-'+sitenameID+' img').attr('src', logo);
	                        $('#w-'+sitenameID+' img').css({
	                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), 0),
	                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), 0),
	                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), -30),
	                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(data["id"]), -30),
	                        'border-radius': '4px'
	                        });
	                        $('#w-'+sitenameID+' img').attr('height', '46px');
	                        $('#w-'+sitenameID+' img').attr('width', '46px');
	                        $('#w-'+sitenameID+' span').html(data["title"]);
                        } else {
                        	$('#w-'+sitenameID).css('filter', 'grayscale(1)');
                        }
            });
        }
        if (sitename === "lst") {
            $.getJSON("http://x"+ label.toLowerCase() +"x.api.channel.livestream.com/2.0/info.json?callback=?", function(data){
                        $('#w-'+sitenameID+' img').attr('src', data["channel"]["image"]["url"]);
                        $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
            });
        }
        if (sitename === "nnd" && obj.toLowerCase().substr(0, 2).match(/co|ch|sm|nm/)) {
                        $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
        }
        if (sitename === "yut") {
                    $('#w-'+sitenameID+' img').attr("onerror", "this.onerror=null;this.src='IS/yut.png'");
                        $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label.replace(specialchar, '')), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
                        if (isVideo) {
                        $.getJSON("http://gdata.youtube.com/feeds/api/videos/"+label.replace(/(\#|\&|\?)t=[\S]+/, '')+"?v=2&alt=json", function(data){
                            $('#w-'+sitenameID+' span').html(data['entry']['title']['$t']);
                    });
                    }
                    if (label.toLowerCase().substr(0,8) === "playlist") {
                    $.getJSON("http://gdata.youtube.com/feeds/api/playlists/"+label.replace(/playlist\?list=/, '')+"?v=2&alt=json", function(data){
                            $('#w-'+sitenameID+' span').html(data['feed']['title']['$t']);
                    });
                    }
                    if (label.toLowerCase().substr(0,4) === "user" || label.toLowerCase().substr(0,1) === "/") {
                    $.getJSON("http://gdata.youtube.com/feeds/api/users/"+label.replace(/(user)?\/?/, '')+"?v=2&alt=json", function(data){
                            $('#w-'+sitenameID+' span').html(data['entry']['title']['$t']);
                            $('#w-'+sitenameID+' img').attr('src', data['entry']['media$thumbnail']['url']);
                    });
                    } else if (!isVideo) {
                    //$('#w-'+sitenameID+' img').attr('src', 'http://'+label.replace(/(playlist\?list=)?(results\?search_query=)?(user)?/g, '').replace(/\#?\&?\??t=[\S]+/, '').replace(' ', '_').replace(specialchar, '')+'.jpg.to');
                    } else {
                    $('#w-'+sitenameID+' img').attr('src', 'http://i1.ytimg.com/vi/'+label.replace(/(\#|\&|\?)t=[\S]+/, '')+'/default.jpg');
                    }
                        
        }
        if (sitename === "htv") {
$('#w-'+sitenameID+' img').attr('src', 'IS/hitbox.png');
            $.getJSON("http://api.hitbox.tv/media/live/"+label+".json", function(data){
                    $('#w-'+sitenameID+' img').css({
                        'border-top': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-right': 'solid 2px '+shadeColor1(stringHexNumber(label), 0),
                        'border-bottom': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-left': 'solid 2px '+shadeColor1(stringHexNumber(label), -30),
                        'border-radius': '4px'
                        });
                        $('#w-'+sitenameID+' img').attr('height', '46px');
                        $('#w-'+sitenameID+' img').attr('width', '46px');
                        $('#w-'+sitenameID+' img').attr('src', 'http://edge.vie.hitbox.tv'+data['livestream'][0]['channel']['user_logo_small']);
                        $('#w-'+sitenameID+' span').html(data['livestream'][0]['media_user_name'] + ' (' + views +')');
            });
        }
    }
    
    if (sitename === "ttv") {
	    $.ajax({
	            type: "GET",
	            url: "https://api.twitch.tv/kraken/streams?channel=" + label.toLowerCase(),
	            headers: {
	                "Client-ID": "1p9iy0mek7mur7n1jja9lejw3"
	            },
	            success: function(data) {
	            	if (!data.streams.length) { 
	                	$('#w-'+sitenameID).css('filter', 'grayscale(1)');
	                	//$('#w-'+sitenameID).appendTo($('#watercont'));
	            	}
	            }   
	  });
    }
    if (sitename === "ust") {
	$.getJSON("https://api.ustream.tv/channels/"+ label.toLowerCase() +".json", function(data){
		if (data.channel.status === "offair") {
	        	$('#w-'+sitenameID).css('filter', 'grayscale(1)');
	        	//$('#w-'+sitenameID).appendTo($('#watercont'));
	    	}
	});
    }
}

function getwater(loop) {
    if(loop) {clearTimeout(update);}
    $.ajax({
        url: "resources/data/channels.data.php",
        type: "GET",
        dataType: "json",
        success: function(data) {
            $('#watercont').html('');

            for(var i = 0; i < data.length; i++) {
            
                var chans = Object.keys(data[i]);
                var chan = chans[0];
                
                var sites = Object.keys(data[i][chan]);
                console.log(sites);
            
                    for (var j = 0; j < sites.length; j++) {
                    
                    var site = sites[j];
                    var views = data[i][chan][site];
                    make_button(chan, site, views);     
                }

            }

            if(loop) {update = setTimeout(getwater,120000, 1);}
            $('a#watericons').text('Popular');
        },
        error: function(x, t, m) {
            if(t==="timeout") {
                $('a#liveicons').text('ugh | Timed out: Click to refresh');
            } else {
                $('a#liveicons').text('oh no | Error: Click to refresh');
            }
        }
    });
}
/* ============ Views test ================== */

//geton();

function slideonlyone(thechosenone) {
     $('.boxdiv').each(function(index) {
          if ($(this).attr("id") == thechosenone) {
               $(this).slideDown(400);
          }
          else {
               $(this).slideUp(400);
          }
     });
}
        $(document).ready(pageLoaded);
	$(function()
		{
			// Call stylesheet init so that all stylesheet changing functions 
			// will work.
			$.stylesheetInit();
			
			// This code loops through the stylesheets when you click the link with 
			// an ID of "toggler" below.
			$('#toggler').bind(
				'click',
				function(e)
				{
					$.stylesheetToggle();
					chatangostyle();					
					return false;
				}
			);
			
			// When one of the styleswitch links is clicked then switch the stylesheet to
			// the one matching the value of that links rel attribute.
			$('.styleswitch').bind(
				'click',
				function(e)
				{
					$.stylesheetSwitch(this.getAttribute('rel'));
					return false;
				}
			);
		}
	);
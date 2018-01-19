var lrCompanionDisplayed = new Array();
var lrCompanionPurge = new Array();
var lrCompanionPurgeNextBreak = new Array();
var lrCompanionPurgeDelay = new Array();
var lrCompanionPurgeCallback = new Array();
var lrCompanionDisplayCallback = new Array();
var lrCompanionTrackers = new Array();

///////////////////////////////////////////////////////////////////////////////////////////

function lrDisplayCompanion(size, type, content, clickthru, trackers)
{
	if(!document.getElementById) return false;
	
	var stracking = "";
	for(i=0; i<trackers.length; i++)
	{
		var tracker = trackers[i];
		if(tracker!="")
		{
			stracking += "<img src='"+tracker+"' width='1' height='1' style='display: none; visibility: hidden;' />";
		}
	}
	//
	if(size=="LB") size = "728x90";
	if(size=="MR") size = "300x250";
	if(size=="SB") size = "300x60";
	if(size=="WS") size = "160x600";
	//
	
	lrCompanionTrackers[size] = trackers;
	
	var splits = size.split("x");
	var width = splits[0];
	var height = splits[1];
	
	if(!width || !height) return false;

	if(typeof lrCustomCompanionDisplayCallback == 'function' ) { lrCustomCompanionDisplayCallback(size); }
	
	div_companion = document.getElementById("lr_comp_"+size);
	div_default = document.getElementById("lr_comp_default_"+size);
	
	if(!div_companion) return false;
	
	if(lrCompanionDisplayCallback[size]!="") eval(lrCompanionDisplayCallback[size]);
	
	div_companion.innerHTML = stracking; 
	switch(type)
	{
		case "iframe": 
			div_companion.innerHTML += '<iframe src="' + content + '" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width: ' + width + 'px; height: ' + height + 'px; border: 0px; margin: 0px;"></iframe>';
			break;
		case "image":
			div_companion.innerHTML += (clickthru ? '<a href="' + clickthru + '" target="_blank">' : '') + '<img src="' + content + '" border="0" style="width: ' + width + 'px; height: ' + height + 'px; border: 0px; margin: 0px;" />' + (clickthru ? '</a>' : '');
			break;
		case "flash":
		    var delimiter = content.indexOf("?")==-1 ? "?" : "&";
		    var clickTag = (clickthru && content.indexOf("cdn.liverail.com")!=-1) ? delimiter + "clickTAG=" + encodeURIComponent(clickthru) : delimiter;
			div_companion.innerHTML += '<object width="' + width + '" height="' + height + '"><param name="movie" value="' + content + clickTag + '"><param name="wmode" value="transparent"><param name="allowScriptAccess" value="always"><embed src="' + content + clickTag + '" type="application/x-shockwave-flash" allowScriptAccess="always" wmode="transparent" width="' + width + '" height="' + height + '"></embed></object>';
			break;
		case "js":
			div_companion.innerHTML += '<iframe src="http://ad4.liverail.com/util/companions.php?js=' + encodeURIComponent(content) + '" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width: ' + width + 'px; height: ' + height + 'px; border: 0px; margin: 0px;"></iframe>';
			break;
		default:
			div_companion.innerHTML += content;
	}
		
	if(div_default) div_default.style.display = "none";
	div_companion.style.display = "block";
	
	lrCompanionDisplayed[size] = true;
	
	return true;
}

///////////////////////////////////////////////////////////////////////////////////////////

function lrClearCompanion(size, force)
{
	//
	if(size=="LB") size = "728x90";
	if(size=="MR") size = "300x250";
	if(size=="SB") size = "300x60";
	if(size=="WS") size = "160x600";
	//
	if(!lrCompanionPurge[size] && !force) return false;
	
	div_companion = document.getElementById("lr_comp_"+size);
	div_default = document.getElementById("lr_comp_default_"+size);
	
	if(!div_companion) return false;
	
	if(lrCompanionPurgeCallback[size]!="") eval(lrCompanionPurgeCallback[size]);
	
	if(lrCompanionPurgeDelay[size]>0)
	{
		setTimeout("div_companion.style.display = \"none\"; if(div_default) div_default.style.display = \"block\"; lrCompanionDisplayed[size] = false;", lrCompanionPurgeDelay[size]*1000);
	}
	else
	{
		div_companion.style.display = "none";
		if(div_default) div_default.style.display = "block";
		
		lrCompanionDisplayed[size] = false;
	}

	return true;
}

function lrAdSlotStart(type)
{
	if(type=="ov") return false;
	for(size in lrCompanionPurgeNextBreak) 
	{
		if(lrCompanionPurgeNextBreak[size] && lrCompanionDisplayed[size]) lrClearCompanion(size, true);
	}
	return true;
}

///////////////////////////////////////////////////////////////////////////////////////////

/***  SCAN  (fails on clear)  ***/
if(!self.ScanScout) ScanScout = {};
if(!ScanScout.AdUtils) ScanScout.AdUtils = {};
ScanScout.AdUtils.showCompanionBannerHTML = function(adId, html, errorUrl, parentId)
{
	lrDisplayCompanion("300x250", "plain", html, "", "");
	lrCompanionDisplayed["300x250"] = true;
}

var hasSize = new Array();
function lrTMACDisplayCompanion(banners) 
{
	for(i in banners)
	{
		hasSize[banners[i]["size"]] = new Array(banners[i]["width"], banners[i]["height"]);
	}
	for(j in hasSize)
	{
        	lrDisplayCompanion(j, "plain", "", "", "");
	        tmDisplayBanner(banners, "lr_comp_"+j, hasSize[j][0], hasSize[j][1]);
        	lrCompanionDisplayed[j] = true;
	}
}
function lrTMACClearCompanion() 
{
        for(j in hasSize)
	{
        	lrClearCompanion(j);
	}
}

/***  YUME  (fails on clear)  ***/
/*
function yume_flash_callback(command, arg1, arg2, arg3)
{
	if(typeof lrDisplayCompanion=="undefined") return;
	if(command=="companionbanner/iframe" || command=="companionbanner/image") 
	{
		if (arg3=="cb1" || arg3=="cb_medrect1") lrDisplayCompanion("300x250", command=="companionbanner/iframe" ? "iframe" : "image", arg1, "", "");
		else if (arg3=="cb_leaderboard1") lrDisplayCompanion("728x90", command=="companionbanner/iframe" ? "iframe" : "image", arg1, "", "");
	}
}
*/

function lrYumeInit(playerObjectId){
   if(typeof yume_flash_callback == "undefined") {
                // Yume Params //   
                yume_cb_medrect_id = "lr_comp_300x250";
                if((typeof player_id==="undefined") && (typeof playerObjectId!=="undefined")) player_id = playerObjectId;
                if((typeof yume_player_div_id==="undefined")&& (typeof player_id!=="undefined")){
                                var _lrPubPlayerSWF = document.getElementById(player_id);
                                if(_lrPubPlayerSWF && (typeof _lrPubPlayerSWF.parentNode != "undefined") && (typeof _lrPubPlayerSWF.parentNode.id != "undefined")){
                                                yume_player_div_id = _lrPubPlayerSWF.parentNode.id;                                                                                              
                                }
                }   
                if(typeof yume_div_opacity==="undefined") yume_div_opacity = 70;
                if(typeof yume_dimout_div_zIndex ==="undefined") yume_dimout_div_zIndex = 9999;

                // Inject Yume companions js code //                
                var headID = document.getElementsByTagName("head")[0]; 
                var newScript = document.createElement("script");
                newScript.type = "text/javascript";
                newScript.src = "http://cdn-static.liverail.com/swf/v4/thirdparty/yume/2_4_1_3/yume_static_cb.js";
                headID.appendChild(newScript);

                var dimScript = document.createElement("script");
                dimScript.type = "text/javascript";
                dimScript.src = "http://cdn-static.liverail.com/swf/v4/thirdparty/yume/2_4_1_3/dimout-min.js";
                headID.appendChild(dimScript);
   }
   return true;
}

function lrYumeDisplayCompanion(banner_div_id, banner_frame_id){
   var lrDivCompanion = document.getElementById(banner_div_id);
   if(lrDivCompanion){
                if(banner_div_id=="lr_comp_300x250") lrDisplayCompanion("300x250", "plain", '<div id="'+banner_frame_id+'" style="width:300px; height:250px; margin:0; padding:0; overflow: hidden;">', "", "");
                if(banner_div_id=="lr_comp_728x90") lrDisplayCompanion("728x90", "plain", '<div id="'+banner_frame_id+'" style="width:728px; height:90px; margin:0; padding:0; overflow: hidden;">', "", "");
   }
}

function lrYumeDisplayCompanion_2_4_6_3(size) {
    div_default = document.getElementById("lr_comp_default_"+size);
    if(div_default) div_default.style.display = "none";
    div_companion = document.getElementById("lr_comp_"+size);
    if(div_companion) div_companion.style.display = "block";           
    if(lrCompanionDisplayed) lrCompanionDisplayed[size] = true;
}

function lrYumeInit_2_4_6_3(playerObjectId){
    //alert(playerObjectId + ' ' + typeof(YumePlayerObject));
    if(typeof(YumePlayerObject)=="undefined") {
                                    yumeFlashObjID = playerObjectId;
                                    var yumeScriptURLs = [ 
                                                                    "http://cdn-static.liverail.com/swf/v4/thirdparty/yume/2_4_6_3/dimout-min.js",
                                                                    "http://cdn-static.liverail.com/swf/v4/thirdparty/yume/2_4_6_3/yumesdk.js",
                                                                    "http://cdn-static.liverail.com/swf/v4/thirdparty/yume/2_4_6_3/yumecb.js" ];
                                    // Inject Yume companions js code //                
                                    var headID = document.getElementsByTagName("head")[0]; 
                                    for(var i=0;i<yumeScriptURLs.length;i++){
                                                    var scriptTag = document.createElement("script");
                                                    scriptTag.type = "text/javascript";
                                                    scriptTag.src = yumeScriptURLs[i];
                                                    headID.appendChild(scriptTag);
                                    }
    }              
    return true;
}

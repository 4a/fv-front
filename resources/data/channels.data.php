<?php
require_once('connect.php');

$status = $_GET['live'];
$test = $_GET['test'];

mysql_query("SET CHARACTER SET utf8");
$return_arr = array();
$fetch = mysql_query("SELECT `name`, `alt`, `icon`, `chan`, `site`, `live`, `visible`, `category` FROM `newchannels` WHERE NOT `visible`=0 ORDER BY `priority`, `num`");
while ($row = mysql_fetch_array($fetch,MYSQL_ASSOC)) {
	$row_array['name'] = $row['name'];
	$row_array['alt'] = $row['alt'];
	$row_array['icon'] = $row['icon'];
	$row_array['chan'] = $row['chan'];
	$row_array['category'] = $row['category'];
	$row_array['site'] = $row['site'];
	$row_array['live'] = $row['live'];
	$row_array['visible'] = $row['visible'];
	array_push($return_arr,$row_array);
}

$test=false;
foreach($return_arr as $p) {
if ($test) {
$fb = ";fbUpdate('" .$p["site"]. "', '" .$p["chan"]. "')";
//$fb = ";console.log(". $_SERVER['REQUEST_URI'] .")";
}
else {
$fb = "";
}
	if (isset($status)) {
		if ($p["live"] == $status && !($p["live"] == "0" && $p["visible"] == "2")) { 
		
			if($p["icon"] === "SH.png") {
			
			echo '<li id="'.$p["site"].'-'.$p["chan"].'"><a onclick="'.(($p["site"] == "ust2")?"ust":$p["site"]).'(\''.$p["chan"].'\');return false" href="http://twitch.tv/fkospaceexploration" target="_blank"><img src="SI/IC/'.$p["icon"].'" width="50" height="50" alt="'.$p["alt"].'"><span>'.$p["name"].'</span></a></li>';
/*style="width:100px;margin-left:-24px;text-align:center;color:#fee32a;background:#3D0A50;border-color:#fee32a;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;"*/			
			}
else if ($p["category"] === "FV"){	
			echo '<li id="'.$p["site"].'-'.$p["chan"].'"><a onclick="'.($p["site"]).'(\''.$p["chan"].'\''. (($p["site"] == "any")?", '".$p["alt"]."'":"") .')'. $fb .';return false" href="'.(($p["site"] == "jtv")?"http://justin.tv/":"").(($p["site"] == "ttv")?"http://twitch.tv/":"").(($p["site"] == "ust")?"http://ustream.tv/channel/":"").(($p["site"] == "lst")?"http://livestream.com/":"").(($p["site"] == "htv")?"http://hitbox.tv/":"").(($p["site"] == "yut")?"http://youtube.com/watch?v=":"").(($p["site"] == "nnd")?"http://live.nicovideo.jp/watch/":"").$p["chan"].'" target="_blank"><img src="SI/IC/'.$p["icon"].'" width="50" height="50" alt="'.$p["alt"].'"><span>'.$p["name"].'</span></a></li>';
			}
 else {	
/*
onmouseover=\''.(($p["site"] == "ttv")?"$.getJSON(\"http://api.justin.tv/api/stream/list.json?channel=".$p['chan']."&amp;jsonp=?\", function(data){if (data[0][\"title\"] != null){window.".$p['chan'].".info = \" | \" + data[0][\"title\"];} else {window.".$p['chan'].".info = \"\";}window.".$p['chan'].".viewers = data[0][\"channel_count\"];window.".$p['chan'].".game = data[0][\"meta_game\"];});$(this).attr(\"title\", window.".$p['chan'].".viewers + \" viewers\" + window.".$p['chan'].".info)":"").'\' 
*/					
			echo '<li id="'.$p["site"].'-'.$p["chan"].'"><a onclick="'.($p["site"]).'(\''.$p["chan"].'\''. (($p["site"] == "any")?", '".$p["alt"]."'":"") .')'. $fb .';return false" href="'.(($p["site"] == "jtv")?"http://justin.tv/":"").(($p["site"] == "ttv")?"http://twitch.tv/":"").(($p["site"] == "ust")?"http://ustream.tv/channel/":"").(($p["site"] == "lst")?"http://livestream.com/":"").(($p["site"] == "htv")?"http://hitbox.tv/":"").(($p["site"] == "yut")?"http://youtube.com/watch?v=":"").(($p["site"] == "nnd")?"http://live.nicovideo.jp/watch/":"").$p["chan"].'" target="_blank"><img src="SI/IC/'.$p["icon"].'" width="50" height="50" alt="'.$p["alt"].'"><span>'.$p["name"].'</span></a></li>';
			}
			
		}
	} else if($p["site"] !== "any" && $p["visible"] !== "2"){
		echo '<li id="'.$p["site"].'-'.$p["chan"].'"><a onclick="'.$p["site"].'(\''.$p["chan"].'\');return false" href="http://'.(($p["site"] == "jtv")?"justin.tv/":"").(($p["site"] == "ttv")?"twitch.tv/":"").(($p["site"] == "ust")?"ustream.tv/channel/":"").(($p["site"] == "lst")?"livestream.com/":"").(($p["site"] == "htv")?"hitbox.tv/":"").(($p["site"] == "yut")?"youtube.com/watch?v=":"").$p["chan"].'" target="_blank"><img src="SI/IC/'.$p["icon"].'" width="50" height="50" alt="'.$p["alt"].'"><span>'.$p["name"].'</span></a></li>';         
	}
}
unset($return_arr);
if ($status == 1) {
	include("channels.update.php");
}
?>
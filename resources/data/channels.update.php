<?php
require_once('connect.php');
if($stmt = $mysqli->prepare("SELECT `chan`, `site` FROM `newchannels` WHERE NOT (`site`='yut' OR `live`=2 OR `visible`=0) ORDER BY `priority`, `num`")) {
  $stmt->execute();
  $stmt->bind_result($chan, $site);
  $fvchans = Array();
  while($stmt->fetch()) {
    $fvchans[$site][] = $chan;
  }
  $stmt->close();
}

if($stmt = $mysqli->prepare("SELECT `alt` FROM `newchannels` WHERE `site`='yut' AND NOT (`alt`='' OR `live`=2 OR `visible`=0) ORDER BY `priority`, `num`")) {
  $stmt->execute();
  $stmt->bind_result($chan);
  $fvchansyut = Array();
  while($stmt->fetch()) {
    $fvchansyut[] = $chan;
  }
  $stmt->close();
}

function curl_get_contents($url, $clientId) {
  $ch = curl_init();
if ($clientId){  
curl_setopt_array($ch, array(
    CURLOPT_HTTPHEADER => array(
       'Client-ID: ' . $clientId
    ),     
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_URL => $url
 ));  
} else {
curl_setopt_array($ch, array(
    CURLOPT_COOKIEFILE => "cookie.txt",
    CURLOPT_HEADER => 0, 
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_URL => $url
 ));  
}   
  $output = curl_exec($ch);
  curl_close($ch);
  return $output;
}

function nicoLogin() {
$cookie=dirname(__FILE__) . "/cookie.txt"; 
$url="https://secure.nicovideo.jp/secure/login?site=nicolive"; 
$postdata = "next_url="."&mail=".$nnd_user."&password=".$nnd_pass; 

preg_match_all("/(?:\b\d{10}\b)/", file_get_contents($cookie), $matches);
$cookieExp = $matches[0][4];

if ($cookieExp < strtotime('now')) {
  $ch = curl_init(); 
  curl_setopt ($ch, CURLOPT_URL, $url); 
  curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
  curl_setopt ($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"); 
  curl_setopt ($ch, CURLOPT_TIMEOUT, 60); 
  curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, 0); 
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
  curl_setopt ($ch, CURLOPT_COOKIEJAR, $cookie); 
  curl_setopt ($ch, CURLOPT_REFERER, $url); 

  curl_setopt ($ch, CURLOPT_POSTFIELDS, $postdata); 
  curl_setopt ($ch, CURLOPT_POST, 1); 
  curl_exec ($ch);
  $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
  print curl_error($ch); 
  curl_close($ch);
  }
}

function checkTTV($ttvchan) {
  $liveNames = array();
  $channelNames = implode(",",$ttvchan);
  $json_file = curl_get_contents("https://api.twitch.tv/kraken/streams?channel=". $channelNames, "1p9iy0mek7mur7n1jja9lejw3");               
  $json_array = json_decode($json_file,true);
  if ( array_key_exists('streams', $json_array) ){
    for ($i=0;$i < count($json_array['streams']);$i++){
      array_push($liveNames, $json_array['streams'][$i]['channel']['name']);
    }
    if( !empty($liveNames) ){
      $liveNames = "'". implode("','", $liveNames) ."'";
      mysql_query("UPDATE `newchannels` SET `live`=1 WHERE `chan` IN (". $liveNames .") AND `site`='ttv' AND NOT (`live`=2 OR `visible`=0)");                      
      mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `chan` NOT IN (". $liveNames .") AND `site`='ttv' AND NOT (`live`=2 OR `visible`=0)");
    }/* else {
      mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `site`='ttv' AND NOT (`live`=2 OR `visible`=0)");
    }*/
  }  
}

function checkLST($lstchan) {
  $liveNames = array();	
  foreach($lstchan as $channelName) {
    $json_file = curl_get_contents("http://x". $channelName ."x.api.channel.livestream.com/2.0/livestatus.json");
    $json_array = json_decode($json_file,true);
// FIX THIS
    $res = $json_array['channel'];
    $i = 0;
    foreach($res as $key => $value) {
      if ($i == 0) {
        $isLive = $value;
      }
      if ($i == 1) {
        $currentViewerCount = $value;
      }
      $i++;
    }
    if ($isLive==1) {
      array_push($liveNames, $channelName);
    }
  }
// FIX THIS
  if( !empty($liveNames) ){
    $liveNames = "'". implode("','", $liveNames) ."'";
    mysql_query("UPDATE `newchannels` SET `live`=1 WHERE `chan` IN (". $liveNames .") AND `site`='lst' AND NOT (`live`=2 OR `visible`=0)");                      
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `chan` NOT IN (". $liveNames .") AND `site`='lst' AND NOT (`live`=2 OR `visible`=0)");
  } else {
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `site`='lst' AND NOT (`live`=2 OR `visible`=0)");
  }
}


function checkUST($ustchan) {
  $liveNames = array();	
  foreach($ustchan as $channelName) {
    $json_file = curl_get_contents("https://api.ustream.tv/channels/". $channelName .".json");
    $json_array = json_decode($json_file,true);
    $status = $json_array['channel']['status'];
    if ($status === "live") {
      array_push($liveNames, $channelName);
    }
  }
  
  if( !empty($liveNames) ){
    $liveNames = "'". implode("','", $liveNames) ."'";
    mysql_query("UPDATE `newchannels` SET `live`=1 WHERE `chan` IN (". $liveNames .") AND `site`='ust' AND NOT (`live`=2 OR `visible`=0)");
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `chan` NOT IN (". $liveNames .") AND `site`='ust' AND NOT (`live`=2 OR `visible`=0)");
  } else {
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `site`='ust' AND NOT (`live`=2 OR `visible`=0)");
  }
}
/*

function checkUST($ustchan) {	
  $liveNames = array();
  foreach(array_chunk($ustchan,10) as $ten) { 
    $channelNames = implode(";",$ten);
    $json_file = curl_get_contents("https://api.ustream.tv/json/channel/". $channelNames ."/getValueOf/status?key=BAAF126489DB59ABDAEE3003AD676202");
    $json_array = json_decode($json_file,true);
// FIX
    $index = -1;
    foreach($ten as $p) {
      if (count($ten) > 1) {
        $index++;
        $res = $json_array['results'][$index];
        $channelName = $p;
        $i = 0;
        foreach($res as $key => $value) {
          if ($i == 0) {$uid = $value;}
          if ($i == 1) {$result = $value;}
          $i++;
        }
      } else {
        $result = $json_array['results'];
        $channelName = $p;
      }       
      if ($result=="live") {
        array_push($liveNames, $channelName);
      }
    }
  }
// FIX
  if( !empty($liveNames) ){
    $liveNames = "'". implode("','", $liveNames) ."'";
    mysql_query("UPDATE `newchannels` SET `live`=1 WHERE `chan` IN (". $liveNames .") AND `site`='ust' AND NOT (`live`=2 OR `visible`=0)");
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `chan` NOT IN (". $liveNames .") AND `site`='ust' AND NOT (`live`=2 OR `visible`=0)");
  } else {
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `site`='ust' AND NOT (`live`=2 OR `visible`=0)");
  }
}
*/

function checkNND($nndchan) {
nicoLogin();
  $liveNames = array();
  foreach($nndchan as $channelName) {
    $xml_file = curl_get_contents("http://live.nicovideo.jp/api/getplayerstatus/".$channelName);
    $xml_array = new SimpleXMLElement($xml_file);
// FIX
    $status = $xml_array['status'];
    if ( !($status=="fail") ) {
      array_push($liveNames, $channelName);
    } 
  }
// FIX
  if( !empty($liveNames) ){
    $liveNames = "'". implode("','", $liveNames) ."'";
    mysql_query("UPDATE `newchannels` SET `live`=1 WHERE `chan` IN (". $liveNames .") AND `site`='nnd' AND NOT (`live`=2 OR `visible`=0)");
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `chan` NOT IN (". $liveNames .") AND `site`='nnd' AND NOT (`live`=2 OR `visible`=0)");
  } else {
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `site`='nnd' AND NOT (`live`=2 OR `visible`=0)");
  }
}

function checkHTV($htvchan) {
  $liveNames = array();
  $channelNames = implode(",",$htvchan);
  $json_file = curl_get_contents("http://api.hitbox.tv/media/live/".$channelNames);
  $json_array = json_decode($json_file,true);
  for ($i=0; $i < count($json_array['livestream']); $i++){
    if ($json_array['livestream'][$i]['media_is_live'] === "1") {
      array_push($liveNames, $json_array['livestream'][$i]['media_name']);
    }  
  }
  if( !empty($liveNames) ){
    $liveNames = "'". implode("','", $liveNames) ."'";
    mysql_query("UPDATE `newchannels` SET `live`=1 WHERE `chan` IN (". $liveNames .") AND `site`='htv' AND NOT (`live`=2 OR `visible`=0)");
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `chan` NOT IN (". $liveNames .") AND `site`='htv' AND NOT (`live`=2 OR `visible`=0)");
  } else {
    mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `site`='htv' AND NOT (`live`=2 OR `visible`=0)");
  }
}

function checkYUT($yutchan) {
  $liveChannels = array();	
  foreach($yutchan as $channelId) {
    $videoId = 0;
    $liveIds = array();
    $json_file = curl_get_contents("https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&channelId=".$channelId."&key=AIzaSyAsyyUaURBBFYdOHc6mnMAGAcZxloYVG8A");
    $json_array = json_decode($json_file,true);
    foreach($json_array['items'] as $item) {
      $videoId = $item['id']['videoId'];
      //array_push($liveIds, $videoId);
      //$liveChannels[$channelId] = $liveIds;
    }
    if( !empty($videoId) ){ 
      mysql_query("UPDATE `newchannels` SET `live`=1, `chan`='".$videoId."' WHERE `alt`='".$channelId."'");
    } else {
      mysql_query("UPDATE `newchannels` SET `live`=0 WHERE `alt`='".$channelId."'");
    }
  }
}

$fetch = mysql_query("SELECT `updated` FROM `newchannels` WHERE `num`=1");
while ($row = mysql_fetch_array($fetch,MYSQL_ASSOC)) {
	$cached_time = $row['updated'];
}
$cached_time = strtotime($cached_time);
$current_time = strtotime('now');
if (($current_time - $cached_time) > 180 && !empty($fvchans)) {
	mysql_query("UPDATE `newchannels` SET `updated`=now() WHERE `num`=1");
	checkTTV($fvchans['ttv']);
	checkUST($fvchans['ust']);
	checkHTV($fvchans['htv']);
	checkYUT($fvchansyut);
	checkNND($fvchans['nnd']);
	//checkLST($fvchans['lst']);
	//echo "Current Time: ". $current_time .".<br>";
	//echo "DB Updated: ". $cached_time .".<br>";
	//echo $current_time - $cached_time ." seconds since last update.<br>";
//} else {
	//echo "Current Time: ". $current_time .".<br>";
	//echo "DB Updated: ". $cached_time .".<br>";     
	//echo $current_time - $cached_time ." seconds since last update.<br>";
}
?>
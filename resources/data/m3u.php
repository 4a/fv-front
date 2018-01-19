<?php
    if (isset($_GET['channel']) && preg_match("/^[a-zA-Z0-9_]{4,25}$/u", $_GET['channel'])) {
        $url = sprintf('https://api.twitch.tv/api/channels/%s/access_token/', $_GET['channel']);
        $page = file_get_contents($url);
        $json = json_decode($page, true);
        $token = $json['token'];
        $sig = $json['sig'];
        $url = 'http://usher.twitch.tv/api/channel/hls/' . $_GET['channel'] . '.m3u8?player=twitchweb&token=' . rawurlencode($token) . '&sig=' . $sig;
        /*echo '<a href="' . $url . '">open</a>';*/
        header('location:' .$url);
    }
?>
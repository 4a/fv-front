<?php
require('connect.php');

function fetchChannels($conn) {
    $sql = "SELECT _id, channel, src, label, online, popularity, icon, iconExternal, lastUpdate, priority FROM channels";
    $sql .= " WHERE src != 'dead'";
    $sql .= " ORDER BY priority, _id";
    $result = $conn->query($sql);
    $output = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $_id = "FV_" . $row['_id'];
            $row['_id'] = (int) $row['_id'];
            $row['online'] = !!$row['online'];
            $row['popularity'] = (int)$row['popularity'];
            $row['priority'] = (int)$row['priority'];
            $row['icon'] = 'http://fightanvidya.com/SI/IC/' . $row['icon'];
            $output[$_id] = $row;
        }
    } else {
        $output = "No Data";
    }
    
    return $output;
}

function fetchPopular($conn) {
    $sql = "SELECT user, COUNT(*), site, chan, MIN(created), MIN(start_time) FROM `water`";
    $sql .= " GROUP BY site, chan";
    $sql .= " ORDER BY COUNT(*) ASC, created ASC";

    $result = $conn->query($sql);
    $output = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $site = $row['site'];
            $channel = $row['chan'];
            $popularity = (int)$row['COUNT(*)'];
            $startTime = $row['MIN(start_time)'];
            $createdTime = $row['MIN(created)'];
            $timeStamp = $startTime ?: $createdTime;
            $output[$site][$channel] = [
                'popularity' => $popularity,
                'timeStamp' => $timeStamp,
                'createdTime' => $createdTime
            ];
        }
    } else {
        $output = [];
    }
    
    return $output;
}

function addChannels($conn, $src, $channels) {
    $values = [];
    foreach ($channels as $channel) {
        $value = "(";
        $value .= "'" . $src . "'";
        $value .= ", '" . $channel['channel'] . "'";
        $value .= ", '" . $channel['label'] . "'";
        $value .= ", '" . $channel['expires'] . "'";
        $value .= ", '" . $channel['iconExternal'] . "'";
        $value .= ", '" . $channel['popularity'] . "'";
        $value .= ", '" . $channel['sessionStart'] . "'";
        $value .= ", '" . $channel['dateCreated'] . "'";
        $value .= ")";
        $values[] = $value;
    }
    $sql = "INSERT INTO channels";
    $sql .= " (src, channel, label, expires, iconExternal, popularity, sessionStart, dateCreated)";
    $sql .= " VALUES " . implode(",", $values);

    echo $sql;

    if ($conn->query($sql) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error updating record: " . $conn->error;
    }
}

// TODO: Sanitize data
function updateLiveStatus($conn, $isOnline, $channels, $src) {
    $channels = implode($channels, "','");
    $isOnline = $isOnline ? 'TRUE' : 'FALSE';
    $sql = "UPDATE channels";
    $sql .= " SET online = $isOnline";
    $sql .= " WHERE channel IN ('$channels') AND src = '$src'";

    if ($conn->query($sql) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error updating record: " . $conn->error;
    }
}

function updateMiscAttributes($conn, $atts, $src) {
    $channel = $atts['channel'];
    $iconExternal = $atts['iconExternal'];

    $sql = "UPDATE channels";
    $sql .= " SET iconExternal = '$iconExternal'";
    $sql .= " WHERE channel = '$channel' AND src = '$src'";

    if ($conn->query($sql) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error updating record: " . $conn->error;
    }
}

function curl_get_contents($url, $clientId = null, $cookie = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    if ($clientId) curl_setopt($ch, CURLOPT_HTTPHEADER, ['Client-ID: ' . $clientId]);
    if ($cookie) curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
    if ($cookie) curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

function updateTwitchChannels($conn, $data) {
    $twitchChannels = [];
    $liveChannels = [];
    $otherUpdates = [];
    $popularChannels = fetchChannels($conn);

    foreach ($data as $channel) {
        if ($channel['src'] == "twitch") $twitchChannels[] = $channel['channel'];
    }
    $response = curl_get_contents("https://api.twitch.tv/kraken/streams?channel=". implode($twitchChannels, ','), "1p9iy0mek7mur7n1jja9lejw3");
    $newData = json_decode($response);
    foreach ($newData->streams as $online) {
        $name = $online->channel->name;
        // $label = $online->channel->display_name;
        $iconExternal = $online->channel->logo;

        $liveChannels[] = $name;
        $otherUpdates[$name] = [
            'channel' => $name,
            'iconExternal' => $iconExternal
            // 'popularity' => $popularity
        ];
    }
    
    $offline = array_diff($twitchChannels, $liveChannels);
    updateLiveStatus($conn, true, $liveChannels, 'twitch');
    foreach ($otherUpdates as $channel) {
        updateMiscAttributes($conn, $channel, 'twitch');
    }
    updateLiveStatus($conn, false, $offline, 'twitch');
    return $newData;
}

function addTemporaryTwitchChannels($conn, $data) {
    $twitchChannels = [];
    $popularChannels = [];
    $tempChannels = [];
    
    $popularData = fetchPopular($conn);
    foreach ($popularData as $site => $channel) {
        if ($site === 'twitch' || $site == "ttv") {
            foreach ($channel as $name => $arr) {
                $popularChannels[] = $name;
            }
        }
    }

    foreach ($data as $channel) {
        if ($channel['src'] == "twitch") $twitchChannels[] = $channel['channel'];
    }

    $unique = array_diff($popularChannels, $twitchChannels);
    $response = curl_get_contents("https://api.twitch.tv/kraken/streams?channel=". implode($unique, ','), "1p9iy0mek7mur7n1jja9lejw3");
    $newData = json_decode($response);
    foreach ($newData->streams as $online) {
        $name = $online->channel->name;
        $label = $online->channel->display_name;
        $expires = 1;
        $iconExternal = $online->channel->logo;
        $popularity = $popularData['ttv'][$name]['popularity'];
        $sessionStart = $popularData['ttv'][$name]['timeStamp'];
        $dateCreated = $popularData['ttv'][$name]['createdTime'];
        $tempChannels[] = [
            'channel' => $name,
            'label' => $label,
            'expires' => $expires,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity,
            'sessionStart' => $sessionStart,
            'dateCreated' => $dateCreated
        ];
    }
    if (count($tempChannels)) addChannels($conn, "twitch", $tempChannels);
    return $tempChannels;
}
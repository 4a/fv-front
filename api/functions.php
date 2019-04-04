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

function addChannels($conn, $channels) {
    $values = [];
    foreach ($channels as $channel) {
        $value = "(";
        $value .= "'" . $channel['src'] . "'";
        $value .= ", '" . $channel['channel'] . "'";
        $value .= ", '" . $channel['label'] . "'";
        $value .= ", '" . $channel['isOnline'] . "'";
        $value .= ", '" . $channel['expires'] . "'";
        $value .= ", '" . $channel['iconExternal'] . "'";
        $value .= ", '" . $channel['popularity'] . "'";
        $value .= ", '" . $channel['sessionStart'] . "'";
        $value .= ", '" . $channel['dateCreated'] . "'";
        $value .= ")";
        $values[] = $value;
    }
    $sql = "INSERT INTO channels";
    $sql .= " (src, channel, label, online, expires, iconExternal, popularity, sessionStart, dateCreated)";
    $sql .= " VALUES " . implode(",", $values);

    // echo $sql;

    if ($conn->query($sql) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error updating record: " . $conn->error;
    }
}

function updateChannelPopularity($conn, $src, $channels) {
    $values = [];
    foreach ($channels as $channel) {
        $channel =  $channel['channel'];
        $popularity = $channel['popularity'];
        $sessionStart = $channel['sessionStart'];
    }
    $sql = "UPDATE channels SET";
    $sql .= " popularity = $popularity, sessionStart = '$sessionStart'";
    $sql .= " WHERE channel = '$channel' AND src = '$src'";

    // echo $sql;

    if ($conn->query($sql) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error updating record: " . $conn->error;
    }
}

function resetUnpopularChannels($conn, $src, $ignore) {
    $values = [];
    $ignore = implode($ignore, "', '" );

    /* Delete unpopular expirable channels */
    $sql = "DELETE FROM channels";
    $sql .= " WHERE expires = 1";
    $sql .= " AND src = '$src'";
    $sql .= " AND channel NOT IN ('$ignore')";

    if ($conn->query($sql) !== TRUE) {
        return "Error updating record: " . $conn->error;
    }

    /* Reset unpopular permanent channels */
    $sql = "UPDATE channels SET popularity = 0";
    $sql .= " WHERE expires = 0";
    $sql .= " AND src = '$src'";
    $sql .= " AND channel NOT IN ('$ignore')";

    if ($conn->query($sql) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error updating record: " . $conn->error;
    }
}

// TODO: Sanitize data
function updateLiveStatus($conn, $isOnline, $channels, $src) {
    $channels = implode($channels, "','");
    $isOnline = $isOnline ? 1 : 0;
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
    $isOnline = $atts['isOnline'] ? 1 : 0;
    $popularity = $atts['popularity'];

    $sql = "UPDATE channels";
    $sql .= " SET popularity = $popularity";
    $sql .= ", online = $isOnline";
    $sql .= $iconExternal ? ", iconExternal = '$iconExternal'" : "";
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
    $popularChannels = [];
    $liveChannels = [];
    $otherUpdates = [];
    
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
    $response = curl_get_contents("https://api.twitch.tv/kraken/streams?channel=". implode($twitchChannels, ','), "1p9iy0mek7mur7n1jja9lejw3");
    $newData = json_decode($response);
    foreach ($newData->streams as $online) {
        $name = $online->channel->name;
        $label = $online->channel->display_name;
        $iconExternal = $online->channel->logo;
        $popularity = isset($popularData['ttv'][$name]) ? $popularData['ttv'][$name]['popularity'] : 0;

        $liveChannels[] = $name;
        $otherUpdates[$name] = [
            'channel' => $name,
            'isOnline' => 1,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity
        ];
    }

    $offlinePopular = array_diff($popularChannels, $liveChannels);
    $offlinePopular = array_intersect($offlinePopular, $twitchChannels);
    foreach ($offlinePopular as $channel) {
        $name = $channel;
        $iconExternal = "";
        $popularity = isset($popularData['ttv'][$name]) ? $popularData['ttv'][$name]['popularity'] : 0;

        $otherUpdates[$name] = [
            'channel' => $name,
            'isOnline' => 0,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity
        ];
    }

    $offline = array_diff($twitchChannels, $liveChannels);
    foreach ($otherUpdates as $atts) {
        updateMiscAttributes($conn, $atts, 'twitch');
    }
    // updateLiveStatus($conn, true, $liveChannels, 'twitch'); // TODO: remove since we're looping through everything anyways
    updateLiveStatus($conn, false, $offline, 'twitch');
    return $newData;
}

function addTemporaryTwitchChannels($conn, $data) {
    $channelAdditions = [];

    $twitchChannels = [];
    $popularTwitchChannels = [];

    $youtubeChannels = [];
    $popularYoutubeChannels = [];

    $vaughnliveChannels = [];
    $popularVaughnliveChannels = [];
    
    $popularData = fetchPopular($conn);
    foreach ($popularData as $site => $channel) {
        if ($site === 'twitch' || $site === "ttv") {
            foreach ($channel as $name => $arr) {
                $popularTwitchChannels[] = $name;
            }
        }
        if ($site === 'youtube' || $site === "yut") {
            foreach ($channel as $name => $arr) {
                $popularYoutubeChannels[] = $name;
            }
        }
        if ($site === 'vaughnlive' || $site === "vtv") {
            foreach ($channel as $name => $arr) {
                $popularVaughnliveChannels[] = $name;
            }
        }
    }

    foreach ($data as $channel) {
        switch ($channel['src']) {
            case "twitch":
                $twitchChannels[] = $channel['channel'];
                break;
            case "youtube":
                $youtubeChannels[] = $channel['channel'];
                break;
            case "youtube":
                $vaughnliveChannels[] = $channel['channel'];
                break;
            default:
                continue;
        }
    }

    $unknownTwitchChannels = array_diff($popularTwitchChannels, $twitchChannels);
    $unknownYoutubeChannels = array_diff($popularYoutubeChannels, $youtubeChannels);
    $unknownVaughnliveChannels = array_diff($popularVaughnliveChannels, $vaughnliveChannels);

    $response = curl_get_contents("https://api.twitch.tv/kraken/streams?channel=". implode($unknownTwitchChannels, ','), "1p9iy0mek7mur7n1jja9lejw3");
    $twitchResponse = json_decode($response);

    $temp = [];
    foreach ($twitchResponse->streams as $online) {
        $name = $online->channel->name;
        $label = $online->channel->display_name;
        $isOnline = 1;
        $expires = 1;
        $iconExternal = $online->channel->logo;
        $popularity = $popularData['ttv'][$name]['popularity'];
        $sessionStart = $popularData['ttv'][$name]['timeStamp'];
        $dateCreated = $popularData['ttv'][$name]['createdTime'];

        $temp[] = $name;
        $channelAdditions[] = [
            'src' => 'twitch',
            'channel' => $name,
            'label' => $label,
            'isOnline' => $isOnline,
            'expires' => $expires,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity,
            'sessionStart' => $sessionStart,
            'dateCreated' => $dateCreated
        ];
    }

    $offlineTwitch = array_diff($unknownTwitchChannels, $temp);
    foreach ($offlineTwitch as $channel) {
        $name = $channel;
        $label = $channel;
        $isOnline = 0;
        $expires = 1;
        $iconExternal = "";
        $popularity = $popularData['ttv'][$name]['popularity'];
        $sessionStart = $popularData['ttv'][$name]['timeStamp'];
        $dateCreated = $popularData['ttv'][$name]['createdTime'];

        $channelAdditions[] = [
            'src' => 'twitch',
            'channel' => $name,
            'label' => $label,
            'isOnline' => $isOnline,
            'expires' => $expires,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity,
            'sessionStart' => $sessionStart,
            'dateCreated' => $dateCreated
        ];
    }

    foreach ($unknownYoutubeChannels as $channel) {
        $name = $channel;
        $label = $channel;
        $isOnline = 1;
        $expires = 1;
        $iconExternal = "https://img.youtube.com/vi/" . $channel . "/default.jpg";
        $popularity = $popularData['yut'][$name]['popularity'];
        $sessionStart = $popularData['yut'][$name]['timeStamp'];
        $dateCreated = $popularData['yut'][$name]['createdTime'];

        $channelAdditions[] = [
            'src' => 'youtube',
            'channel' => $name,
            'label' => $label,
            'isOnline' => $isOnline,
            'expires' => $expires,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity,
            'sessionStart' => $sessionStart,
            'dateCreated' => $dateCreated
        ];
    }

    foreach ($unknownVaughnliveChannels as $channel) {
        $name = $channel;
        $label = $channel;
        $isOnline = 1;
        $expires = 1;
        $iconExternal = "https://cdn.vaughnsoft.net/profile/999999/" . $channel . ".jpg";
        $popularity = $popularData['vtv'][$name]['popularity'];
        $sessionStart = $popularData['vtv'][$name]['timeStamp'];
        $dateCreated = $popularData['vtv'][$name]['createdTime'];

        $channelAdditions[] = [
            'src' => 'vaughnlive',
            'channel' => $name,
            'label' => $label,
            'isOnline' => $isOnline,
            'expires' => $expires,
            'iconExternal' => $iconExternal,
            'popularity' => $popularity,
            'sessionStart' => $sessionStart,
            'dateCreated' => $dateCreated
        ];
    }

    // print_r($channelAdditions);

    if (count($channelAdditions)) addChannels($conn, $channelAdditions);
    resetUnpopularChannels($conn, "twitch", $popularTwitchChannels); // FIXME: 3rd parameter is channels to ignore, probably rename
    resetUnpopularChannels($conn, "youtube", $popularYoutubeChannels);

    return $channelAdditions;
}


<?php

require_once("functions.php");
// FIXME: This seems really dumb but don't feel like fixing
$data = fetchChannels($conn);
$popular = addTemporaryTwitchChannels($conn, $data);
$live = updateTwitchChannels($conn, $data);
$data = fetchChannels($conn);
$conn->close();

$json = json_encode($data, true);

echo $json;
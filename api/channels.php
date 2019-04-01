<?php

require_once("functions.php");
$data = fetchChannels($conn);
$popular = addTemporaryTwitchChannels($conn, $data);
$live = updateTwitchChannels($conn, $data);
$conn->close();

$json = json_encode($data, true);

echo $json;
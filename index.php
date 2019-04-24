<?php 
$css = [
    // 'lib/material-icons', 
    'lib/hamburgers', 
    'style'
];
$js = [
    'view', 
    'channel', 
    'chat', 
    'config', 
    'app'
];

function embed($type, $files) {
    switch ($type) {
        case 'css':
            $open = '<link rel="stylesheet" href="';
            $close = '" />';
            break;
        case 'js':
            $open = '<script src="';
            $close = '"></script>';
            break;
        default:
            return;
    }
    $i = 0;
    foreach ($files as $file) {
        $filename = "./" . $type . "/" . $file . "." . $type;
        $ocd = (++$i == count($files) ? "\n" : "\n \t \t");
        if (file_exists($filename)) $filename .= "?" . md5_file($filename);
        echo $open . $filename . $close  . $ocd;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Fightan Vidya</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <?php embed('css', $css) ?>
    </head>
    <body>
        <main class="fv-main default">
            <header>
                <a href="/"><img alt="Fightan Vidya" src="http://fightanvidya.com/IS/FVLogo.png"/></a>
                <nav class="menu">
                    <a href="stream"><img alt="Stream" src="http://fightanvidya.com/IS/STREAM.png"/></a>
                    <img alt="/" src="http://fightanvidya.com/IS/DIV.png" />
                    <a href="wiki"><img alt="Wiki" src="http://fightanvidya.com/IS/WIKI.png"/></a>
                    <img alt="/" src="http://fightanvidya.com/IS/DIV.png" />
                    <a href="betmain"><img alt="Bets" src="http://fightanvidya.com/IS/BETS.png"/></a>
                </nav>
            </header>
            <nav class="submenu">
                <span class="submenu-item">Center</span>
                <span class="submenu-item">Snow</span>
                <span class="submenu-item">Free Chat Box</span>
            </nav>
            <section class="grid">
                <section class="mobile-header" style="">
                <img class="mobile-logo" src="http://fightanvidya.com/IS/mob_logo.png" alt="Fightan Vidya">
            </section>
                <section class="stream-area">
                    <!-- <div class="view">
                        <div class="stream twitch selected" style="--aspect-ratio:16/9">
                        </div>
                        <div class="view-controller">
                            <i class="material-icons add"></i>
                            <i class="material-icons remove"></i>
                            <i class="material-icons star"></i>
                            <i class="material-icons chat"></i>
                            <i class="material-icons resize"></i>
                        </div>
                    </div> -->
                </section>
                <section class="chat-area resize-lock">
                    <div class="placeholder"></div>
                </section>
            </section>
            <section class="controllers default">
                <section class="waifu-box">
                    <button data-src="twitch" type="button"><img src="http://fightanvidya.com/IS/jtv.png" alt="twitch"></button>
                    <button data-src="livestream"><img src="http://fightanvidya.com/IS/lst.png" alt="livestream"></button>
                    <button data-src="youtube"><img src="http://fightanvidya.com/IS/yut.png" alt="youtube"></button>
                    <button data-src="nicovideo"><img src="http://fightanvidya.com/IS/nnd.png" alt="nicovideo"></button>
                    <button data-src="vaughnlive"><img src="http://fightanvidya.com/IS/vtv.png" alt="vaughnlive"></button>
                    <button data-src="any"><img src="http://fightanvidya.com/IS/any.png" alt="any"></button>
                    <input type="search" placeholder="No Waifus Allowed">
                </section>
                <section class="channel-area">
                    <section class="online">
                        <h3 class="channel-header">« Online + Popular »</h3>
                    </section>
                </section>
            </section>
        </main>
        <nav class="sidenav config">
            <button class="hamburger hamburger--collapse not-active" type="button">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>

            <section class="drawer">
                <div class="header"></div>
            </section>
        </nav>
        <footer></footer>
        <script src="https://player.twitch.tv/js/embed/v1.js"></script>
        <?php embed('js', $js) ?>
    </body>
</html>

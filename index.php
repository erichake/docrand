<!DOCTYPE html>
<!-- This file is part of DocRand <https://docrand.dgpad.net>.
DocRand is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
DocRand is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with DocRand. If not, see <https://www.gnu.org/licenses/>. -->
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="viewport"
      content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0 ,user-scalable=no"
    />
    <link rel="stylesheet" href="./styles/styles.css" />
    <link rel="shortcut icon" type="image/png" href="ressources/images/favicon.png"/>
    <title>DocGame</title>
  </head>
  <body>
<?php
mb_internal_encoding("UTF-8");

$l = isset($_GET["level"]) ? $_GET["level"] : null;
$l = isset($_POST["level"]) ? $_POST["level"] : $l;
if (($l)) {
    echo "<script>window.\$START_LEVEL=" . $l . ";</script>";
} else {
    echo "<script>window.\$START_LEVEL=1;</script>";
}

$l = isset($_GET["mobile"]) ? $_GET["mobile"] : null;
$l = isset($_POST["mobile"]) ? $_POST["mobile"] : $l;
if (($l)) {
    echo "<script>window.\$MOBILE_MODE=" . $l . ";</script>";
}

$u = isset($_GET["url"]) ? $_GET["url"] : null;
$u = isset($_POST["url"]) ? $_POST["url"] : $u;
if (($u)) {
    set_error_handler("warning_handler", E_WARNING);
    try {
        if ((strpos($u, 'google.com') !== false)) {
            // GOOGLE DRIVE :
            $pattern = "/([-\w]{25,})/";
            preg_match($pattern, $u, $res);
            if ((is_array($res)) && (count($res) > 0)) {
                $id = $res[0];
                // Appel de script dans mon GDrive secondaire.
                // Ramène le contenu du fichier js (un lien de 
                // download direct ne peut fonctionner chez google 
                // pour les fichiers d'extension ".js") :
                $f = file_get_contents("https://script.google.com/macros/s/AKfycbxtuIZlalFpx5mjQHpjzK_AfC52apfIVeRQNTO1XR95K9vX3Em3o6yFcbwCbfs4XvKv/exec?id=" . $id);
            }
            
        } else if ((strpos($u, 'dropbox.com') !== false)) {
            // DROPBOX :
            $DURL = explode("?", $u);
            $f = (file_get_contents($DURL[0] . "?dl=1"));
        } else if (($u) && ((strpos($u, 'drv.ms/') !== false) || (strpos($u, 'live.com/') !== false))) {
            // ONEDRIVE :
            $b64 = base64_encode($u);
            $b64 = str_replace("=", "", $b64);
            $b64 = str_replace("/", "_", $b64);
            $b64 = str_replace("+", "-", $b64);
            $b64 = "u!" . $b64;
            $url2 = "https://api.onedrive.com/v1.0/shares/$b64/root/content";
            $f = (file_get_contents($url2));
        } else {
            // NEXTCLOUD DRIVE :
            $f = (file_get_contents($u . "/download"));
        }

        // Deprecated php 8.2 :
        $f = mb_convert_encoding($f, 'HTML-ENTITIES', "UTF-8");
        
        $f = preg_replace('/import\s*{[^}]*}[^;]*[;]*/m', '', $f);

        echo '<script>window.$PLUGIN=window.atob("' . base64_encode($f) . '");</script>';
        echo '<script type="module" src="scripts/_main.js"></script>';
    } catch (Exception $e) {
        echo "<script>top.location.href='error.html?wrongURL'</script>";
    };
    restore_error_handler();

} else {
    echo "<script>top.location.href='error.html?noURL'</script>";
}

function warning_handler($errno, $errstr)
{
    throw new \Exception($errstr, $errno);
}

?>

  </body>
</html>

<!DOCTYPE html>

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
                $f = file_get_contents("https://drive.google.com/uc?id=" . $id . "&export=download");
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

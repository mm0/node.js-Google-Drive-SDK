<?php

$p12cert = array();
$file = './pkey.p12';
$fd = fopen($file, 'r');
$p12buf = fread($fd, filesize($file));
fclose($fd);

function urlSafeB64Encode($data) {
    $b64 = base64_encode($data);
    $b64 = str_replace(array('+', '/', '\r', '\n', '='),
                       array('-', '_'),
                       $b64);
    return $b64;
  }
//date_default_timezone_set('UTC');

$now = time();
$now = 1359561203;
$jwtParams = array(
          'aud' => 'https://accounts.google.com/o/oauth2/token',
          'scope' => 'https://www.googleapis.com/auth/drive',
          'iat' => $now,
          'exp' => $now + 3600,
          'iss' => '389552467993-gqsl9ihfrfagc48rkvedgk875gt7fvke@developer.gserviceaccount.com'
    );
$header = array('typ' => 'JWT', 'alg' => 'RS256');

    $segments = array(
      urlSafeB64Encode(json_encode($header)),
      urlSafeB64Encode(json_encode($jwtParams))
    );
print_r(json_encode($jwtParams));


if ( openssl_pkcs12_read($p12buf, $p12cert, 'notasecret') )
{
	$data = implode('.',$segments);
	$data = file_get_contents("./php_data");
	$pkey = openssl_pkey_get_private($p12cert["pkey"]);
	openssl_sign($data, $signature, $pkey, "sha256");
echo base64_encode($signature);exit;

$s = urlSafeB64Encode($signature);
echo "sign: ".$signature."\n";
echo "encoded: ".$s."\n";
echo $data.".".$s."\n";

}

<?php
$config=require __DIR__.'/main.php';

$config['components']['db']=array(
    'connectionString'=>'mysql:host=localhost;dbname=DxPortfolio',
    'emulatePrepare'=>true,
    'username'=>'root',
    'password'=>'123',
    'charset'=>'utf8',
);

$config['components']['google']=array(
    'class'=>'ext.google.sdk.Client',
    'clientId'=>'164940990608-oiigtb4idpcvcdaf9q757a76b36c33lh.apps.googleusercontent.com',
    'clientSecret'=>'Sw_xAewbDB0AoXWWHnKvqlpm',
    'redirectUrl'=>'/oauth/google/callback'
);

return $config;
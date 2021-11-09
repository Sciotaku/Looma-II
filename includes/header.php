<?php       //NOTE: cookies must be sent before any other data is sent to the client

//chdir('/usr/local/var/www/Looma');
//echo getcwd() . "\n"; exit;

//if (file_exists('../content/CEHRD')) echo '../content/CEHRD exists'; exit;

//if (file_exists('../content/CEHRD')) $source = 'CEHRD';
    if ($_SERVER['SERVER_NAME'] === 'learning.cehrd.edu.np'
  //      || $_SERVER['SERVER_NAME'] === 'localhost'
    )
         $source = 'CEHRD';
    else $source = 'looma';

    //echo 'source is '.$source;exit;

    if (!isset($_COOKIE['source']) || $_COOKIE['source'] !== $source) {
        setcookie('source',$source,0,"/");
        if ($source === 'CEHRD') setcookie('theme', 'CEHRD',0,"/");
        header("Refresh:0");
        exit;
    }

    if ($_COOKIE['source'] === "CEHRD") {
      print "<title>Learning Portal</title>";
      print '<link rel="icon" type="image/png" href="images/logos/CEHRD-logo small.jpg">';
    } else {  //source default is  'looma'
        print "<title>{$page_title}</title>";
        print '<link rel="icon" type="image/png" href="images/logos/looma favicon yellow on blue.png">';
    }
    //echo 'source is ' . $_COOKIE['source']; exit;

?>
<html lang="en" class="no-js">
  <head>

      <!--
Author: Skip
Owner:  VillageTech Solutions (villagetechsolutions.org)
Date:   2015 03
Revision: Looma 2.0.0

File: header.php
-->
	<meta charset="utf-8">
    <meta name="viewport"  content="width=device-width, initial-scale=1">
  	<meta name="author"    content="Skip">
    <meta name="project"   content="Looma">
    <meta name="url"       content="https://looma.website">
    <meta name="owner"     content="Looma Education Corporation">
    <meta name="copyright" content="Looma Education Corporation">

    <meta name="description" content="Looma Education: Nepal.
    Looma is an affordable and low power-consuming audio-visual education computer
    that provides reliable access to educational content for an entire classroom--offline.
    It combines a computer, A/V projection system, webcam, and massive library of media files,
    teacher tools, dictionary, learning games, educational videos, etc., replacing the Internet.
    It uses only 55 W, easily provided by solar, replacing electrical grid power.
    The current version of Looma is configured for grade K-12 education in Nepal. Configurations for other
    languages and countries are planned.">


      <!--
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
                  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
                  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
                  <link rel="manifest" href="/site.webmanifest">
                  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
                  <meta name="msapplication-TileColor" content="#da532c">
                  <meta name="theme-color" content="#ffffff">

       -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> <!-- uses latest IE rendering engine-->
      <!--[if lt IE 9]> <script src="js/html5shiv.min.js"></script>  <![endif]-->

	<?php
  	    // Turn on error reporting
		error_reporting(E_ALL);
		ini_set('display_errors', 1);

    //if (file_exists('includes/looma-translate.php')) echo 'includes/looma-translate.php  exists'; exit;

    require_once ('includes/looma-translate.php');
    require_once ('includes/mongo-connect.php');

 //echo '__dirname__ is ' . dirname(__DIR__) . ' and cwd is '. getcwd() ;exit;
   ///////////////////////////////////////////////
//require_once(dirname(__DIR__ ). '/includes/mongo-connect.php');

    require_once ('includes/looma-log-user-activity.php');

		define ("CONTENT_PATH", "../content");
	?>

      <!-- <div class="watermark">Under Construction</div>  -->

      <link rel="stylesheet" href="css/looma.css">             <!-- Looma CSS -->
      <link rel="stylesheet" href="css/looma-keyboard.css">    <!-- Looma keyboard CSS -->

    <?php  /*retrieve 'theme' cookie from $_COOKIE and use it to load the correct 'css/looma-theme-xxxxxx.css' stylesheet*/
        if ( $source === 'CEHRD' )         $settheme = "CEHRD";
        else if (isset($_COOKIE['theme'])) $settheme = $_COOKIE['theme'];
        else                               $settheme = 'looma';

        echo "<link rel='stylesheet' href='css/looma-theme-" . $settheme . ".css' id='theme-stylesheet'>";

        function loggedIn() { return (isset($_COOKIE['login']) ? $_COOKIE['login'] : null);}

        function keyIsSet($key, $array) { return isset($array[$key]);} //compatibility shim for php 5.x "array_key_exists()"
    ?>



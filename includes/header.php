<!--
Author: Skip
Email:  skip@stritter.com
Owner:  VillageTech Solutions (villagetechsolutions.org)
Date:   2015 03
Revision: Looma 2.0.0

File: header.php
-->

<html lang="en" class="no-js">
  <head>
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  	<meta name="author"  content="Skip">
  	<meta name="project" content="Looma">
  	<meta name="owner"   content="villagetechsolutions.org">

    <link rel="icon"     type="image/png" href="images/logos/looma favicon yellow on blue.png">
      <!--
  	<link rel="icon"     type="image/png" href="images/favicon-32x32.png">
  	-->
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

		require_once ('includes/looma-translate.php');

		define ("CONTENT_PATH", "../content");
	?>

  	<title> <?php print $page_title; ?> </title>

    <link rel="stylesheet" href="css/tether.min.css">        <!-- needed by bootstrap.css -->
    <link rel="stylesheet" href="css/bootstrap.min.css">     <!-- Bootstrap CSS still needed ?? yes, for glyphicons-->
    <link rel="stylesheet" href="css/looma.css">             <!-- Looma CSS -->
    <link rel="stylesheet" href="css/looma-keyboard.css">    <!-- Looma keyboard CSS -->

    <?php  /*retrieve 'theme' cookie from $_COOKIE and use it to load the correct 'css/looma-theme-xxxxxx.css' stylesheet*/
        if(isset($_COOKIE["theme"])) $theme = $_COOKIE["theme"]; else $theme = "looma";
        echo "<link rel='stylesheet' href='css/looma-theme-" . $theme . ".css' id='theme-stylesheet'>";

        function loggedIn() { return (isset($_COOKIE['login']) ? $_COOKIE['login'] : null);};
    ?>



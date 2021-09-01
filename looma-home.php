<!doctype html>
<!--
Name: Skip

Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2015 03
Revision: Looma 2.0.0
File: index.php   [home page for Looma]
Description: displays all the classes and on-click, all the subjects, plus toolbar for other pages
-->

<?php $page_title = 'Looma Home Page';
    require_once ('includes/header.php');
    require_once ('includes/mongo-connect.php');

// IMPORTAMNT: for CEHRD (temporary fix) set 'theme' cookie to 'CEHRD' [and reload to get cookie's effect]

if( ! isset($_COOKIE["theme"]) || $_COOKIE["theme"] !== 'CEHRD') {
    setcookie('theme','CEHRD');
    header('Location: ../Looma/looma-home.php');
}

// delete the above for localhost or normal looma online
?>

    <link rel="stylesheet" href="css/looma-home.css">
</head>

<body>
    <div id="main-container-horizontal">

        <?php

        if(isset($_COOKIE["theme"]) &&  $_COOKIE["theme"] === 'CEHRD') {
            //echo '<div id="head" class="cehrd">';
                echo '<img  id="logo"   src="images/logos/CEHRD-logo.png" >';
                echo "<div id='logo-info' class='english-keyword'><br>
                    <p>Government of Nepal</p>
                    <p>Ministry of Education, Science and Technology</p>
                    <p class='mid'>Center for Education and Human Resource Development</p>
                    <p class='big'>LEARNING PORTAL </p>";
                echo "</div>";
                echo "<div id='logo-info' class='native-keyword'><br>
                    <p>नेपाल सरकार</p>
                    <p>शिक्षा, विज्ञान तथा प्रविधि मन्‍‌त्रालय </p>
                    <p>शिक्षा तथा मानव स्रोत विकास केन्द्र</p>
                    <p class='big'>सिकाइ चौतारी </p>";
                echo "</div>";
           // echo "</div>";
        } else {
           // echo '<div id="head">';
                echo '<img  id="logo" class=" english-keyword" draggable="false"';
                echo 'src="images/logos/Looma-english-amanda 3x1.png" >';
                echo '<img   class=" native-keyword" hidden draggable="false"';
                echo 'src="images/logos/Looma-nepali-amanda 3x1.png" >';
          //  echo "</div>";
        }
        ?>

        <!--  display CLASS buttons  -->
        <div id="classes" class="button-div">
            <?php
                //$classes = $textbooks_collection->distinct("class");
                $classes = mongoDistinct($textbooks_collection, "class");

                for ($i = 1; $i <= sizeOf($classes); $i++) {
                    echo "<button type='button' class='class' id=class$i>";
                    //echo "<div class='little'>"; keyword("Grade"); echo "</div>";
                    echo "<div>";                keyword((string) $i);     echo "</div>";
                    echo "</button>";
                }
            ?>
        </div>

        <div id="subjects" class="button-div"></div>

    </div>

    <?php include ('includes/toolbar.php'); ?>
    <?php include ('includes/js-includes.php'); ?>
    <script src="js/looma-home.js"></script>
</body>
</html>
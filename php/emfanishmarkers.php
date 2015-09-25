<?php
	require_once("connection.php");
	// Opens a connection to a MySQL server
	$mySqlConnection = @mysql_connect ($db_server, $user, $pass) or die ('Error: '.mysql_error());
	mysql_set_charset('utf8',$mySqlConnection);
	mysql_query("SET NAMES UTF8");
	
	// Set the active MySQL database
	$db_selected = mysql_select_db($database, $mySqlConnection);
	if (!$db_selected) {
	  die ('Can\'t use db : ' . mysql_error());
	}
	$val = $_REQUEST['val'];
	
	if($val == "grade1") {
		$query = "SELECT * FROM `1st-grade_edu`";
	}
	else if($val == "grade2") {
		$query = "SELECT * FROM `2nd-grade_edu`";
	}
	else if($val == "grade3") {
		$query = "SELECT * FROM `3rd-grade_edu`";
	}
	else if($val == "other") {
		$query = "SELECT * FROM `other_edu`";
	}
	else if($val == "car") {
		$query = "SELECT * FROM `car_rent`";
	}
	else if($val == "church") {
		$query = "SELECT * FROM `churches`";
	}
	else if($val == "culture") {
		$query = "SELECT * FROM `cultural_centers`";
	}
	else if($val == "health") {
		$query = "SELECT * FROM `health`";
	}
	else if($val == "hotel") {
		$query = "SELECT * FROM `hotels`";
	}
	else if($val == "museum") {
		$query = "SELECT * FROM `museums`";
	}
	else if($val == "parking") {
		$query = "SELECT * FROM `parkings`";
	}
	else if($val == "public") {
		$query = "SELECT * FROM `public_services`";
	}
	else if($val == "sports") {
		$query = "SELECT * FROM `sports_houses`";
	}
	else if($val == "taxi") {
		$query = "SELECT * FROM `taxi_places`";
	}
	else if($val == "terminal") {
		$query = "SELECT * FROM `terminal_nodes`";
	}
	$result = mysql_query($query);
	if (!$result) {
	  die('Invalid query: ' . mysql_error());
	}

	header("Content-type: text/xml encoding=UTF-8");

	// Start XML file, echo parent node
	echo '<markers>';

	// Iterate through the rows, printing XML nodes for each
	while ($row = @mysql_fetch_assoc($result)){
		// ADD TO XML DOCUMENT NODE
		echo '<marker ';
		echo 'id="' . $row['id'] . '" ';
		echo 'name="' . $row['name'] . '" ';
		echo 'lat="' . $row['lat'] . '" ';
		echo 'lng="' . $row['lng'] . '" ';
		echo 'address="' . $row['address'] . '" ';
		echo 'telephone="' . $row['telephone'] . '" ';
		if (!($val == "car" || $val == "church" || $val == "parking" || $val == "sports" || $val == "taxi")) {
			echo 'website="' . $row['website'] . '" ';
		}
		echo '/>';
	}
	// End XML file
	echo '</markers>';
?>
<?php
	require_once("connection.php");
	// Opens a connection to a MySQL server
	$mySqlConnection = @mysql_connect ($db_server, $user, $pass) or die ('Error: '.mysql_error());
	mysql_set_charset('utf8',$mySqlConnection);

	// Set the active MySQL database
	$db_selected = mysql_select_db($database, $mySqlConnection);
	if (!$db_selected) {
	  die ('Can\'t use db : ' . mysql_error());
	}
	$val = $_REQUEST['val'];
	
	if($val == "all_routes") {
		$query = "SELECT * FROM `bus_stop`";
	}
	if($val == "route1") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 1 AND `direction` = 'b'";
	}
	else if($val == "route2") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 2 AND `direction` = 'b'";
	}
	else if($val == "route3") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 3 AND `direction` = 'b'";
	}
	else if($val == "route4") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 4 AND `direction` = 'b'";
	}
	else if($val == "route4-1") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 44 AND `direction` = 'b'";
	}
	else if($val == "route5") {
		$query = "SELECT * FROM `route5` WHERE `bus_route` = 5 AND `direction` = 'b'";
	}
	else if($val == "route55") {
		$query = "SELECT * FROM `route5` WHERE `bus_route` = 55 AND `direction` = 'b'";
	}
	else if($val == "route6") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 6 AND `direction` = 'b'";
	}
	else if($val == "route7") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 7 AND `direction` = 'b'";
	}
	else if($val == "route8") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 8 AND `direction` = 'b'";
	}
	else if($val == "route9") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 9 AND `direction` = 'b'";
	}
	else if($val == "route10") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 10 AND `direction` = 'b'";
	}
	else if($val == "route11") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 11 AND `direction` = 'b'";
	}
	else if($val == "route15") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 15 AND `direction` = 'b'";
	}
	else if($val == "route49") {
		$query = "SELECT * FROM `bus_stop` WHERE `bus_route` = 49 AND `direction` = 'b'";
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
		echo 'bus_route="' . $row['bus_route'] . '" ';
		echo 'stop_code="' . $row['stop_code'] . '" ';
		echo 'direction="' . $row['direction'] . '" ';
		echo 'lng="' . $row['lng'] . '" ';
		echo 'lat="' . $row['lat'] . '" ';
		echo '/>';
	}
	// End XML file
	echo '</markers>';
?>
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
	$code = $_REQUEST['code'];
	
	$query = "SELECT bus_route  FROM bus_stop WHERE stop_code = $code";
	$query2 = "SELECT bus_route  FROM route5 WHERE stop_code = $code";
	
	$result = mysql_query($query);
	if (!$result) {
	  die('Invalid query: ' . mysql_error());
	}
	$result2 = mysql_query($query2);
	if (!$result2) {
	  die('Invalid query: ' . mysql_error());
	}

	header("Content-type: text/xml encoding=UTF-8");

	// Start XML file, echo parent node
	echo '<routes>';

	// Iterate through the rows, printing XML nodes for each
	while ($row = @mysql_fetch_assoc($result)){
		// ADD TO XML DOCUMENT NODE
		echo '<route ';
		echo 'bus_route="' . $row['bus_route'] . '" ';
		echo '/>';
	}
	while ($row2 = @mysql_fetch_assoc($result2)){
		// ADD TO XML DOCUMENT NODE
		echo '<route ';
		echo 'bus_route="' . $row2['bus_route'] . '" ';
		echo '/>';
	}
	// End XML file
	echo '</routes>';
?>
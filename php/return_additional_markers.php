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
	$type = $_POST["type"];

	if($type === "transit")
		$query = "SELECT * FROM `terminal_nodes` WHERE id=2 OR id=3";
	else
		$query = "SELECT * FROM `terminal_nodes`";

	$result = mysql_query($query);
	if (!$result) {
	  die('Invalid query: ' . mysql_error());
	}

	$markers = array();
	  
  	while($row = mysql_fetch_array($result)){
		 
		  $markers[] = array('marker_name' => $row['name'],
		  					  'lat' => $row['lat'],
		  					  'lng' => $row['lng'], 
							  'address' => $row['address'],
							  'telephone' => $row['telephone'],
							  'website' => $row['website']
							  );   
		
	  }
	  
	$output = $markers;
 
	echo json_encode($output);
?>
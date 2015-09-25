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

	$route_start_point = $_GET["route_start_point"];
	$route_end_point = $_GET["route_end_point"];
	$route_way_of_transp = $_GET["route_way_of_transp"];
	$route_optimization_way = $_GET["route_optimization_way"];
	$route_time = $_GET["route_time"];


	$sql = "insert into saved_routes(start_point,end_point,way_of_transportation,optimization_way,time)  values ('". $route_start_point."','".$route_end_point."','".$route_way_of_transp."','".$route_optimization_way."','".$route_time."')";
	$result = mysql_query($sql);
	if(!$result)
		echo 'ERROR'; 
	else {
		echo 'OK';
	}

?>
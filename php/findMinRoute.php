<?php
	
	// //$arr = array(array($_GET['lat'],$_GET['lng']));
	// //echo json_encode($arr, JSON_FORCE_OBJECT);
	$pos1_lat = $_GET['pos1_lat'];
	$pos1_lng = $_GET['pos1_lng'];
	$pos2_lat = $_GET['pos2_lat'];
	$pos2_lng = $_GET['pos2_lng'];
	$route_mode = $_GET['route_mode'];
	$route_optimization = $_GET['route_optimization'];
	$route_time = $_GET['route_time'];

	ini_set('max_execution_time', 300); 			//300 seconds = 5 minutes

	exec("/usr/bin/python2.7 dijkstra_new.py ".$pos1_lat. " ". $pos1_lng. " ". $pos2_lat . " ". $pos2_lng . " ". $route_mode. " ". $route_time . " ".$route_optimization ."", $output);
	$raw = explode(";", implode( "\n", $output ));	
	$arr = array();
	foreach($raw as $marker ){
		$coords = explode(",", $marker);
		array_push($arr, array($coords[0],$coords[1]));
	}
	echo json_encode($arr, JSON_FORCE_OBJECT);

	// This is the data you want to pass to Python
	// exec("python2.7 dijkstra.py", $output);
	// var_dump($output);
?>

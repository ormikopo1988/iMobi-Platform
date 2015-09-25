var flag = 0;
var map;
var geocoder;
var InfoWindow = new google.maps.InfoWindow();
var showMarker = [];
var showBus = [];
var showInvBus = [];
// var all_markers = [];
var route = {};
var travel = [];
var language = "greek";
var state = 0;
var path = [];
var menu = new gnMenu( document.getElementById( 'gn-menu' ) );
var directionsService = new google.maps.DirectionsService();
var stored_routes = {};
var data = [];
var saved_routes = 0;
var saved_routes_counter = 0;
var calc_new_route = "false";
var route_exists = "false";
var first_saved_route = "true";
var selected_route = "null";
var line;
var lineSymbol;
var flag33 = 0;
var total_addresses = 0;
var lineCoordinates = [];
var myVar;
var flag44 = 1;
var start = [];
var start_marker;
var end = [];
var end_marker;
var source_added_flag = 0;
var destination_added_flag = 0;
var flag_2 = "true";	// if true, source address is up inside the directions div, otherwise is down
var change_addresses_flag = 0;
var source_added = "false";		// if true, source address has been added, otherwise hasn't
var destination_added = "false";	// if true, desstination address has been added, otherwise hasn't
var all_options_btn_1_flag = 0;
var all_options_btn_2_flag = 0;
var setScroll;
var source_id;		// for saving the source address id
var destination_id;		// for saving the destination address id
var source_content = "<span id='source_point'></span><a href='#'' class='address'><span id='source_address'></span> </a>";
var destination_content = "<span id='destination_point'></span><a href='#'' class='address'><span id='destination_address'></span> </a>";
var bound_polygon;
var elem_id2;
var dirDis = [];
var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

var saved_routes_dict = [];			// Here will be stored all the routes that have been saved
var saved_routes_tmp_dict = [];		// Here will be stored last temporary route 
var saved_routes_dict_addresses = {};
var saved_routes_dict_markers = {};

var route_source_point;
var route_source_point_address;
var route_destination_point;
var route_destination_point_address;
var route_mode;
var currently_selected_route = 1;
var step_3_go_back = "false";
var no_saved_route = "true";


$(document).ready(function(){

	$("#show_step_content_1").css('border', '2px solid #00CF00');
	$("#show_step_content_2").css('border', '2px solid red');
	$("#show_step_content_2").css('opacity', '0.5');

	$("#show_step_content_2").prop("disabled", true);			// enable destination

	$('#route_time').datetimepicker({
		// datepicker:true,
		// format:'H:i',
		// dateFormat: "YY/MM/DD h:m",
		// step:1
	});

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});
	google.maps.event.addDomListener(window, 'load', initialize);



	$(document).mouseup(function (e){

	    var container = $("#all_options_content_1");

	    if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        container.slideUp();
	    }

	    var container2 = $("#all_options_content_2");

	    if (!container2.is(e.target) // if the target of the click isn't the container...
	        && container2.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        container2.slideUp();
	    }
	});

	$(document).on("click",".menu_choice_item", function(){

		var elem_id = this.id;
		if (elem_id == "choose_by_point"){
			if (language == "greek")
				(".menu_selected_item").empty().append("-Διάλεξε σημείο-");
			else
				(".menu_selected_item").empty().append("-Choose point-");
			for (var i=0; i<showMarker.length; i++) {
				showMarker[i].setVisible(false);
				InfoWindow.close();
			}
			for (var i=0; i<showBus.length; i++) {
				showBus[i].setVisible(false);
			}
			for (var i=0; i<showInvBus.length; i++) {
				showInvBus[i].setVisible(false);
			}
			clearInterval(myVar);
			line.setMap(null);

		}

	});
	$(document).on("click",".menu_item_2_from", function(){

		elem_id2 = this.id;

		if (elem_id2 == "default"){
			if (language == "greek")
				$(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
			else
				$(".menu_selected_item_from").empty().append("-Choose point-");
			for (var i=0; i<showMarker.length; i++) {
				showMarker[i].setVisible(false);
				InfoWindow.close();
			}
			for (var i=0; i<showBus.length; i++) {
				showBus[i].setVisible(false);
			}
			for (var i=0; i<showInvBus.length; i++) {
				showInvBus[i].setVisible(false);
			}
		}
		var menu_selected_item = $(this).text();
		$(".menu_selected_item_from").empty().append(menu_selected_item);
		
		$(".all_options").slideUp();
		$("#all_options_content_1").slideUp();

		routes(elem_id2);


	});
	$(document).on("click",".menu_item_2_to", function(){

		elem_id2 = this.id;

		if (elem_id2 == "default"){
			if (language == "greek")
				$(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
			else
				$(".menu_selected_item_to").empty().append("-Choose point-");
			for (var i=0; i<showMarker.length; i++) {
				showMarker[i].setVisible(false);
				InfoWindow.close();
			}
			for (var i=0; i<showBus.length; i++) {
				showBus[i].setVisible(false);
			}
			for (var i=0; i<showInvBus.length; i++) {
				showInvBus[i].setVisible(false);
			}
		}
		var menu_selected_item = $(this).text();
		$(".menu_selected_item_to").empty().append(menu_selected_item);
		
		$(".all_options").slideUp();
		$("#all_options_content_2").slideUp();

		routes(elem_id2);


	});
	$(document).on("click",".menu_item_from", function(){

		var elem_id = this.id;
		if (elem_id == "default"){
			if (language == "greek")
				$(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
			else
				$(".menu_selected_item_from").empty().append("-Choose point-");
			for (var i=0; i<showMarker.length; i++) {
				showMarker[i].setVisible(false);
				//showBus[i].setVisible(false);
				InfoWindow.close();
			}
			for (var i=0; i<showBus.length; i++) {
				showBus[i].setVisible(false);
			}
			for (var i=0; i<showInvBus.length; i++) {
				showInvBus[i].setVisible(false);
			}
			clearInterval(myVar);
			line.setMap(null);

		}
		var menu_selected_item = $(this).text();
		$(".menu_selected_item_from").empty().append(menu_selected_item);
		
		$("#all_options_content_1").slideUp();
		$("#all_options_content_2").slideUp();

		if(elem_id != "default"){
			show(elem_id);
		}
	});
	$(document).on("click",".menu_item_to", function(){

		var elem_id = this.id;
		if (elem_id == "default"){
			if (language == "greek")
				$(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
			else
				$(".menu_selected_item_to").empty().append("-Choose point-");
			for (var i=0; i<showMarker.length; i++) {
				showMarker[i].setVisible(false);
				//showBus[i].setVisible(false);
				InfoWindow.close();
			}
			for (var i=0; i<showBus.length; i++) {
				showBus[i].setVisible(false);
			}
			for (var i=0; i<showInvBus.length; i++) {
				showInvBus[i].setVisible(false);
			}
			clearInterval(myVar);
			line.setMap(null);

		}
		var menu_selected_item = $(this).text();
		$(".menu_selected_item_to").empty().append(menu_selected_item);
		
		$("#all_options_content_1").slideUp();
		$("#all_options_content_2").slideUp();

		if(elem_id != "default"){
			show(elem_id);
		}
	});
	$(document).on("click","#all_options_btn_1", function(){

		if (!$("#show_step_content_1").prop("disabled")) {
			if (all_options_btn_1_flag == 0){
				$("#all_options_content_1").slideDown();
				all_options_btn_1_flag = 1;
			}
			else{
				$("#all_options_content_1").slideUp();
				all_options_btn_1_flag = 0;
				$(".all_options").slideUp();
				$(".item_with_options").css("font-weight","normal");
				
			}
		}
	});

	$(document).on("click","#all_options_btn_2", function(){

		if (!$("#show_step_content_2").prop("disabled")) {
			if (all_options_btn_2_flag == 0){
				$("#all_options_content_2").slideDown();
				all_options_btn_2_flag = 1;
			}
			else{
				$("#all_options_content_2").slideUp();
				all_options_btn_2_flag = 0;
				$(".all_options").slideUp();
				$(".item_with_options").css("font-weight","normal");
			}
		}
	});

	$(document).on('mouseenter','.menu_item', function (event) {
	    $(this).css("background-color","black");
		$(this).css("color","#FFFF66");
		
	}).on('mouseleave','.menu_item',  function(){
	    $(this).css("background-color","white");
		$(this).css("color","#5f6f81");
		
	});
	$(document).on('mouseenter','.menu_item_2', function (event) {
	    $(this).css("background-color","black");
		$(this).css("color","#FFFF66");
		
	}).on('mouseleave','.menu_item_2',  function(){
	    $(this).css("background-color","white");
		$(this).css("color","#5f6f81");
		
	});


	$(document).on('mouseenter','.main_menu_btn', function (event) {
	    $(this).css("background-color","black");
		$(this).css("color","#FFFF66");
		
	}).on('mouseleave','.main_menu_btn',  function(){
	    $(this).css("background-color","#FFFF66");
		$(this).css("color","#5f6f81");
		
	});

	$(document).on('mouseenter','.item_with_options', function (event) {
	    $(this).css("background-color","#C8C8C8");
		$(this).css("color","black");
		$(this).find('img:eq(0)').attr("src","img/down_arrow_2.png");
	}).on('mouseleave','.item_with_options',  function(){
	    $(this).css("background-color","white");
		$(this).css("color","#5f6f81");
		$(this).find('img:eq(0)').attr("src","img/down_arrow.png");
	});

	$(document).on("click",".item_with_options", function(){
		$(this).css("font-weight","bold");
		// $(this).css("background-color","black");
		$(this).next(".all_options").slideToggle();
		
	});
	$(document).on("mouseleave",".item_with_options", function(){

		$(this).css("font-weight","normal");
	});
	$(document).on("mouseleave",".all_options", function(){

		$(this).prev("a").css("font-weight","normal");
		
		//$(this).slideUp();
	
	});
	
	// Clicking on the source or destination address
	$(document).on("click",".address", function(){
	    var position = $(this).attr('id');
	   
	 //   var coords = position.split(",");
	//    map.setZoom(14);
	//    map.setCenter(new google.maps.LatLng(coords[0],coords[1]));
	    //$id = $(this).attr("id");
	   // console.log($(this).first("span").attr('id'));
	    for (var i=0; i<showMarker.length; i++) {
			if (showMarker[i]["id"] == position)
		 		google.maps.event.trigger(showMarker[i], 'click');
		}
	   
	    
	});

	/******* HOVER OTHER OPTIONS BUTTON *********/
	$(document).on("click","#other_options_btn_li", function(){
		$("#menu_other_links").slideDown();
	});

	/******* UNHOVER OTHER OPTIONS BUTTON *********/
	 $(document).on("mouseleave","#menu_other_links", function(){
	 	 $("#menu_other_links").slideUp();
	 });
	
	 /******* CLICK ON OTHER OPTIONS BUTTON *********/
	 $(document).on("change",".checkbox_div_element", function(){
    
	    $id = this.id;
		if ($("#"+$id).is(':checked')) {
	        alert("show  " + $id);
	    }
	    else {
	        alert("hide  " + $id);
		}
	});

	/******* CLICK TO CHANGE THE DIRECTIONS OF THE LINE *********/
	$(document).on("click","#reverse_route_btn", function(){

		if(source_added == "true" && destination_added == "true"){
			return;
		}
    	var route_val = $("#route").val(); 
   		change_route_direction(elem_id2);
	});

	$(document).on("click","#step_2_go_back", function(){

		source_added = "false";
		source_id = "null";
		destination_added = "false";
		destination_id = "null";
		$("#source_address").empty();
		$("#source_address").prev().attr("id"," ");
		$("#destination_address").empty();
		$("#destination_address").prev().attr("id"," ");

		$("#step2_div").slideUp();

		$("#show_step_content_1").prop("disabled",false);
		$("#show_step_content_1").css("border","2px solid #00CF00");
		$("#show_step_content_1").css("opacity","1")

		$("#show_step_content_2").prop("disabled",true);
		$("#show_step_content_2").css("border","2px solid red");
		$("#show_step_content_2").css("opacity","0.5")

		$("#show_step_content_1").val("default");
		$("#show_step_content_2").val("default");
		$(".step").fadeOut(0);

		$("#step1_div").slideDown();
		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setMap(null);
		}
		$("#directions_div").slideUp();

	});

	$(document).on("click","#step_3_go_back", function(){
		
		step_3_go_back = "true";
		route_exists = "false";
		// calc_new_route = "true";
		$(".directions_div_btn_2").css("opacity","1");
		
		$("#step3_div").slideUp();
		$("#mode_1").val("default");
		$("#mode_2").val("default");
		$("#step2_div").slideDown();

		// also set time to default value
		directionsDisplay.setMap(null);
		
		for(var i=0; i<dirDis.length; i++) {
			dirDis[i].setMap(null);
		}

		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setDraggable(true);
		}
	});

	$(document).on("click","#step_3_main_results", function(){
		
		$("#send_a_route_div").fadeOut(0);
		$("#saved_routes_div").fadeIn(400);
		
	});	

	// Create a new route
	$(document).on("click","#step_3_new_route", function(){
		
		route_exists = "false";
		step_3_go_back = "false";
		no_saved_route = "true";
		$(".directions_div_btn_2").css("opacity","1");
		
		directionsDisplay.setMap(null);
		// Remove all routes from map
		for(var i=0; i<dirDis.length; i++) {
			dirDis[i].setMap(null);
		}		
	
		source_added = "false";
		source_id = "null";
		destination_added = "false";
		destination_id = "null";

		$("#source_address").empty();
		$("#source_address").prev().attr("id"," ");
		$("#destination_address").empty();
		$("#destination_address").prev().attr("id"," ");
		
		$("#directions_div").slideUp();

		// Hide the current marker from the map
		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setVisible(false);
		}

		// Prevent draggind the markers
		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setDraggable(true);
		}

		$("#mode_1").val("default");
		$("#mode_2").val("default");
		$("#step2_div").slideUp();
		$("#step3_div").slideUp();

		$("#show_step_content_1").val("default");
		$("#show_step_content_2").val("default");
		$(".step").fadeOut(0);

		$("#step1_div").slideDown();

		calc_new_route = "true";

		$("#show_step_content_1").css('border', '2px solid #00CF00');
		$("#show_step_content_1").css('opacity', '1');
		$("#show_step_content_2").css('border', '2px solid red');
		$("#show_step_content_2").css('opacity', '0.5');
		$("#show_step_content_1").prop("disabled", false);			// enable source
		$("#show_step_content_2").prop("disabled", true);			// enable destination
		
		
		$("#route_time").val("");		// Set time to default value
	});
	
	// Click to save a route
	$(document).on("click","#step_3_save", function(){	

		if (first_saved_route == "true"){					// this will be executed only the first time

			$("#saved_routes_menu_empty").fadeOut(300);		// hide the div

			saved_routes++;		// 0->1
			saved_routes_counter++;

			// create new menu item
			var new_menu_item = "<div style='background-color:#FFFAFA' class='route_menu_item'>"+
									"<span class='saved_route_content hover_link' id='"+saved_routes+"_route"+"'> Διαδρομή "+ saved_routes +"</span>"+
									"<span class='remove_route_content'> <img src='img/remove_icon_2.png' height='20' width ='20'/> </span>"+
								"</div>";
			$("#saved_routes_menu").append(new_menu_item);

			var json_data = {};		

			// Read the data created by the calcRoute function
			json_data["route_id"] = saved_routes;
			json_data["source_point"] = route_source_point;
			json_data["destination_point"] = route_destination_point;
			json_data["source_point_address"] = route_source_point_address;
			json_data["destination_point_address"] = route_destination_point_address;
			json_data["mode"] = route_mode;

			saved_routes_dict.push(json_data);
			first_saved_route = "false";

			// Change the css of the other buttons
			$('.saved_route_content').each(function(i, obj) {
				$(this).css("background-color","none");
			    $(this).parent().css("background-color","none");
			});
			$("#"+saved_routes+"_route").parent().css("background-color","#FFFAFA");

			// Trigger the click event
			$("#"+saved_routes+"_route").trigger("click");
		}

		else if(calc_new_route == "true"){	

			$("#saved_routes_menu_empty").fadeOut(300);		// hide the div
			
			saved_routes++;		// 0->1
			saved_routes_counter++;
			// create new menu item
			var new_menu_item = "<div class='route_menu_item'>"+
									"<span class='saved_route_content hover_link' id='"+saved_routes+"_route"+"'> Διαδρομή "+ saved_routes +"</span>"+
									"<span class='remove_route_content'> <img src='img/remove_icon_2.png' height='20' width ='20'/> </span>"+
								"</div>";
			
			$("#saved_routes_menu").append(new_menu_item);
			
			var json_data = {};			

			// Read the data created by calcRoute function
			json_data["route_id"] = saved_routes;
			json_data["source_point"] = route_source_point;
			json_data["destination_point"] = route_destination_point;
			json_data["source_point_address"] = route_source_point_address;
			json_data["destination_point_address"] = route_destination_point_address;
			json_data["mode"] = route_mode;

			saved_routes_dict.push(json_data);

			calc_new_route = "false";

			// Change the css of the other buttons
			//$('.saved_route_content').parent().css("background-color","none");
			$('.saved_route_content').each(function(i, obj) {
				$(this).css("background-color","none");
		    	$(this).parent().css("background-color","none");
			});
			$("#"+saved_routes+"_route").parent().css("background-color","#FFFAFA");

			// Trigger the click event
			$("#"+saved_routes+"_route").trigger("click");
		}
		else{
			if (language == "greek")
				alert("Η διαδρομή αυτή έχει ήδη αποθηκευτεί");
			else
				alert("This route has been already saved");			
		}
		if (language == "greek")
			selected_route = "  'Διαδρομή " + saved_routes_counter+"'";
		else
			selected_route = "  'Route " + saved_routes_counter+"'";


		$("#send_a_route_div").fadeOut(0);
		no_saved_route = "false";
		step_3_go_back = "false";

	});
	
	// When clicked on a saved route
	$(document).on("click",".saved_route_content", function(){	

		var this_elem = this;
		$('.saved_route_content').each(function(i, obj) {
			$(this).css("background-color","none");	
	    	$(this).parent().css("background-color","none");
		});
		$(this).parent().css('background-color','#FFFAFA');

		if (selected_route == "null"){
			if (language == "greek")
				selected_route = "διαδρομής";
			else
				selected_route = "route";
		}
		else  			// a route has been selected
 			selected_route = ""+$(this).html()+"";
		
		// Remove all routes from the map
		for(var i=0; i<dirDis.length; i++) {
			dirDis[i].setMap(null);
		}
		// for (var i=0; i<showMarker.length; i++) {
		// 	showMarker[i].setVisible(false);
		// }

		// The id of the selected element
		var this_elem_id = this.id.split("_")[0];
		
		// The last route that has been selected
		currently_selected_route = this_elem_id;

		var source_id = saved_routes_dict[parseInt(this_elem_id)-1].source_point;
		var destination_id = saved_routes_dict[parseInt(this_elem_id)-1].destination_point;
		
		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setVisible(false);
		}
		var counter = 0;
		for (var i=0; i<showMarker.length; i++) {

			if (showMarker[i]["id"] == source_id ){
		
				showMarker[i].setVisible(true);
				showMarker[i].setIcon("img/dd-start.png");
				counter++;
			}
			else if (showMarker[i]["id"] == destination_id){
	
				showMarker[i].setVisible(true);
				counter++;
			}
			if(counter == 2)
				break;
			
		}	
		
		// Update the addresses in the directions_div
		$("#source_address").empty().html(saved_routes_dict[parseInt(this_elem_id)-1].source_point_address);
		$("#destination_address").empty().html(saved_routes_dict[parseInt(this_elem_id)-1].destination_point_address);

		// Update the addresses' id in the directions_div
		// $("#source_address").prev().attr("id"," ");
		$("#source_address").parent("a").attr("id",source_id);

		// $("#destination_address").prev().attr("id"," ");
		$("#destination_address").parent("a").attr("id",destination_id);

		
		
		// Retrieve route's elements
		
		var this_route_source_point = saved_routes_dict[parseInt(this_elem_id)-1].source_point;

		var this_route_destination_point = saved_routes_dict[parseInt(this_elem_id)-1].destination_point;
		var this_route_mode = saved_routes_dict[parseInt(this_elem_id)-1].mode;

		// Calculate route
		calcRoute(this_route_source_point,this_route_destination_point,this_route_mode,"mode_2");

		if (first_saved_route == "true"){					// this will be executed only the first time

			$("#saved_routes_menu_empty").fadeOut(300);		// hide the div
			saved_routes++;		// 0->1
			saved_routes_counter++;

			//create new menu item
			var new_menu_item = "<div style='background-color:#FFFAFA' class='route_menu_item'>"+
									"<span class='saved_route_content hover_link' id='"+saved_routes+"_route"+"'> Διαδρομή "+ saved_routes +"</span>"+
									"<span class='remove_route_content'> <img src='img/remove_icon_2.png' height='20' width ='20'/> </span>"+
								"</div>";
			$("#saved_routes_menu").append(new_menu_item);

			var json_data = {};			

			json_data["route_id"] = saved_routes;
			json_data["source_point"] = route_source_point;
			json_data["destination_point"] = route_destination_point;
			json_data["source_point_address"] = route_source_point_address;
			json_data["destination_point_address"] = route_destination_point_address;
			json_data["mode"] = route_mode;

			saved_routes_dict.push(json_data);
			first_saved_route = "false";

			// Change the css of the other buttons
			// $('.saved_route_content').each(function(i, obj) {
			// 	$(this).css("background-color","none");
			//     $(this).parent().css("background-color","none");
			// });
			// $("#"+saved_routes+"_route").parent().css("background-color","#FFFAFA");

			// // Trigger the click event
			// $("#"+saved_routes+"_route").trigger("click");
		}
	});
	
	// When click to remove a route
	$(document).on("click",".remove_route_content", function(){	
		
		var item_to_delete_id = $(this).prev().attr("id").split("_")[0];
		saved_routes_dict.slice(parseInt(item_to_delete_id)-1,1);
		$(this).parent().remove();

		// If menu div is empty, show the message 
		if (!$.trim($("#saved_routes_menu").html()).length){
			$("#saved_routes_menu_empty").fadeIn(400);
		}
		saved_routes_counter--;
		
		if (saved_routes_counter == 0){			// it was the last route
			$("#current_route").empty();
			source_added = "false";
			source_id = "null";
			destination_added = "false";
			destination_id = "null";

			$("#source_address").empty();
			$("#source_address").prev().attr("id"," ");
			$("#destination_address").empty();
			$("#destination_address").prev().attr("id"," ");
			directionsDisplay.setMap(null);
			for(var i=0; i<dirDis.length; i++) {
				dirDis[i].setMap(null);
			}
			// Remove all markers from the map
			for (var i=0; i<showMarker.length; i++) {
				showMarker[i].setMap(null);
			}
			
			$("#directions_div").slideUp();
			$("#step3_div").slideUp();
			$("#step2_div").slideUp();
			$("#step1_div").slideDown();

			first_saved_route = "true";

			$("#show_step_content_1").css('border', '2px solid #00CF00');
			$("#show_step_content_1").css('opacity', '1');
			$("#show_step_content_2").css('border', '2px solid red');
			$("#show_step_content_2").css('opacity', '0.5');
			$("#show_step_content_1").prop("disabled", false);			// enable destination
			$("#show_step_content_2").prop("disabled", true);			// disable destination

			$("#mode_1").val("default");
			$("#show_step_content_1".val("default");
			$("#show_step_content_2".val("default");
			$("#mode_2").val("default");
			saved_routes = 0;
			step_3_go_back = "false";
			saved_routes_dict = [];
			$(".directions_div_btn_2").css("opacity","1");
			return;
		}
		else{
			
			// Find the last menu item and trigger the click event
			var last_elem;
			$('.saved_route_content').each(function(i, obj) {
				last_elem = obj;
			});
			var last_elem_id = last_elem.id;
			$("#"+last_elem_id).parent().css("background-color","#FFFAFA");
			$("#"+last_elem_id).trigger("click");
		}
		

	});

	$(document).on("click","#step_3_send", function(){	

		$("#saved_routes_div").fadeOut(0);
		// $("#route_to_send").empty().append(selected_route);
		$("#send_a_route_div").fadeIn(600);

	});

	
	$(document).on("click","#send_result_btn", function(){	
		var email = $("#email").val();
		
		if (email == ""){
			if (language == "greek")
				alert("Παρακαλώ δώστε διεύθυνση email");
			else
				alert("Please enter an email address");
			return;
		}
		else{

			var route_data = $("#current_route").html();
			//send route_data to email
		}

	});
	/******* WHEN USER REMOVES THE SOURCE ADDRESS *********/
	$(document).on("click","#remove_source", function(){
		
		
		if($.trim($("#source_address").html()).length) {

			$("#show_step_content_1").val("default");
			$("#show_step_content_2").val("default");
			$(".step").fadeOut(0);

			$("#step2_div").slideUp();		// Hide step 2 div
			$("#step1_div").slideDown();	// Show step 1 div

			// $("#step2").slideUp();
			$("#step3_div").slideUp();
			$("#mode_1").val("default");

			directionsDisplay.setMap(null);
			for(var i=0; i<dirDis.length; i++) {
				dirDis[i].setMap(null);
			}
		}

		if(flag_2 == "true"){
			$("#source_address").empty();
			$("#source_address").prev().attr("id"," ");
			// REMOVE/HIDE SOURCE MARKER FROM THE MAP 
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == source_id){
					showMarker[i].setMap(null);
				}
			}
			source_added = "false";
			source_id = "null";
			
			
		}
		else{
			$("#destination_address").empty();
			$("#destination_address").prev().attr("id"," ");
			// REMOVE/HIDE SOURCE MARKER FROM THE MAP
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == destination_id)
					showMarker[i].setMap(null);
			}
			
			destination_added = "false";
			destination_id = "null";
		}
		
		$("#show_step_content_1").prop('disabled', false);		// enable source
		$("#show_step_content_1").css('border', '2px solid #00CF00');
		$("#show_step_content_1").css('opacity', '1');
		$("#show_step_content_2").css('border', '2px solid red');
		$("#show_step_content_2").css('opacity', '0.5');

		if(destination_added == "false") {
			$("#show_step_content_2").prop('disabled', true);		// disable destination
		}

		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setDraggable(true);
		}
			
		$("#route_1").val("default");
		$("#route_2").val("default");
		InfoWindow.close();
		flag = 0;
		total_addresses--;

		if ($('#source_address').is(':empty') && $('#destination_address').is(':empty') && total_addresses == 0){
			
			$("#source_address_div").empty().append(source_content);
			$("#destination_address_div").empty().append(destination_content);
			flag_2 = "true";
			
		}
		if (source_added == "false" && destination_added == "false"){
			
			$("#show_step_content_1").prop("disabled", false);			// enable source
			$("#show_step_content_2").prop("disabled", true);			// disable destination
			$("#show_step_content_2").css('border', '2px solid red');
			$("#show_step_content_2").css('opacity', '0.5');
			$("#directions_div").slideUp();
		}

	
	});


	/******* WHEN USER REMOVES THE DESTINATION ADDRESS *********/
	$(document).on("click","#remove_destination", function(){
		
		if($.trim($("#destination_address").html()).length) {

			$("#show_step_content_1").val("default");
			$("#show_step_content_2").val("default");
			$(".step").fadeOut(0);

			$("#step2_div").slideUp();
			$("#step1_div").slideDown();
			// $("#step2").slideUp();
			$("#step3_div").slideUp();
			$("#mode_1").val("default");
			directionsDisplay.setMap(null);
			for(var i=0; i<dirDis.length; i++) {
				dirDis[i].setMap(null);
			}
		}
		if(flag_2 == "true"){
			$("#destination_address").empty();
			$("#destination_address").prev().attr("id"," ");
			/* REMOVE/HIDE DESTINATION MARKER FROM THE MAP */
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == destination_id)
					showMarker[i].setMap(null);
			}
			destination_added = "false";
			destination_id = "null";
			
		}
		else{
			$("#source_address").empty();
			$("#source_address").prev().attr("id"," ");
			/* REMOVE/HIDE DESTINATION MARKER FROM THE MAP */
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == source_id)
					showMarker[i].setMap(null);
			}
			source_added = "false";
			source_id = "null";
			
		}

		
		for (var i=0; i<showMarker.length; i++) {
			showMarker[i].setDraggable(true);
		}
		
		$("#show_step_content_2").prop("disabled", false);			// enable destination
		$("#show_step_content_2").css('border', '2px solid #00CF00');
		$("#show_step_content_2").css('opacity', '1');
		if (source_added == "true") {
			$("#show_step_content_1").prop('disabled', true);	// disable source
			$("#show_step_content_1").css('border', '2px solid red');
			$("#show_step_content_1").css('opacity', '0.5');
		}
		
		InfoWindow.close();
		total_addresses--;

		if ($('#source_address').is(':empty') && $('#destination_address').is(':empty') && total_addresses == 0){
			// CHANGE THE ADDRESSES
			$("#source_address_div").empty().append(source_content);
			$("#destination_address_div").empty().append(destination_content);
			flag_2 = "true";
			
		}
		if (source_added == "false" && destination_added == "false"){
			
			$("#show_step_content_1").prop("disabled", false);			// enable source
			$("#show_step_content_2").prop("disabled", true);			// disable destination
			$("#show_step_content_2").css('border', '2px solid red');
			$("#show_step_content_2").css('opacity', '0.5');
			$("#directions_div").slideUp();
			
		}
	});

	/******* WHEN USER ENTERS AN ADDRESS 1 *********/
	$(document).on("click","#search_location_btn_1", function(){
		if($("#search_by_location_1").val() == "")
			return;
		else{
			var address = $("#search_by_location_1").val();
		    geocoder.geocode( { 'address': address}, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        map.setCenter(results[0].geometry.location);
		      
		        var marker = new google.maps.Marker({
		            map: map,
		            id:results[0].geometry.location["k"]+","+results[0].geometry.location["D"],
		            animation: google.maps.Animation.DROP,
		            draggable:true,
		            position: results[0].geometry.location
		        });

		        if  (source_added == "false")
					marker.setIcon("img/dd-start.png");
				else if (destination_added == "false")
					marker.setIcon("img/dd-start.png");

		        google.maps.event.addListener(marker, 'click', function() {
					InfoWindow.setContent(address);
		            InfoWindow.open(marker.get('map'), marker);
		        });
		        google.maps.event.addListener(marker, 'dragend', function() { 
		        	
						InfoWindow.close();
						geocodeNewPosition(marker);
				
				});

		        setTimeout(function() {
					InfoWindow.close();
				}, 0);

				marker.setMap(map);
				showMarker.push(marker);
				
				google.maps.event.addListener(map,"click", function() {
					InfoWindow.close();
				});
		        choose_this_point(999,results[0].geometry.location,address,"geocode_address"," ");
		      } else {
		        	alert("Geocode was not successful for the following reason: " + status);
		      }
		    });

		}
	});
	
	/******* WHEN USER ENTERS AN ADDRESS 2 *********/
	$(document).on("click","#search_location_btn_2", function(){
		if($("#search_by_location_2").val() =="")
			return;
		else{
			
			var address = $("#search_by_location_2").val();
		    geocoder.geocode( { 'address': address}, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        map.setCenter(results[0].geometry.location);
		       
		        var marker = new google.maps.Marker({
		            map: map,
		            id:results[0].geometry.location["k"]+","+results[0].geometry.location["D"],
		            animation: google.maps.Animation.DROP,
		            draggable:true,
		            position: results[0].geometry.location
		        });
		        if  (source_added == "false")
					marker.setIcon("img/dd-start.png");
				else if (destination_added == "false")
					marker.setIcon("img/dd-start.png");

		        google.maps.event.addListener(marker, 'click', function() {
					InfoWindow.setContent(address);
		            InfoWindow.open(marker.get('map'), marker);
		        });

		        google.maps.event.addListener(marker, 'dragend', function() { 
		        	
					
						InfoWindow.close();
						geocodeNewPosition(marker);
					
				});

		        setTimeout(function() {
					InfoWindow.close();
				}, 0);

				marker.setMap(map);
				showMarker.push(marker);
		       
				google.maps.event.addListener(map,"click", function() {
					InfoWindow.close();
				});
		        choose_this_point(999,results[0].geometry.location,address,"geocode_address"," ");
		      } else {
		        	alert("Geocode was not successful for the following reason: " + status);
		      }
		    });

		}
	});
	
	/******* FOR CALCULATING THE MIN ROUTE *********/
	$(document).on("click","#calculate_min_route", function(){
		
		if ($("#mode_1").val() == "default"){
			if (language == "greek")
				alert("Παρακαλώ επιλέξτε τρόπο μετακίνησης");
			else
				alert("Please select a way of travel");
		}
		else if ($("#mode_2").val() == "default"){
			if (language == "greek")
				alert("Παρακαλώ επιλέξτε τρόπο βελτιστοποίησης");
			else
				alert("Please select a way of optimization");

		}
		else if (source_added == "false" || destination_added == "false"){
			if (language == "greek")
				alert("Παρακαλώ επιλέξτε διαδρομή");
			else
				alert("Please select a route");
		}
		else{
			$("#step2_div").slideUp();
			calcRoute(start_marker.position, end_marker.position, $("#mode_1").val(), $("#mode_2").val());
		}
	});
	
});

function show_step_content_1(val){

	//if (destination_added == "false"){		// destination has not been added

		if (val == "default"){
			$(".step1").fadeOut(600);
		}
		else if (val == "choose_by_point_1"){
			$("#choose_by_address_1").fadeOut(0);
			$("#choose_by_right_click_1").fadeOut(0);
			$("#choose_by_point_1").fadeIn(600);
		}
		else if (val == "choose_by_right_click_1"){
			$("#choose_by_point_1").fadeOut(0);
			$("#choose_by_address_1").fadeOut(0);
			$("#choose_by_right_click_1").fadeIn(600);
		}
		else if (val == "choose_by_address_1"){
			$("#choose_by_point_1").fadeOut(0);
			$("#choose_by_right_click_1").fadeOut(0);
			$("#choose_by_address_1").fadeIn(600);
		}



}
function show_step_content_2(val){

	if (source_added == "true" || flag_2 == "false"){ 			// source has been added
		if (val == "default"){
			$(".step2").fadeOut(600);
		}
		else if (val == "choose_by_point_2"){
			$("#choose_by_address_2").fadeOut(0);
			$("#choose_by_right_click_2").fadeOut(0);
			$("#choose_by_point_2").fadeIn(600);
		}
		else if (val == "choose_by_right_click_2"){
			$("#choose_by_point_2").fadeOut(0);
			$("#choose_by_address_2").fadeOut(0);
			$("#choose_by_right_click_2").fadeIn(600);
		}
		else if (val == "choose_by_address_2"){
			$("#choose_by_point_2").fadeOut(0);
			$("#choose_by_right_click_2").fadeOut(0);
			$("#choose_by_address_2").fadeIn(600);
		}
		
	}
	
}

function calcRoute(pos1, pos2, mode1, mode2) {
	
	route_exists = "true";
	step_3_go_back = "false";
	$(".directions_div_btn_2").css("opacity","0.6");
	route_mode = mode1;
	
	var request = {
		origin:pos1,
		destination:pos2,
		provideRouteAlternatives:true,
		travelMode: google.maps.TravelMode[mode1]
	};
	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {

			directionsDisplay.setDirections(result);

			for (var i = 0, len = result.routes.length; i < len; i++){
				dirDis.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
                    map: map,
                    directions: result,
                    routeIndex: i,
                    suppressMarkers: true,
                    polylineOptions: {
				      // strokeColor: "green",
				      strokeOpacity: 0.4,
    				  strokeWeight: 3
				    } 
                }));
                data[i] = result.routes[i];
			}
			map.setZoom(13);
			map.panBy(-200, 0);
		}
	});
	
	directionsDisplay.setMap(map);
	
	$("#step2_div").slideUp();
	$("#step3_div").fadeIn(500);
	
	$("#current_route").empty();
	directionsDisplay.setPanel(document.getElementById('current_route'));		// append results to current route

	if(language == "greek")
		selected_route = "διαδρομής";
	else
		selected_route = "route";

	$("#send_a_route_div").fadeOut(0);

	// SAVE THE ROUTE'S RESULTS TO DATABASE 
  	
  	var route_start_point_a = $("#source_address").html();
	route_source_point_address = route_start_point_a;
	var route_end_point_a = $("#destination_address").html();
	route_destination_point_address = route_end_point_a;

	var route_way_of_transp = $("#mode_1").val();
	var route_optimization_way = $("#mode_2").val();
	var route_time = $("#route_time").val();
	
	$.ajax({
		type: "get",
		url: "php/save_route.php",
		data: {"route_start_point":route_start_point_a , "route_end_point":route_end_point_a, "route_way_of_transp": route_way_of_transp,"route_optimization_way":route_optimization_way, "route_time":route_time },
		success : function(data) {
			alert(data);
		}
	});

	

}

function initialize() {
	detectBrowser();
	var mapOptions = {
		zoom: 15,
		center: new google.maps.LatLng(39.369288,22.943531),
		zoomControl: true,
		panControl: false,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.DEFAULT,
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		mapTypeControl: false,
		disableDefaultUI: true,
        styles: [	{		featureType:'water',		stylers:[{color:'#46bcec'},{visibility:'on'}]	},{		featureType:'landscape',		stylers:[{color:'#f2f2f2'}]	},{		featureType:'road',		stylers:[{saturation:-100},{lightness:45}]	},{		featureType:'road.highway',		stylers:[{visibility:'simplified'}]	},{		featureType:'road.arterial',		elementType:'labels.icon',		stylers:[{visibility:'off'}]	},{		featureType:'administrative',		elementType:'labels.text.fill',		stylers:[{color:'#444444'}]	},{		featureType:'transit',		stylers:[{visibility:'off'}]	},{		featureType:'poi',		stylers:[{visibility:'off'}]	}]
	};
	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	google.maps.event.addListener(map,"click", function() {
		InfoWindow.close();
	});
	/* WHEN USER CLICKS RIGHT CLICK ON THE MAP */
	google.maps.event.addListener(map, 'rightclick', function(event) {

		/********* MUST WORK ONLY IF MENU IS OPEN *************/
		if ($("nav").hasClass( "gn-open-all" )){
			if (source_added == "false" || destination_added == "false") {

				var lat = event.latLng.lat();
			    var lng = event.latLng.lng();
			    var latlng = new google.maps.LatLng(lat, lng);
			    var address_p = "(" + lat +","+lng +")"; 
			    map.setCenter(latlng);
			  
		        var marker = new google.maps.Marker({
		            map: map,
	                id:lat+","+lng,
		            position: event.latLng,
		            draggable: true,
		            animation: google.maps.Animation.DROP
		        });

	            if  (source_added == "false"){
					marker.setIcon("img/dd-start.png");
					
	            }
				else if (destination_added == "false"){
					marker.setIcon("img/dd-start.png");
					
				}
		        setTimeout(function() {
					InfoWindow.close();
				}, 0);

				marker.setMap(map);
				showMarker.push(marker);
		       
				google.maps.event.addListener(map,"click", function() {
					InfoWindow.close();
				});

				google.maps.event.addListener(marker, 'dragend', function() { 
					InfoWindow.close();
					geocodeNewPosition(marker);
					
				});

				/****************** Reverse Geocoding ***************/
				var marker_address = "";
				geocoder.geocode({'latLng': latlng}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
				    	if (results[0]){ 
		       				marker_address = results[0].formatted_address;
		       				
		       				google.maps.event.addListener(marker, 'click', function() {
								InfoWindow.setContent(marker_address);
					            InfoWindow.open(marker.get('map'), marker);
					        });
		       				choose_this_point(999,address_p,marker_address,"non_geοcode_address"," ");
						}else{ 
				        	alert('No results found');
				      	}
				    }else{
			      		alert('Geocoder failed due to: ' + status);
				    }
				    
				 });

				
			}
	    }
	});

	new google.maps.places.Autocomplete(
	    (document.getElementById('search_by_location_1')), {
	        types: ['geocode']
    });
	new google.maps.places.Autocomplete(
	    (document.getElementById('search_by_location_2')), {
	        types: ['geocode']
    });
	var container = (document.getElementById('container'));
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(container);
	//var autocomplete = new google.maps.places.Autocomplete(input);
	//autocomplete.bindTo('bounds', map);
	
	var auto_infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	$('#pac-input').val("");
	$('#guide').prop('selectedIndex',0);
	$('#route').prop('selectedIndex',0);
}

function showBounds() {
	downloadUrl("php/bounds.php", function(data) {
		
		//--------------------------------------------------
		var data = new XMLHttpRequest(); 
		data.open("GET", "php/bounds.php", false); 
		data.overrideMimeType("text/xml");
		data.send(null);
		//--------------------------------------------------
		var xml = data.responseXML;
		var markers = xml.documentElement.getElementsByTagName("marker");
		var polygonCoords = [];
		for (var i = 0; i < markers.length; i++) {	// iterate through all markers
			var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("lat")),
				parseFloat(markers[i].getAttribute("lng")));
			//var marker = createMarker(id,name,point,address,telephone,website,val);	 //create the marker and attach its content
			polygonCoords.push(point);
			//google.maps.event.trigger(marker,"click");
		}
		bound_polygon = new google.maps.Polygon({
			paths: polygonCoords,
			strokeColor: 'green',
			strokeOpacity: 0.3,
			strokeWeight: 0.7,
			fillColor: 'green',
			fillOpacity: 0.15
		});

		bound_polygon.setMap(map);
		
		addListenersOnPolygon(bound_polygon);
	});
	
	var addListenersOnPolygon = function(polygon) {
		google.maps.event.addListener(polygon, 'rightclick', function (event) {
			/********* MUST WORK ONLY IF MENU IS OPEN *************/
			if ($("nav").hasClass( "gn-open-all" )){
				if (source_added == "false" || destination_added == "false") {
					var lat = event.latLng.lat();
					var lng = event.latLng.lng();
					var latlng = new google.maps.LatLng(lat, lng);
					var address_p = "(" + lat +","+lng +")"; 
					map.setCenter(latlng);
				  
					var marker = new google.maps.Marker({
						map: map,
						id:lat+","+lng,
						position: event.latLng,
						draggable: true,
						animation: google.maps.Animation.DROP
					});
					if  (source_added == "false"){
						marker.setIcon("img/dd-start.png");
						//start.push(marker);
					}
					else if (destination_added == "false"){
						marker.setIcon("img/dd-start.png");
						//end.push(marker);
					}
					setTimeout(function() {
						InfoWindow.close();
					}, 0);

					marker.setMap(map);
					showMarker.push(marker);
				   
					google.maps.event.addListener(map,"click", function() {
						InfoWindow.close();
					});

					google.maps.event.addListener(marker, 'dragend', function() { 
						
						InfoWindow.close();
						geocodeNewPosition(marker);
						
					});

					/****************** Reverse Geocoding ***************/
					var marker_address = "";
					geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]){ 
								marker_address = results[0].formatted_address;
								
								google.maps.event.addListener(marker, 'click', function() {
									InfoWindow.setContent(marker_address);
									InfoWindow.open(marker.get('map'), marker);
								});
								choose_this_point(999,address_p,marker_address,"non_geοcode_address"," ");
							}else{ 
								alert('No results found');
							}
						}else{
							alert('Geocoder failed due to: ' + status);
						}
						
					 });

					
				}
			}
		});  
	}

	// Makes the AJAX request to retrieve markers
	function downloadUrl(url, callback) {
		var request = window.ActiveXObject ?
		new ActiveXObject('Microsoft.XMLHTTP') :
		new XMLHttpRequest;

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				request.onreadystatechange = doNothing;
				callback(request, request.status);
			}
		};
		
		request.open('GET', url, true);
		request.send(null);
	}
	  
	function doNothing() {}
}

// This function will be excecuted when a marker is been dragged
function geocodeNewPosition(marker) {

	geocoder.geocode({
	    latLng: marker.getPosition()
	  }, function(responses) {
	    if (responses && responses.length > 0) {

	      	var marker_new_address = responses[0].formatted_address;
			google.maps.event.addListener(marker, 'click', function() {
				InfoWindow.setContent(marker_new_address);
	            InfoWindow.open(marker.get('map'), marker);
	        });
	        var lat = responses[0].geometry.location.lat();
    		var lng = responses[0].geometry.location.lng();

	        	
        	$("#source_address").empty().append(marker_new_address);
				
			// Update the values of the currently selected route
		   	source_id = lat + "," + lng;		// the new source id
		   	marker.id = source_id;
			route_source_point = marker.id;
		
			// Source marker
		   	for (var i=0; i<showMarker.length; i++) {
				// Don't hide the source and destination markers
				if (showMarker[i]["id"] == source_id){
					start_marker = showMarker[i];
					showMarker[i].setIcon("img/dd-start.png");
					break;
				}
			}
			// The above code must be executed only if a route has been created
			if (route_exists === "true") {

				if (no_saved_route == "true"){	

					calc_new_route = "true";
					var json_data = {};			

					json_data["route_id"] = 0;
					json_data["source_point"] = route_source_point;
					json_data["destination_point"] = route_destination_point;
					json_data["source_point_address"] = route_source_point_address;
					json_data["destination_point_address"] = route_destination_point_address;
					json_data["mode"] = route_mode;
					saved_routes_tmp_dict.push(json_data);

					//first_saved_route = "false";

					// Read the data created by the calcRoute function
					saved_routes_tmp_dict[0].source_point = source_id;
				    saved_routes_tmp_dict[0].route_source_point_address = marker_new_address;
				  	
					var this_route_source_point = source_id;		// the new source id
					var this_route_destination_point = saved_routes_tmp_dict[0].destination_point;	// BUG
					var this_route_mode = saved_routes_tmp_dict[0].mode;
					
					// Remove the existed routes from the map
					for(var i=0; i<dirDis.length; i++) {
						dirDis[i].setMap(null);
					}
					// Calculate the new route
					calcRoute(this_route_source_point,this_route_destination_point,this_route_mode,"mode_2");
					saved_routes_tmp_dict = [];
				}
				else if(step_3_go_back == "false"){
				
					
					// Read the data created by the calcRoute function
					saved_routes_dict[parseInt(currently_selected_route)-1].source_point = source_id;
				    saved_routes_dict[parseInt(currently_selected_route)-1].route_source_point_address = marker_new_address;
				  	
					var this_route_source_point = source_id;		// the new source id
					var this_route_destination_point = saved_routes_dict[parseInt(currently_selected_route)-1].destination_point;	// BUG
					var this_route_mode = saved_routes_dict[parseInt(currently_selected_route)-1].mode;
					
					// Remove the existed routes from the map
					for(var i=0; i<dirDis.length; i++) {
						dirDis[i].setMap(null);
					}
					// Calculate the new route
					calcRoute(this_route_source_point,this_route_destination_point,this_route_mode,"mode_2");

				}

			}

				
		}
				

					
					
					
				// }
			
	        // else if (marker.id == destination_id){
	   //      	$("#destination_address").empty().append(marker_new_address);

	   //      	if (step_3_go_back == "true"){
				// 	// Update the values of the currently selected route
				//    	destination_id = lat + "," + lng;
				//     saved_routes_dict[parseInt(currently_selected_route)-1].destination_point = destination_id;
				// 	saved_routes_dict[parseInt(currently_selected_route)-1].route_source_point_address = marker_new_address;

				// 	marker.id = destination_id;

				//   	for (var i=0; i<showMarker.length; i++) {
				// 		// Don't hide the source and destination markers
				// 		if (showMarker[i]["id"] == destination_id){
				// 			end_marker = showMarker[i];
				// 			showMarker[i].setIcon("img/dd-end.png");
				// 			break;
				// 		}
				// 	}
				   
				// }
	        // }
	        /*var lat = responses[0].geometry.location.lat();
		    var lng = responses[0].geometry.location.lng();
		    var address_p = "(" + lat +","+lng +")";
			choose_this_point(999,address_p,marker_new_address,"non_geοcode_address"," ");*/

	    // } else {
	    //  	alert("Παρακαλώ προσπαθήστε πάλι");
	    // }
	    


  	});
	

}

function detectBrowser() {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map-canvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	}
	else {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	}
}


function show(val) {
	map.setCenter(new google.maps.LatLng(39.369288,22.943531));
	map.setZoom(15);
	$("#line_options_div").fadeOut(700); // hide the line options div
	//line.setMap(null);	// remove the line from the map	

	InfoWindow.close();
	for (var i=0; i<showMarker.length; i++) {
		// Don't hide the source and destination markers
		if (showMarker[i]["id"] == source_id || showMarker[i]["id"] == destination_id)
			continue;
		else
			showMarker[i].setVisible(false);
	}
	for (var i=0; i<showBus.length; i++) {
		showBus[i].setVisible(true);
	}
	downloadUrl("php/emfanishmarkers.php?val=" +val, function(data) {
		
		//--------------------------------------------------
		var data = new XMLHttpRequest(); 
		data.open("GET", "php/emfanishmarkers.php?val=" +val, false); 
		data.overrideMimeType("text/xml");
		data.send(null);
		//--------------------------------------------------
		var xml = data.responseXML;
		var markers = xml.documentElement.getElementsByTagName("marker");

		for (var i = 0; i < markers.length; i++) {	// iterate through all markers
			var id = markers[i].getAttribute("id");
			var name = markers[i].getAttribute("name");
			var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("lat")),
				parseFloat(markers[i].getAttribute("lng")));
			var address = markers[i].getAttribute("address");
			var telephone = markers[i].getAttribute("telephone");
			var website = markers[i].getAttribute("website");
			var marker = createMarker(id,name,point,address,telephone,website,val);	 //create the marker and attach its content
			
			google.maps.event.trigger(marker,"click");
		}
		map.setCenter(new google.maps.LatLng(39.369288,22.943531));		// last marker
	});

	// Makes the AJAX request to retrieve markers
	function downloadUrl(url, callback) {
		var request = window.ActiveXObject ?
		new ActiveXObject('Microsoft.XMLHTTP') :
		new XMLHttpRequest;

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				request.onreadystatechange = doNothing;
				callback(request, request.status);
			}
		};
		
		request.open('GET', url, true);
		request.send(null);
	}
	  
	function doNothing() {}
}
		
function createMarker(id, name, point, address, telephone, website, val) {
	
	var marker = new google.maps.Marker({
		position: point,
		id:point["k"]+","+point["D"],
		draggable: false,
		animation: google.maps.Animation.DROP
	});

	var source = "non_geοcode_address";
	
	if (!website) {
		var txt = "<div class='marker_content'><b>" + name + "</b><br>" + 
					"<b>"+ address + "</b><br><br>" + 
					"<br><div class='icon_text'>"+
						"<div class='icon'> <img src = 'img/tel_icon.png' height='20' width='20'></div>" + 
						"<div class='text'>"+telephone +"</div>"+
					"</div><br><br>"+
					"<button class='button_1' onclick='choose_this_point(\"" + id + "\", \""+point+ "\", \""+address +  "\", \""+source + "\", \""+name +"\")'> Επιλογή σημείου </button></div>";

	}
	
	else {

		var txt = "<div class='marker_content'><b>" + name + "</b><br>" + 
					"<b>"+ address + "</b><br><br>" + 
					"<div class='icon_text'>"+
						"<div class='icon'> <img src = 'img/tel_icon.png' height='20' width='20'></div>" + 
						"<div class='text'>"+telephone +"</div>"+
					"</div><br>"+
					"<div class='icon_text'>"+
						"<div class='icon'> <img src = 'img/url_icon.png' height='20' width='20'></div>" + 
						"<div class='text link'><a target='blank' href="+website+">"+website+"</a></div>"+
					"</div><br><br>"+
					"<button class='button_1' onclick='choose_this_point(\"" + id + "\", \""+point+ "\", \""+address +  "\", \""+source + "\", \""+name +"\")'> Επιλογή σημείου </button></div>";
	}
	
	// Marker click event
	google.maps.event.addListener(marker,"click", function() {
		
		if (this.id == source_id && flag_2 == "true"){
			marker.setIcon("img/dd-start.png");
		}
		else if (this.id == source_id && flag_2 == "false")
			marker.setIcon("img/dd-end.png");
		else if (this.id == destination_id && flag_2 == "true")
			marker.setIcon("img/dd-end.png");
		else if (this.id == destination_id && flag_2 == "false")
			marker.setIcon("img/dd-start.png");
		else{
			if (val == "grade1") {
				marker.setIcon("img/school.png");
			}
			else if( val == "grade2"){
				marker.setIcon("img/school_2.png");
			}
			else if( val == "grade3"){
				marker.setIcon("img/school_3.png");
			}
			else if( val == "other"){
				marker.setIcon("img/school_4.png");
			}
			else if (val == "car") {
				marker.setIcon("img/carrental.png");
			}
			else if (val == "church") {
				marker.setIcon("img/icon-sevilla.png");
			}
			else if (val == "culture") {
				marker.setIcon("img/mural.png");
			}
			else if (val == "health") {
				marker.setIcon("img/hospital-building.png");
			}
			else if (val == "hotel") {
				marker.setIcon("img/hotel_0star.png");
			}
			else if (val == "museum") {
				marker.setIcon("img/art-museum-2.png");
			}
			else if (val == "parking") {
				marker.setIcon("img/parkinggarage.png");
			}
			else if (val == "public") {
				marker.setIcon("img/communitycentre.png");
			}
			else if (val == "sports") {
				marker.setIcon("img/basketball.png");
			}
			else if (val == "taxi") {
				marker.setIcon("img/taxi.png");
			}
			else if (val == "terminal") {
				marker.setIcon("img/begrenzungspfahl_poller.png");
			}
		}

		InfoWindow.setContent(txt);
		InfoWindow.open(map,marker);
	});
	
	setTimeout(function() {
		InfoWindow.close();
	}, 0);

	marker.setMap(map);
	
	showMarker.push(marker);
	google.maps.event.addListener(map,"click", function() {
		InfoWindow.close();
	});
	google.maps.event.addListener(marker, 'dragend', function() { 
		
		
			InfoWindow.close();
			geocodeNewPosition(marker);
	
	});
	return marker;
}

function createBusStop(id, name, point, direction, number, code, val, flag) {
	var marker = new google.maps.Marker({
		position: point,
		id:point["k"]+","+point["D"],
		draggable: false,
		animation: google.maps.Animation.DROP
	});
	var busPlus = [];
	google.maps.event.addListener(marker,"click", function() {
		downloadUrl("php/plus_routes.php?code=" +code, function(data) {
			
			//--------------------------------------------------
			var data = new XMLHttpRequest(); 
			data.open("GET", "php/plus_routes.php?code=" +code, false); 
			data.overrideMimeType("text/xml");
			data.send(null);
			//--------------------------------------------------
			var xml = data.responseXML;
			var routes = xml.documentElement.getElementsByTagName("route");

			for (var i = 0; i < routes.length; i++) {	// iterate through all routes
				var bus_route = routes[i].getAttribute("bus_route");
				busPlus.push(bus_route);
			}
		});

		// Makes the AJAX request to retrieve markers
		function downloadUrl(url, callback) {
			var request = window.ActiveXObject ?
			new ActiveXObject('Microsoft.XMLHTTP') :
			new XMLHttpRequest;

			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					request.onreadystatechange = doNothing;
					callback(request, request.status);
				}
			};
			
			request.open('GET', url, true);
			request.send(null);
		}
		  
		function doNothing() {}
		
		if (this.id == source_id && flag_2 == "true"){
			marker.setIcon("img/dd-start.png");
		}
		else if(this.id == source_id && flag_2 == "false"){
			marker.setIcon("img/dd-end.png");
		}
		else if (this.id == destination_id && flag_2 == "true"){
			marker.setIcon("img/dd-end.png");
		}
		else if (this.id == destination_id && flag_2 == "false"){
			marker.setIcon("img/dd-start.png");
		}
		else{
			marker.setIcon("img/other_marker.png");
		}
		
		var source = "non_geοcode_address";
		
		var txt = "<u><b>Όνομα στάσης</b></u>" + 
					"<br>" + name + "<br>" + 
					"<u><b>Αριθμός γραμμής</b></u>" + "<br>" + number + "<br>" + "<u><b>Κωδικός Στάσης</b></u>" + 
					"<br>" + code + "<br>"+
					"<u><b>Γραμμές που περνάνε από εδώ</b></u>" + "<br><b>" + busPlus + "</b><br><br>" + 
					"<button class='button_1' onclick='choose_this_point(\"" + id + "\", \""+point+ "\", \""+code +  "\", \""+source + "\", \""+name +"\")'> Επιλογή σημείου</button>";

		//var txt = '<u><b>Name</b></u>' + '<br>' + name + '<br>' + '<u><b>Bus Route</b></u>' + '<br>' + number + '<br>' + '<u><b>Bus Stop Code</b></u>' + '<br>' + code+ '<br><br> <button onclick="choose_this_point('+id+","+point+","+code+')"> Choose this point </button>';

		InfoWindow.setContent(txt);
		InfoWindow.open(map,marker);
	});
	
	setTimeout(function() {
		InfoWindow.close();
	}, 0);

	marker.setMap(map);
	showMarker.push(marker);	
	if (flag == 0) {
		showBus.push(marker);
	}
	else if (flag == 1) {
		showInvBus.push(marker);
	}
	
	//route[point["k"]+","+point["b"]] = marker;

	google.maps.event.addListener(map,"click", function() {
		InfoWindow.close();
	});
	google.maps.event.addListener(marker, 'dragend', function() {
		
			
			InfoWindow.close();
			geocodeNewPosition(marker);
	
	});


	return marker;
}

function change_addresses(){

	// if both source address and destination address have been not added, return
	if (source_added == "false" && destination_added == "false")
		return;
	
	if (change_addresses_flag == 0){
		if (source_added == "true"){	// source exists
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == source_id ){
					showMarker[i].setIcon("img/dd-end.png");	// the source with go down
					flag_2 = "false";
					break;	// exit foor loop
				}
			}
		}
		if (destination_added == "true"){	// destination exists
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == destination_id ){	// destination
					showMarker[i].setIcon("img/dd-start.png");	// the destination with go up
					break;
				}
			}
		}
		change_addresses_flag = 1;
	}
	else{
		if (source_added == "true"){	// source exists
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == source_id ){
					showMarker[i].setIcon("img/dd-start.png");	// the source with go up
					flag_2 = "true";
					break;	// exit foor loop
				}
			}
		}
		if (destination_added == "true"){	// destination exists
			for (var i=0; i<showMarker.length; i++) {
				if (showMarker[i]["id"] == destination_id ){	// destination
					showMarker[i].setIcon("img/dd-end.png");	// the destination with go down
					break;
				}
			}
		}
		change_addresses_flag = 0;
	}


	// CHANGE THE ADDRESSES
	$source_address = $("#source_address_div").html();
	$destination_address = $("#destination_address_div").html();
	
	$("#source_address_div").empty().append($destination_address);
	$("#destination_address_div").empty().append($source_address);

	
}

function choose_this_point(marker_id,marker_pos,address,source,name){
	
	if(source_added == "true" && destination_added == "true"){ 	// if both source and desntination have been initilized, do nothing
		// $("#step2_div").hide();
		return;
	}

	var address_added_1 = $.trim($("#destination_address").text());
	var address_added_2 = $.trim($("#source_address").text());

	if (address_added_1 == name+"-"+address || address_added_2 == name+"-"+address){
		// alert("Παρακαλώ επιλέξτε ένα διαφορετικό σημείο");
		return;
	}
	total_addresses++;
	var marker_pos_parts;
	
	if (source === "non_geοcode_address"){
		marker_pos_parts = marker_pos.split(",");
	}	
	var source_link_id;
	var dest_link_id;

	if(!$.trim($("#source_address").html()).length) {			// source is empty  
		
		if (name == " "){
			$("#source_address").empty().append(address);
		}
		else{
			$("#source_address").empty().append(name+"-"+address);
		}
		source_added = "true";
		$("#directions_div").slideDown();
		$(".item_with_options").css("color","#5f6f81");
		$(".item_with_options").css("font-weight","normal");
		if (language == "greek")
			$(".menu_selected_item").empty().append("-Διάλεξε σημείο-");
		else
			$(".menu_selected_item").empty().append("-Choose point-");
		if (source == "non_geοcode_address"){
			source_id = marker_pos_parts[0].replace("(","")+","+marker_pos_parts[1].replace(")","").replace(/ /g,'');
			source_link_id = marker_pos_parts[0].replace("(","")+","+marker_pos_parts[1].replace(")","").replace(/ /g,'');
			
		}
		else{
			source_id = marker_pos["k"]+","+marker_pos["D"];
			source_link_id = marker_pos["k"]+","+marker_pos["D"];
			
		}
		route_source_point = source_id;
		
		
		for (var i=0; i<showMarker.length; i++) {
			if (showMarker[i]["id"] == source_id ){
				if (flag_2 == "true"){
					showMarker[i].setIcon("img/dd-start.png");
					//start.push(showMarker[i]);					// SAVE SOURCE MARKER
					start_marker = showMarker[i];
				}
				else{
					showMarker[i].setIcon("img/dd-end.png");
					//end.push(showMarker[i]);		
					end_marker = showMarker[i];						// SAVE DESTINATION MARKER
				}
			}
		}
		
		$("#source_point").next().attr("id",source_id);

		$("#show_step_content_1").prop('disabled', true);
		$("#show_step_content_1").css('border', '2px solid red');
		$("#show_step_content_1").css('opacity', '0.5');

		if (destination_added == "false"){
			$("#show_step_content_2").prop('disabled', false);
			$("#show_step_content_2").css('border', '2px solid #00CF00');
			$("#show_step_content_2").css('opacity', '1');
		}
		else{
			$("#show_step_content_2").prop('disabled', true);
			$("#show_step_content_2").css('border', '2px solid red');
			$("#show_step_content_2").css('opacity', '0.5');

		}
		


	}else {						// desination is empty
		
		if (source === "non_geοcode_address"){
			destination_id = marker_pos_parts[0].replace("(","")+","+marker_pos_parts[1].replace(")","").replace(/ /g,'');
			dest_link_id = marker_pos_parts[0].replace("(","")+","+marker_pos_parts[1].replace(")","").replace(/ /g,'');
		}
		else{
			destination_id = marker_pos["k"]+","+marker_pos["D"];
			dest_link_id = marker_pos["k"]+","+marker_pos["D"];
			
		}
		if (destination_id != source_id) {
			if (name == " "){
				
				$("#destination_address").empty().append(address);
				
			}
			else{
				//console.log("add to source");
				$("#destination_address").empty().append(name+"-"+address);
				
			}
			destination_added = "true";
			$("#directions_div").slideDown();
			
		}

		route_destination_point = destination_id;
		
		for (var i=0; i<showMarker.length; i++) {
			if (showMarker[i]["id"] == destination_id ){
				if (flag_2 == "true"){
					showMarker[i].setIcon("img/dd-end.png");
					//end.push(showMarker[i]);				// SAVE DESTINATION MARKER
					end_marker = showMarker[i];
				}
				else{
					showMarker[i].setIcon("img/dd-start.png");
					//start.push(showMarker[i]);				// SAVE SOURCE MARKER
					start_marker = showMarker[i];
				}
			}
		}
		// set destination id
		$("#destination_point").next().attr("id",dest_link_id);

		$("#show_step_content_2").prop('disabled', true);
		$("#show_step_content_1").prop('disabled', false);
	}

	// hide all markers except the current one
	for (var i=0; i<showMarker.length; i++) {
		if(showMarker[i]["id"] == marker_id+address || showMarker[i]["id"] == source_id || showMarker[i]["id"] == destination_id){
			continue;
		}
	 	else{
	 		showMarker[i].setVisible(false);
	 	}
	}
	// $("#directions_div").slideDown();	// show the directions div
	// $("#from_options_div").slideUp();

	if (step_3_go_back == "false"){ 
		if(source_added == "true"){
		 	$("#to_options_div").slideDown();
		}
		if(source_added == "true" && destination_added == "true"){
			
			$("#line_options_div").fadeOut(700); 		// hide the line options div
			$("#step1_div").slideUp();
			$("#step2_div").slideDown();
		 	
		}


	}
	
	if(source_added == "true" || destination_added=="true"){
		$("#line_options_div").fadeOut(700); 		// hide the line options div
	}
	if (flag33 == 1)
		line.setMap(null);	// remove the line from the map	
	
}			

function routes(val) {
	map.setCenter(new google.maps.LatLng(39.369288,22.943531));
	map.setZoom(15);
	var z = 0;
	clearInterval(myVar);
	flag44 = 1;
	if (val == "default"){
		$("#line_options_div").fadeOut(700); // hide the line options div
	}
	else{
		$("#line_options_div").fadeIn(700); // hide the line options div
	}
	for (var i=0; i<showBus.length; i++) {
		if (showBus[i]["id"] == source_id || showBus[i]["id"] == destination_id ){
			continue;
		}
		else{
			showBus[i].setVisible(false);
		}
	}
	for (var i=0; i<showInvBus.length; i++) {
		showInvBus[i].setVisible(false);
	}
	showBus = [];
	showInvBus = [];
	if (flag33 == 1) {
		line.setMap(null);
	}
	InfoWindow.close();
	for (var i=0; i<route.length; i++) {
		if (i == source_id || i == destination_id)
			continue;
		else
			route[i].setVisible(false);
	}
	downloadUrl("php/routes.php?val=" +val, function(data) {
		//--------------------------------------------------
		var data = new XMLHttpRequest(); 
		data.open("GET", "php/routes.php?val=" +val, false); 
		data.overrideMimeType("text/xml");
		data.send(null);
		//--------------------------------------------------
		var xml = data.responseXML;
		var markers = xml.documentElement.getElementsByTagName("marker");
	
		for (var i = 0; i < markers.length; i++) {
			var id = markers[i].getAttribute("id");
			var name = markers[i].getAttribute("name");
			var number = markers[i].getAttribute("bus_route");
			var code = markers[i].getAttribute("stop_code");
			var direction = markers[i].getAttribute("direction");
			var point = new google.maps.LatLng(
				parseFloat(markers[i].getAttribute("lat")),
				parseFloat(markers[i].getAttribute("lng")));
			var marker = createBusStop(id,name,point,direction,number,code,val,0);
			google.maps.event.trigger(marker,"click");
		}
		map.setCenter(new google.maps.LatLng(39.369288,22.943531));
		if (val != "routes") {
			lineCoordinates = [];
			for(var i=0; i<showBus.length; i++) {
				lineCoordinates.push(showBus[i].position);
			}

			// Define the symbol, using one of the predefined paths ('CIRCLE')
			// supplied by the Google Maps JavaScript API.
			lineSymbol = {
				path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
				scale: 4,
				strokeColor: 'green'
			};

			// Create the polyline and add the symbol to it via the 'icons' property.
			line = new google.maps.Polyline({
				path: lineCoordinates,
				icons: [{
					icon: lineSymbol,
					offset: '100%'
				}],
				strokeColor: 'blue',
				map: map
			});
			flag33 = 1;
		}
		showBus[0].setIcon("img/pin-green.png");
		for (var i=0; i<showBus.length; i++) {
			z = z + 1;;
		}
		showBus[z-1].setIcon("img/pin-red.png");
		animateCircle();
	});
	
	function downloadUrl(url, callback) {
		var request = window.ActiveXObject ?
		new ActiveXObject('Microsoft.XMLHTTP') :
		new XMLHttpRequest;

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				request.onreadystatechange = doNothing;
				callback(request, request.status);
			}
		};
		
		request.open('GET', url, true);
		request.send(null);
	}
	
	function doNothing() {}
}

function change_route_direction(val) {
	var z = 0;
	for (var i=0; i<showBus.length; i++) {
		showBus[i].setVisible(false);
		InfoWindow.close();
	}
	for (var i=0; i<showInvBus.length; i++) {
		showInvBus[i].setVisible(false);
	}
	clearInterval(myVar);
	line.setMap(null);
	InfoWindow.close();
	lineCoordinates = [];

	if (flag44 == 1) {
		downloadUrl("php/inv_routes.php?val=" +val, function(data) {
			//--------------------------------------------------
			var data = new XMLHttpRequest(); 
			data.open("GET", "php/inv_routes.php?val=" +val, false); 
			data.overrideMimeType("text/xml");
			data.send(null);
			//--------------------------------------------------
			var xml = data.responseXML;
			var markers = xml.documentElement.getElementsByTagName("marker");
			
			for (var i = 0; i < markers.length; i++) {
				var id = markers[i].getAttribute("id");
				var name = markers[i].getAttribute("name");
				var number = markers[i].getAttribute("bus_route");
				var code = markers[i].getAttribute("stop_code");
				var direction = markers[i].getAttribute("direction");
				var point = new google.maps.LatLng(
					parseFloat(markers[i].getAttribute("lat")),
					parseFloat(markers[i].getAttribute("lng")));
				var marker = createBusStop(id,name,point,direction,number,code,val,1);
				google.maps.event.trigger(marker,"click");
			}
			map.setCenter(new google.maps.LatLng(39.369288,22.943531));
			if (val != "routes") {
				for(var i=0; i<showInvBus.length; i++) {
					lineCoordinates.push(showInvBus[i].position);
				}
				flag44 = 0;
				lineSymbol = {
					path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
					scale: 4,
					strokeColor: 'red'
				};

				// Create the polyline and add the symbol to it via the 'icons' property.
				line.setOptions({
					path: lineCoordinates,
					icons: [{
						icon: lineSymbol,
						offset: '100%',
						strokeColor: 'blue'
					}],
					map: map
				});
			}
			showInvBus[0].setIcon("img/pin-green.png");
			for (var j=0; j<showInvBus.length; j++) {
				z = z + 1;
			}
			showInvBus[z-1].setIcon("img/pin-red.png");
			animateCircle();
		});
	}
	
	else if (flag44 == 0) {
		for (var i=0; i<showBus.length; i++) {
			showBus[i].setVisible(true);
			InfoWindow.close();
		}
		for (var i=0; i<showInvBus.length; i++) {
			showInvBus[i].setVisible(false);
		}
		if (val != "routes") {
			for(var i=0; i<showBus.length; i++) {
				lineCoordinates.push(showBus[i].position);
			}
			flag44 = 2;
			lineSymbol = {
				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
				scale: 4,
				strokeColor: 'green'
			};

			// Create the polyline and add the symbol to it via the 'icons' property.
			line.setOptions({
				path: lineCoordinates,
				icons: [{
					icon: lineSymbol,
					offset: '100%',
					strokeColor: 'blue'
				}],
				map: map
			});
		}
		animateCircle();
	}
	
	else if (flag44 == 2) {
		for (var i=0; i<showBus.length; i++) {
			showBus[i].setVisible(false);
			InfoWindow.close();
		}
		for (var i=0; i<showInvBus.length; i++) {
			showInvBus[i].setVisible(true);
		}
		if (val != "routes") {
			for(var i=0; i<showInvBus.length; i++) {
				lineCoordinates.push(showInvBus[i].position);
			}
			flag44 = 0;
			lineSymbol = {
				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
				scale: 4,
				strokeColor: 'red'
			};

			// Create the polyline and add the symbol to it via the 'icons' property.
			line.setOptions({
				path: lineCoordinates,
				icons: [{
					icon: lineSymbol,
					offset: '100%',
					strokeColor: 'blue'
				}],
				map: map
			});
		}
		animateCircle();
	}
	
	function downloadUrl(url, callback) {
		var request = window.ActiveXObject ?
		new ActiveXObject('Microsoft.XMLHTTP') :
		new XMLHttpRequest;

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				request.onreadystatechange = doNothing;
				callback(request, request.status);
			}
		};
		
		request.open('GET', url, true);
		request.send(null);
	}
	
	function doNothing() {}
}

function animateCircle() {
    var count = 0;
    myVar = window.setInterval(function() {
      count = (count + 8) % 1600;

      var icons = line.get('icons');
      icons[0].offset = (count / 16) + '%';
      line.set('icons', icons);
	}, 160);
}

function createInputMarker(point,icon) {
	var marker = new google.maps.Marker({
		position: point,
		map: map,
		icon: icon,
		draggable:false
	});
	
	marker.setMap(map);
	
	if (icon == "img/dd-end.png") {
		var selectedMode = document.getElementById('mode').value;
		var request = {
			origin:path[0],
			destination:path[1],
			travelMode: google.maps.TravelMode[selectedMode]
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			}
		});
		directionsDisplay.setMap(map);
		google.maps.event.addListener(marker,"click", function() {
			inInfoWindow.open(map,marker);
			directionsDisplay.setMap(map);
		});
		google.maps.event.addListener(marker,"mouseover", function() {
			inInfoWindow.open(map,marker);
		});
	}
}
/************************************** GLOBAL VARIABLES ******************************/
var flag = 0;
var map;                                         // The map object
var geocoder;
var InfoWindow = new google.maps.InfoWindow();   // The content of each marker
var showMarker = [];                             // The main markers of the selected route
var showBus = [];
var showInvBus = [];
var route = {};
var language;                                     // The currently selected language

var menu = new gnMenu(document.getElementById('gn-menu'));
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
var data = [];
var saved_routes = 0;
var saved_routes_counter = 0;
var calc_new_route = "false";
var route_exists = "false";
var first_saved_route = "true";
var selected_route = "null";
var first_time = true;
var flag33 = 0;
var total_addresses = 0;
var lineCoordinates = [];
var myVar;
var flag44 = 1;
var start = [];
var start_marker;
var end = [];
var end_marker;
var flag_2 = "true";	                        // if true, source address is up inside the directions div, otherwise is down
var change_addresses_flag = 0;
var source_added = "false";		                // if true, source address has been added, otherwise hasn't
var destination_added = "false";	            // if true, desstination address has been added, otherwise hasn't
var all_options_btn_1_flag = 0;
var all_options_btn_2_flag = 0;
var source_id;		                            // for saving the source address id
var destination_id;		                        // for saving the destination address id
var source_content = "<span id='source_point'></span><a href='#'' class='address'><span id='source_address'></span> </a>";
var destination_content = "<span id='destination_point'></span><a href='#'' class='address'><span id='destination_address'></span> </a>";
var bound_polygon;
var elem_id2;
var dirDis = [];
var start_line_array = [];
var start_line_array_2 = [];
var end_line_array = [];
var end_line_array_2 = [];
var marker_new_address1;
var marker_new_address2;
var saved_routes_dict = [];			// Here will be stored all the routes that have been saved
var saved_routes_tmp_dict = [];		// Here will be stored last temporary route
var this_elem_id;
var route_source_point;
var route_source_point_address;
var route_source_point_address_google;
var route_destination_point;
var route_destination_point_address;
var route_destination_point_address_google;
var route_mode;
var best_route_mode = "no";
var currently_selected_route = 1;
var step_3_go_back = "false";
var no_saved_route = "true";
var save_flag = 0;
var flag_new = 0;
var bound_flag = 0;

var calculated_route_points = [];
var tmp_calc_markers = [];
var oldpath;
var lastIndx = 0;

var min_route_directions = [];
var line;

var dijkstra_current_route_line;
var dijkstra_source_point_address;
var dijkstra_destination_point_address;
var dijkstra_current_route_directions;
var dijkstra_current_route_waypoints = [];
var dijkstra_current_route_points = [];

var dijkstra_route_polyline_end_extra;
var dijkstra_route_polyline_extra = "null";
var dijkstra_route_polyline_start_extra_global;
var dijkstra_route_polyline_start_extra_global_2;
var dijkstra_route_polyline_end_extra_global;
var dijkstra_route_polyline_end_extra_global_2;
var marker_content_array = [];
var dijkstra_route_direction_content = [];
var route_total_time = 0;
var route_total_length = 0;
var bus_codes = [];

var start_directions = [];
var end_directions = [];
var counter_step = 0;
var source_not_exists = false;
var destination_not_exists = false;

var dashed_line = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
};

var start_bus_code;
var end_bus_code;
var start_line_directions_counter;

var route_proc_directions = [];
var dirs = [];
var transit_route_directions = [];
var transit_case_2 = false;
var total_dis = 0;

var directionsDisplay_array = [];
var directionsService_array = [];

var route_start_directions = [];
var route_end_directions = [];
var route_additional_markers = [];
var destination_is_island = false;

var total_dis_timeSTART = [];
var total_dis_timeEND = [];

var unwantedStringGr1 = "Ο προορισμός σας θα βρίσκεται στα αριστερά σας";
var unwantedStringGr2 = "Ο προορισμός σας θα βρίσκεται στα δεξιά σας";
var unwantedStringEn1 = "Destination will be on the left";
var unwantedStringEn2 = "Destination will be on the right";

var dijkstra_current_route_pointsTransitFirst;
var dijkstra_current_route_pointsTransitSecond;
var dijkstra_current_route_pointsTransitThird;
var finalBusCode;
var finalStopName = [];
var directionsLoaded = "false";
/************************************ END GLOBAL VARIABLES ************************************/

$(document).ready(function () {

    // Read the URL path to determine tha language of the page
    var url = window.location.href;
    if (url.indexOf("index_en") > -1)
        language = "english";
    else
        language = "greek";

    $("#show_step_content_1").css('border', '2px solid #00CF00');
    $("#show_step_content_2").css('border', '2px solid red');
    $("#show_step_content_2").css('opacity', '0.5');

    // Enable destination point
    $("#show_step_content_2").prop("disabled", true);

    // The date-time picker plugin configuration
    $('#route_time').datetimepicker({
        // datepicker:true,
        // format:'H:i',
        // dateFormat: "YY/MM/DD h:m",
        // step:1
    });

    // Google map event for resizing current window
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
    // Main Google map event for initializing our map
    google.maps.event.addDomListener(window, 'load', initialize);

    // Mouse up DOM listener
    $(document).mouseup(function (e) {

        var container = $("#all_options_content_1");

        // if the target of the click isn't the container..
        if (!container.is(e.target)
            && container.has(e.target).length === 0)    // Nor a descendant of the container
        {
            container.slideUp();
        }

        var container2 = $("#all_options_content_2");

        // if the target of the click isn't the container..
        if (!container2.is(e.target)
            && container2.has(e.target).length === 0)   // Nor a descendant of the container
        {
            container2.slideUp();
        }
    });
    // When user clicks to choose how to select the source/destination point
    $(document).on("click", ".menu_choice_item", function () {

        var elem_id = this.id;
        if (elem_id == "choose_by_point") {
            if (language == "greek")
                (".menu_selected_item").empty().append("-Διάλεξε σημείο-");
            else
                (".menu_selected_item").empty().append("-Choose point-");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
                InfoWindow.close();
            }
            for (var i = 0; i < showBus.length; i++) {
                showBus[i].setVisible(false);
            }
            for (var i = 0; i < showInvBus.length; i++) {
                showInvBus[i].setVisible(false);
            }
            clearInterval(myVar);
            line.setMap(null);
        }
    });

    // Change language event
    $(document).on("click", ".language", function () {

        var this_language = this.id;
        language = this_language;

        if (this_language == "english")
            window.location.href = "index_en.html";
        else
            window.location.href = "index.html";

    });
    // Ajax starts
    $(document).ajaxStart(function () {

        $("#transparent_div").fadeIn();
        $("#ajax_loader").css("display", "block");
    });
    // Ajax ends
    $(document).ajaxStop(function () {

        $("#transparent_div").fadeOut();
        $("#ajax_loader").css("display", "none");
    });
    // Choose source point from menu
    $(document).on("click", ".menu_item_2_from", function () {

        elem_id2 = this.id;

        if (elem_id2 == "default") {
            if (language == "greek")
                $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
            else
                $(".menu_selected_item_from").empty().append("-Choose point-");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
                InfoWindow.close();
            }
            for (var i = 0; i < showBus.length; i++) {
                showBus[i].setVisible(false);
            }
            for (var i = 0; i < showInvBus.length; i++) {
                showInvBus[i].setVisible(false);
            }
        }
        var menu_selected_item = $(this).text();
        $(".menu_selected_item_from").empty().append(menu_selected_item);

        $(".all_options").slideUp();
        $("#all_options_content_1").slideUp();

        routes(elem_id2);

    });
    // Choose destination point from menu
    $(document).on("click", ".menu_item_2_to", function () {

        elem_id2 = this.id;

        if (elem_id2 == "default") {
            if (language == "greek")
                $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
            else
                $(".menu_selected_item_to").empty().append("-Choose point-");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
                InfoWindow.close();
            }
            for (var i = 0; i < showBus.length; i++) {
                showBus[i].setVisible(false);
            }
            for (var i = 0; i < showInvBus.length; i++) {
                showInvBus[i].setVisible(false);
            }
        }
        var menu_selected_item = $(this).text();
        $(".menu_selected_item_to").empty().append(menu_selected_item);

        $(".all_options").slideUp();
        $("#all_options_content_2").slideUp();

        routes(elem_id2);
    });


    $(document).on("click", ".menu_item_from", function () {

        var elem_id = this.id;
        if (elem_id === "default") {
            if (language === "greek")
                $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
            else
                $(".menu_selected_item_from").empty().append("-Choose point-");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
                //showBus[i].setVisible(false);
                InfoWindow.close();
            }
            for (var i = 0; i < showBus.length; i++) {
                showBus[i].setVisible(false);
            }
            for (var i = 0; i < showInvBus.length; i++) {
                showInvBus[i].setVisible(false);
            }
            clearInterval(myVar);
            line.setMap(null);

        }
        var menu_selected_item = $(this).text();
        $(".menu_selected_item_from").empty().append(menu_selected_item);

        $("#all_options_content_1").slideUp();
        $("#all_options_content_2").slideUp();

        if (elem_id != "default") {
            show(elem_id);
        }
    });

    $(document).on("click", ".menu_item_to", function () {

        var elem_id = this.id;
        if (elem_id == "default") {
            if (language == "greek")
                $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
            else
                $(".menu_selected_item_to").empty().append("-Choose point-");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
                //showBus[i].setVisible(false);
                InfoWindow.close();
            }
            for (var i = 0; i < showBus.length; i++) {
                showBus[i].setVisible(false);
            }
            for (var i = 0; i < showInvBus.length; i++) {
                showInvBus[i].setVisible(false);
            }
            clearInterval(myVar);
            line.setMap(null);

        }
        var menu_selected_item = $(this).text();
        $(".menu_selected_item_to").empty().append(menu_selected_item);

        $("#all_options_content_1").slideUp();
        $("#all_options_content_2").slideUp();

        if (elem_id != "default") {
            show(elem_id);
        }
    });

    $(document).on("click", "#all_options_btn_1", function () {

        if (!$("#show_step_content_1").prop("disabled")) {
            if (all_options_btn_1_flag == 0) {
                $("#all_options_content_1").slideDown();
                all_options_btn_1_flag = 1;
            }
            else {
                $("#all_options_content_1").slideUp();
                all_options_btn_1_flag = 0;
                $(".all_options").slideUp();
                $(".item_with_options").css("font-weight", "normal");

            }
        }
    });

    $(document).on("click", "#all_options_btn_2", function () {

        if (!$("#show_step_content_2").prop("disabled")) {
            if (all_options_btn_2_flag == 0) {
                $("#all_options_content_2").slideDown();
                all_options_btn_2_flag = 1;
            }
            else {
                $("#all_options_content_2").slideUp();
                all_options_btn_2_flag = 0;
                $(".all_options").slideUp();
                $(".item_with_options").css("font-weight", "normal");
            }
        }
    });

    // Mouse DOM events
    $(document).on('mouseenter', '.menu_item', function (event) {
        $(this).css("background-color", "black");
        $(this).css("color", "#FFFF66");

    }).on('mouseleave', '.menu_item', function () {
        $(this).css("background-color", "white");
        $(this).css("color", "#5f6f81");

    });
    $(document).on('mouseenter', '.menu_item_2', function (event) {
        $(this).css("background-color", "black");
        $(this).css("color", "#FFFF66");

    }).on('mouseleave', '.menu_item_2', function () {
        $(this).css("background-color", "white");
        $(this).css("color", "#5f6f81");

    });

    $(document).on('mouseenter', '.main_menu_btn', function (event) {
        $(this).css("background-color", "black");
        $(this).css("color", "#FFFF66");

    }).on('mouseleave', '.main_menu_btn', function () {
        $(this).css("background-color", "#FFFF66");
        $(this).css("color", "#5f6f81");

    });

    $(document).on('mouseenter', '.item_with_options', function (event) {
        $(this).css("background-color", "#C8C8C8");
        $(this).css("color", "black");
        $(this).find('img:eq(0)').attr("src", "img/down_arrow_2.png");
    }).on('mouseleave', '.item_with_options', function () {
        $(this).css("background-color", "white");
        $(this).css("color", "#5f6f81");
        $(this).find('img:eq(0)').attr("src", "img/down_arrow.png");
    });

    $(document).on("click", ".item_with_options", function () {
        $(this).css("font-weight", "bold");
        $(this).next(".all_options").slideToggle();
    });
    $(document).on("mouseleave", ".item_with_options", function () {
        $(this).css("font-weight", "normal");
    });
    $(document).on("mouseleave", ".all_options", function () {
        $(this).prev("a").css("font-weight", "normal");
    });

    // Clicking on the source or destination address
    $(document).on("click", ".address", function () {
        var position = $(this).attr('id');
        var coords = position.split(",");
        map.setZoom(14);
        map.setCenter(new google.maps.LatLng(coords[0], coords[1]));

    });

    $(document).on("click", ".min_route_step", function () {
        if (no_saved_route === "true") {
            var this_id = $(this).attr('id');
            var this_marker;

            if (route_mode === "TRANSIT") {
                
                if($(this).attr('id') == 0){
                    this_marker = dijkstra_current_route_pointsTransitFirst;
                }
                else if($(this).attr('id') == 1){
                    this_marker = dijkstra_current_route_pointsTransitSecond;
                }
                else{
                    this_marker = dijkstra_current_route_pointsTransitThird;
                }

			}
			
			else {
                this_marker = dijkstra_current_route_points[parseInt(this_id) + 1];
            }
            console.log(this_marker);
            google.maps.event.trigger(this_marker, 'click');
        }
        else {
            
            var this_id = $(this).attr('id');
            var this_marker;
            if (saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "TRANSIT"){
               
                console.log(saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_current_route_pointsTransitFirst);
                if(this_id == 0){
                    this_marker = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_current_route_pointsTransitFirst;
                }
                else if(this_id == 1){
                    this_marker = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_current_route_pointsTransitSecond;
                }
                else{
                    this_marker = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_current_route_pointsTransitThird;
                }
            }

            else
                this_marker = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_points[parseInt(this_id) + 1];
            google.maps.event.trigger(this_marker, 'click');

        }

        map.panTo(this_marker.position);

    });
    $(document).on("click", ".min_route_step_google", function () {

        var this_id = String($(this).attr('id'));
        var lat = this_id.split(",")[0].replace("(", "");
        var lng = this_id.split(",")[1].replace(")", "");
        console.log(this_id);
        var latlng = new google.maps.LatLng(lat, lng);	// Marker position
        console.log(latlng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
            icon: "img/other_marker_2.png"
            // title: 'route'
        });

        marker.setMap(map);
        marker.setVisible(false);
        var marker_content = $(this).html().split(String($(this).html().replace(/(^\d+)(.+$)/i, '$1')))[1].replace(".", "").split("<span")[0];

        google.maps.event.addListener(marker, "click", function () {

            InfoWindow.setContent(marker_content);
            InfoWindow.open(map, marker);
            // console.log(marker.position);
        });

        google.maps.event.addListener(map, "click", function () {
            InfoWindow.close();
        });
        google.maps.event.trigger(marker, 'click');

        map.panTo(marker.position);

    });

    $(document).on("click", ".min_route_step_ex", function () {
        if (no_saved_route === "true") {
            var this_id = $(this).attr('id');
            var this_marker = dijkstra_current_route_points[parseInt(this_id) - 1];
            google.maps.event.trigger(this_marker, 'click');
        }
        else {
            var this_id = $(this).attr('id');
            var this_marker = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_points[parseInt(this_id) - 1];
            google.maps.event.trigger(this_marker, 'click');

        }

    });

    // Hover the other options button event
    $(document).on("click", "#other_options_btn_li", function () {
        $("#menu_other_links").slideDown();
    });

    // Unhover the other options button event
    $(document).on("mouseleave", "#menu_other_links", function () {
        $("#menu_other_links").slideUp();
    });

    // Click on other options button event
    $(document).on("change", ".checkbox_div_element", function () {
        $id = this.id;
    });

    // Click to changce the direction of the line
    $(document).on("click", "#reverse_route_btn", function () {
        if (source_added == "true" && destination_added == "true") {
            return;
        }
        var route_val = $("#route").val();
        change_route_direction(elem_id2);
    });

    // Go back to step 1
    $(document).on("click", "#step_2_go_back", function () {
        source_added = "false";
        source_id = "null";
        destination_added = "false";
        destination_id = "null";
        destination_is_island = false;

        $("#source_address").empty();
        $("#source_address").prev().attr("id", " ");
        $("#destination_address").empty();
        $("#destination_address").prev().attr("id", " ");

        $("#step2_div").slideUp();

        $("#show_step_content_1").prop("disabled", false);
        $("#show_step_content_1").css("border", "2px solid #00CF00");
        $("#show_step_content_1").css("opacity", "1")

        $("#show_step_content_2").prop("disabled", true);
        $("#show_step_content_2").css("border", "2px solid red");
        $("#show_step_content_2").css("opacity", "0.5")

        $("#show_step_content_1").val("default");
        $("#show_step_content_2").val("default");
		
		$("#remove_source").show(); 
		$("#remove_destination").show();
		$("#change_addresses_btn").show();
		//$("li a.help-button").show();

        if (language === "gr")
            $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");

        if (language === "gr")
            $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");

        $("#search_by_location_1").val("");
        $("#search_by_location_2").val("");

        $(".step").fadeOut(0);

        $("#step1_div").slideDown(function() {
			$("#remove_source").show("slow"); 
			$("#remove_destination").show("slow"); 
			$("#change_addresses_btn").show("slow");
		});
		//alert(showMarker.length);
		//alert(dijkstra_current_route_points.length);
        for (var i = 0; i < showMarker.length; i++) {
            showMarker[i].setMap(null);
        }
		for (var i = 0; i < tmp_calc_markers.length; i++) {
            tmp_calc_markers[i].setMap(null);
        }
		//console.log(dijkstra_current_route_points);
        for (var i = 0; i < dijkstra_current_route_points.length; i++) {
            dijkstra_current_route_points[i].setVisible(false);
        }
        try {
            for (var i = 0; i < saved_routes_dict.length; i++) {
                var points = saved_routes_dict[i].dijkstra_current_route_points;
                for (j = 0; j < points.length; j++)
                    points[j].setMap(null);
            }
			for (var i = 0; i < calculated_route_points.length; i++) {
				calculated_route_points[i].setMap(null);
			}
        }
        catch (TypeError) {
        }
        $("#directions_div").slideUp();

    });

    // Go back to step 2
    $(document).on("click", "#step_3_go_back", function () {

        $("#dijkstra_google_btns").show();
        step_3_go_back = "true";
        route_exists = "false";
        try {
            for (var i = 0; i < route_additional_markers.length; i++) {
                route_additional_markers[i].setVisible(false);
            }
            route_additional_markers = [];
        }
        catch (ReferenceError) {
        }

        calc_new_route = "true";
        //$("#change_addresses_btn").show("slow");
        //$("#remove_source").show("slow");
        //$("#remove_destination").show("slow");

        $(".directions_div_btn_2").css("opacity", "1");

        $("#step3_div").slideUp();
        $("#mode_1").val("default");
        $("#mode_2").val("default");
        $("#step2_div").slideDown(function() {
			$("#remove_source").hide(); 
			$("#remove_destination").hide(); 
			$("#change_addresses_btn").hide();
			//$("li a.help-button").hide();
		});

        // also set time to default value
        directionsDisplay.setMap(null);

        for (var i = 0; i < dirDis.length; i++) {
            dirDis[i].setMap(null);
        }
        for (var i = 0; i < showMarker.length; i++) {
            showMarker[i].setDraggable(true);
        }
        hide_all_markers_lines_2();


        // Hide all markers except source and destination
        for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {
            dijkstra_current_route_points[i].setVisible(false);
        }
        //var dijkstra_polyline = dijkstra_current_route_line;		// Get the saved polyline
        dijkstra_current_route_line.setVisible(false);
        try {

            console.log(dijkstra_route_polyline_start_extra_global_2);
            if (route_mode === "TRANSIT") {
                dijkstra_route_polyline_start_extra_global.setMap(null);
                dijkstra_route_polyline_end_extra_global.setMap(null);
            }
            else {
                dijkstra_route_polyline_start_extra_global_2.setMap(null);
                dijkstra_route_polyline_end_extra_global_2.setMap(null);
            }
            dijkstra_route_polyline_extra.setVisible(false);
        }
        catch (TypeError) {
        }

    });

    $(document).on("click", "#step_3_main_results", function () {

        $("#send_a_route_div").fadeOut(0);
        $("#saved_routes_div").fadeIn(400);

    });

    // Create a new route
    $(document).on("click", "#step_3_new_route", function () {

        for (var i = 0; i < showMarker.length; i++) {
            showMarker[i].setVisible(false);
        }
        showMarker = [];

        for (var i = 0; i < showBus.length; i++) {
            showBus[i].setVisible(false);
        }
        showBus = [];
        for (var i = 0; i < showInvBus.length; i++) {
            showInvBus[i].setVisible(false);
        }
        showInvBus = [];


        InfoWindow.close();		// Close any open info window
        for (var i = 0; i < saved_routes_dict.length; i++) {

            var points = saved_routes_dict[parseInt(i)].dijkstra_route_points;		// Get the saved  points
            //var polyline = saved_routes_dict[parseInt(i)].dijkstra_route_polyline;
            saved_routes_dict[parseInt(i)].dijkstra_route_polyline.setVisible(false);
            try {
                if (saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra !== 'null') {
                    //var polyline_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra;
                    saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra.setVisible(false);
                }
                if (saved_routes_dict[parseInt(i)].mode === "TRANSIT") {

                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra !== 'undefined') {
                        var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra;
                        polyline_start_extra.setMap(null);
                    }
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra !== 'undefined') {
                        var polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra;
                        polyline_end_extra.setMap(null);
                    }
                }
                else {
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2 !== 'undefined') {
                        //var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_dijkstra_route_polyline_start_extra_2polyline_start_extra;
                        console.log(saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2);
                        saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2.setMap(null);
                    }
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2 !== 'undefined') {
                        console.log(saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2);
                        saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2.setMap(null);
                    }
                }
            }
            catch (TypeError) {
            }
        }
        $("#dijkstra_google_btns").show();
        $("#step_3_go_back").show("slow");
        if (dijkstra_route_polyline_extra !== "null")
            dijkstra_route_polyline_extra.setVisible(false);
        dijkstra_route_polyline_extra = "null";
        dijkstra_current_route_pointsTransitFirst = "";
        dijkstra_current_route_pointsTransitSecond = "";
        dijkstra_current_route_pointsTransitThird = "";

        finalStopName = []; //gia na mporei na pairnei ta swsta NEA onomata an pathsw nea diadromh alliws pairnei tis prwtes theseis panta ara ta onomata pou mphkan sthn 1h diadromh

        total_dis = 0;
        route_total_time = 0;
        marker_content_array = [];
        route_proc_directions = [];

        directionsDisplay_array = [];
        directionsService_array = [];
        route_start_directions = [];
        route_end_directions = [];

        dijkstra_route_direction_content = [];
        dirs = [];
        transit_route_directions = [];
        source_added = "false";
        destination_added = "false";
        directionsLoaded = "false";

        for (var i = 0; i < tmp_calc_markers.length; i++)
            tmp_calc_markers[i].setVisible(false);
        tmp_calc_markers = [];

        // Route extra markers
        for (var i = 0; i < route_additional_markers.length; i++)
            route_additional_markers[i].setVisible(false);
        route_additional_markers = [];

        // Change the addresses
        if (flag_2 === "false") {
            $source_address = $("#destination_address_div").html();		// get source's content
            $destination_address = $("#source_address_div").html();
            $("#source_address_div").empty().append($source_address);
            $("#destination_address_div").empty().append($destination_address);
        }
        flag_2 = "true";

        $("#route_title").empty().html("ΑΠΟΤΕΛΕΣΜΑΤΑ ΔΙΑΔΡΟΜΗΣ i-Mobi");
        $("#change_addresses_btn").show("slow");
        $("#remove_source").show("slow");
        $("#remove_destination").show("slow");
		//$("li a.help-button").show();

        save_flag = 0;
        route_exists = "false";
        step_3_go_back = "false";
        no_saved_route = "true";
        $(".directions_div_btn_2").css("opacity", "1");

        directionsDisplay.setMap(null);
        // Remove all Google routes from map
        for (var i = 0; i < dirDis.length; i++) {
            dirDis[i].setMap(null);
        }

        dijkstra_current_route_line.setVisible(false);

        if (saved_routes_counter == 0) {		// No route has been saved 

            var dijkstra_points = dijkstra_current_route_points;		// Get the saved  directions
            for (var i = 0; i < dijkstra_points.length; i++) {
                dijkstra_points[i].setVisible(false);
            }
            try {

                if (route_mode === "TRANSIT") {
                    dijkstra_route_polyline_start_extra_global.setMap(null);
                    dijkstra_route_polyline_end_extra_global.setMap(null);
                }
                else {
                    dijkstra_route_polyline_start_extra_global_2.setMap(null);
                    dijkstra_route_polyline_end_extra_global_2.setMap(null);
                }

            }
            catch (TypeError) {}
        }
        else {
            try {
                if (route_mode === "TRANSIT") {
                    dijkstra_route_polyline_start_extra_global.setMap(null);
                    dijkstra_route_polyline_end_extra_global.setMap(null);
                }
                else {
                    dijkstra_route_polyline_start_extra_global_2.setMap(null);
                    dijkstra_route_polyline_end_extra_global_2.setMap(null);
                }
            }
            catch (TypeError) {
            }

            hide_all_markers_lines();

        }

        source_added = "false";
        source_id = "null";
        destination_added = "false";
        destination_id = "null";
        destination_is_island = false;

        $("#source_address").empty();
        $("#source_address").prev().attr("id", " ");
        $("#destination_address").empty();
        $("#destination_address").prev().attr("id", " ");

        $("#directions_div").slideUp();

        // Hide the current marker from the map
        for (var i = 0; i < showMarker.length; i++) {
            showMarker[i].setVisible(false);
        }
        // Prevent dragging the markers
        for (var i = 0; i < showMarker.length; i++) {
            showMarker[i].setDraggable(true);
        }
        $("#mode_1").val("default");
        $("#mode_2").val("default");
        $("#step2_div").slideUp();
        $("#step3_div").slideUp();

        $("#show_step_content_1").val("default");
        $("#show_step_content_2").val("default");
        $(".step").fadeOut(0);

        $("#step1_div").slideDown(function() {
			$("#remove_source").show("slow"); 
			$("#remove_destination").show("slow"); 
			$("#change_addresses_btn").show("slow");
		});

        calc_new_route = "true";

        $("#search_by_location_1").val("");
        $("#search_by_location_2").val("");

        if (language === "gr")
            $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");

        if (language === "gr")
            $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");

        $("#show_step_content_1").css('border', '2px solid #00CF00');
        $("#show_step_content_1").css('opacity', '1');
        $("#show_step_content_2").css('border', '2px solid red');
        $("#show_step_content_2").css('opacity', '0.5');
        $("#show_step_content_1").prop("disabled", false);			// enable source
        $("#show_step_content_2").prop("disabled", true);			// enable destination


        $("#route_time").val("");		// Set time to default value
    });

    // Click to save a route
    $(document).on("click", "#step_3_save", function () {

        if(directionsLoaded === "false"){
            if(language === "greek")
                alert("Παρακαλώ περίμενετε να φορτώσουν οι οδηγίες");
            else
                alert("Please wait for directions to load");
            return;
        }

        $("#step_3_go_back").hide("slow");
        if (source_added == "false" || destination_added === "false")
            return;
        $("#saved_routes_menu").css("border", "1px solid white");
        save_flag = 1;
        flag_new = 1;

        if (first_saved_route === "true") {					// this will be executed only the first time

            $("#saved_routes_menu_empty").fadeOut(300);		// hide the div

            saved_routes++;		// 0->1
            saved_routes_counter++;
            if (language == "greek") {
                // create new menu item
                var new_menu_item = "<div style='background-color:#FFFAFA' class='route_menu_item'>" +
                    "<span class='saved_route_content hover_link' id='" + saved_routes + "_route" + "'> Διαδρομή " + saved_routes + "</span>" +
                    "</div>";
            }
            else {
                // create new menu item
                var new_menu_item = "<div style='background-color:#FFFAFA' class='route_menu_item'>" +
                    "<span class='saved_route_content hover_link' id='" + saved_routes + "_route" + "'> Route " + saved_routes + "</span>" +
                    "</div>";
            }


            $("#saved_routes_menu").append(new_menu_item);

            var json_data = {};

            // Read the data created by the calcRoute function
            json_data["route_id"] = saved_routes;

            json_data["destination_is_island"] = destination_is_island;
            json_data["source_point"] = route_source_point;
            json_data["source_point_google"] = route_source_point_google;
            json_data["destination_point"] = route_destination_point;
            json_data["destination_point_google"] = route_destination_point_google;
            json_data["source_point_address"] = route_source_point_address;
            json_data["source_point_address_google"] = route_source_point_address_google;
            json_data["destination_point_address"] = route_destination_point_address;
            json_data["destination_point_address_google"] = route_destination_point_address_google;
            json_data["mode"] = route_mode;
            json_data["route_total_time"] = route_total_time;
            json_data["route_total_length"] = total_dis;
            json_data["optimization_way"] = optimization_way;
            json_data["dijkstra_source_point_address"] = dijkstra_source_point_address;
            json_data["dijkstra_destination_point_address"] = dijkstra_destination_point_address;
            json_data["dijkstra_route_polyline"] = dijkstra_current_route_line;			 	// The polyline of Dijkstra's last min route
            json_data["dijkstra_route_polyline_extra"] = dijkstra_route_polyline_extra;
			
            try {
                if (route_mode === "TRANSIT") {

                    json_data["dijkstra_route_polyline_start_extra"] = dijkstra_route_polyline_start_extra_global;
                    json_data["dijkstra_route_polyline_end_extra"] = dijkstra_route_polyline_end_extra_global;
                    json_data["dijkstra_current_route_pointsTransitFirst"] = dijkstra_current_route_pointsTransitFirst;
                    json_data["dijkstra_current_route_pointsTransitSecond"] = dijkstra_current_route_pointsTransitSecond;
                    json_data["dijkstra_current_route_pointsTransitThird"] = dijkstra_current_route_pointsTransitThird;
                    json_data["finalBusCode"] = finalBusCode;
                    json_data["finalStopNameFirst"] = finalStopName[0];
                    json_data["finalStopNameSecond"] = finalStopName[1];
                }
                else {
                    json_data["dijkstra_route_polyline_start_extra_2"] = dijkstra_route_polyline_start_extra_global_2;
                    json_data["dijkstra_route_polyline_end_extra_2"] = dijkstra_route_polyline_end_extra_global_2;
                }

            }
            catch (TypeError) {
            }

            var route = $("#dijkstra_route_container").html();
            dijkstra_current_route_directions = route;

            json_data["dijkstra_route_waypoints"] = dijkstra_current_route_waypoints;		// The waypoints of Dijkstra's last min route
            json_data["dijkstra_route_directions"] = dijkstra_current_route_directions;		// The directions of Dijkstra's last min route
            if (route_mode === "TRANSIT")
                json_data["dijkstra_route_direction_content"] = transit_route_directions;
            else
                json_data["dijkstra_route_direction_content"] = dijkstra_route_direction_content;
            json_data["dijkstra_route_points"] = dijkstra_current_route_points;				// The points of Dijkstra's last min route

            saved_routes_dict.push(json_data);
            first_saved_route = "false";

            // Change the css of the other buttons
            $('.saved_route_content').each(function (i, obj) {
                $(this).css("background-color", "none");
                $(this).parent().css("background-color", "none");
            });
            $("#" + saved_routes + "_route").parent().css("background-color", "#FFFAFA");

        }
        else if (calc_new_route == "true") {

            $("#saved_routes_menu_empty").fadeOut(300);		// hide the div

            saved_routes++;		// 0->1
            saved_routes_counter++;
            currently_selected_route = parseInt(currently_selected_route) + 1;
            // create new menu item
            if (language == "greek") {
                var new_menu_item = "<div class='route_menu_item'>" +
                    "<span class='saved_route_content hover_link' id='" + saved_routes + "_route" + "'> Διαδρομή " + saved_routes + "</span>" +
                    "</div>";
            }
            else {
                var new_menu_item = "<div class='route_menu_item'>" +
                    "<span class='saved_route_content hover_link' id='" + saved_routes + "_route" + "'> Route " + saved_routes + "</span>" +
                    "</div>";
            }
            $("#saved_routes_menu").append(new_menu_item);

            var json_data = {};

            // Read the data created by calcRoute function
            json_data["route_id"] = saved_routes;
            json_data["destination_is_island"] = destination_is_island;
            json_data["source_point"] = route_source_point;				// the last source added id
            json_data["source_point_google"] = route_source_point_google;
            json_data["destination_point"] = route_destination_point;	// the last destination added id
            json_data["destination_point_google"] = route_destination_point_google;
            json_data["source_point_address"] = route_source_point_address;
            json_data["source_point_address_google"] = route_source_point_address_google;
            json_data["destination_point_address"] = route_destination_point_address;
            json_data["destination_point_address_google"] = route_destination_point_address_google;
            json_data["mode"] = route_mode;
            json_data["route_total_time"] = route_total_time;
            json_data["route_total_length"] = total_dis;
            json_data["optimization_way"] = optimization_way;
            json_data["dijkstra_source_point_address"] = dijkstra_source_point_address;
            json_data["dijkstra_destination_point_address"] = dijkstra_destination_point_address;
            json_data["dijkstra_route_polyline"] = dijkstra_current_route_line;			 	// The polyline of Dijkstra's last min route
            json_data["dijkstra_route_polyline_extra"] = dijkstra_route_polyline_extra;

            try {
                if (route_mode === "TRANSIT") {
                    json_data["dijkstra_route_polyline_start_extra"] = dijkstra_route_polyline_start_extra_global;
                    json_data["dijkstra_route_polyline_end_extra"] = dijkstra_route_polyline_end_extra_global;
                    json_data["dijkstra_current_route_pointsTransitFirst"] = dijkstra_current_route_pointsTransitFirst;
                    json_data["dijkstra_current_route_pointsTransitSecond"] = dijkstra_current_route_pointsTransitSecond;
                    json_data["dijkstra_current_route_pointsTransitThird"] = dijkstra_current_route_pointsTransitThird;
                    json_data["finalBusCode"] = finalBusCode;
                    json_data["finalStopNameFirst"] = finalStopName[0];
                    json_data["finalStopNameSecond"] = finalStopName[1];
                }
                else {
                    json_data["dijkstra_route_polyline_start_extra_2"] = dijkstra_route_polyline_start_extra_global_2;
                    json_data["dijkstra_route_polyline_end_extra_2"] = dijkstra_route_polyline_end_extra_global_2;
                }
            }
            catch (TypeError) {
            }

            var route = $("#dijkstra_route_container").html();
            dijkstra_current_route_directions = route;

            json_data["dijkstra_route_waypoints"] = dijkstra_current_route_waypoints;		// The waypoints of Dijkstra's last min route
            json_data["dijkstra_route_directions"] = dijkstra_current_route_directions;		// The directions of Dijkstra's last min route
            if (route_mode === "TRANSIT")
                json_data["dijkstra_route_direction_content"] = transit_route_directions;
            else
                json_data["dijkstra_route_direction_content"] = dijkstra_route_direction_content;
            json_data["dijkstra_route_points"] = dijkstra_current_route_points;				// The points of Dijkstra's last min route

            saved_routes_dict.push(json_data);

            calc_new_route = "false";

            // Change the css of the other buttons
            $('.saved_route_content').each(function (i, obj) {
                $(this).css("background-color", "none");
                $(this).parent().css("background-color", "none");
            });
            $("#" + saved_routes + "_route").parent().css("background-color", "#FFFAFA");

        }
        else {
            if (language == "greek")
                alert("Η διαδρομή αυτή έχει ήδη αποθηκευτεί");
            else
                alert("This route has been already saved");
        }
        if (language == "greek")
            selected_route = "  'Διαδρομή " + saved_routes_counter + "'";
        else
            selected_route = "  'Route " + saved_routes_counter + "'";


        $("#send_a_route_div").fadeOut(0);
        no_saved_route = "false";
        step_3_go_back = "false";
    });

    // When clicked to display a saved route
    $(document).on("click", ".saved_route_content", function () {

		clearMap();
        $("#step_3_go_back").hide("slow");

        InfoWindow.close();
        for (var i = 0; i < dijkstra_current_route_points.length; i++) {
            dijkstra_current_route_points[i].setVisible(false);
        }
        for (var i = 0; i < saved_routes_dict.length; i++) {
            var dijkstra_points = saved_routes_dict[i].dijkstra_route_points;	// Dijkstra's route polyline
            for (var i = 0; i < dijkstra_points.length; i++) {
                dijkstra_points[i].setVisible(false);
            }
        }
        for (var i = 0; i < tmp_calc_markers.length; i++) {
            tmp_calc_markers[i].setVisible(false);
        }

        if (language == "greek")
            $("#route_title").empty().html("ΑΠΟΤΕΛΕΣΜΑΤΑ ΔΙΑΔΡΟΜΗΣ i-Mobi");
        else
            $("#route_title").empty().html("ROUTES RESULTS from i-Mobi");

        save_flag = 1;
        var this_elem = this;
        $('.saved_route_content').each(function (i, obj) {
            $(this).css("background-color", "none");
            $(this).parent().css("background-color", "none");
        });
        $(this).parent().css('background-color', '#FFFAFA');

        if (selected_route == "null") {
            if (language == "greek")
                selected_route = "διαδρομής";
            else
                selected_route = "route";
        }
        else  			// a route has been selected
            selected_route = "" + $(this).html() + "";

        // The id of the selected element
        this_elem_id = this.id.split("_")[0];
		console.log("This id is: ");
		console.log(this_elem_id);
        // The last route that has been selected
        currently_selected_route = this_elem_id;

        // Update the values of the current route (3 points + bus code and stops names)
        if(saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "TRANSIT"){
            finalBusCode = saved_routes_dict[parseInt(currently_selected_route) - 1].finalBusCode;
            console.log(finalStopName[0] = saved_routes_dict[parseInt(currently_selected_route) - 1].finalStopName);
            finalStopName[0] = saved_routes_dict[parseInt(currently_selected_route) - 1].finalStopNameFirst;
            finalStopName[1] = saved_routes_dict[parseInt(currently_selected_route) - 1].finalStopNameSecond;
        }
        if(saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "TRANSIT" || saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "BICYCLING"){
            $("#dijkstra_google_btns").hide();
        }
        else{
            $("#dijkstra_google_btns").show();
        }
		
		no_saved_route = "false";
        $("#dijkstra_btn").trigger("click");

    });

    $(document).on("click", "#step_3_send", function () {

        if(directionsLoaded === "false"){
            if(language === "greek")
                alert("Παρακαλώ περίμενετε να φορτώσουν οι οδηγίες");
            else
                alert("Please wait for directions to load");
            return;
        }

        $("#step_3_go_back").hide("slow");
        $("#saved_routes_div").fadeOut(0);
        // $("#route_to_send").empty().append(selected_route);
        $("#send_a_route_div").fadeIn(600);

    });
    $(document).on("click", "#send_result_btn", function () {
        var email = $("#email").val();

        if (email == "") {
            if (language == "greek")
                alert("Παρακαλώ δώστε διεύθυνση email");
            else
                alert("Please enter an email address");
            return;
        }
        else {

            var google_route = $("#current_route").html();
            var dijkstra_route = $("#dijkstra_route_container").html();

            $.ajax({
                type: 'POST',
                url: 'php/sent_route_mail.php',
                data: {"dijkstra_route": dijkstra_route, "google_route": google_route, "email": email},
                success: function (data) {

                    if (data === "OK") {
                        if (language === "greek")
                            alert("Η διαδρομή στάλθηκε επιτυχώς!");
                        else
                            alert("Your route was succesfully send!");
                    }
                    else {
                        if (language === "greek")
                            alert("Πρόβλημα,παρακαλώ προσπαθήστε πάλι");
                        else
                            alert("There was an problem,please try again");
                    }
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
        }

    });

    // When user removes the source point's address
    $(document).on("click", "#remove_source", function () {

        if(change_addresses_flag == 0 && !($.trim($("#source_address").html()).length)){
           return;
        }
        if(change_addresses_flag == 1 && !($.trim($("#destination_address").html()).length)){
           return;
        }

        if (language === "gr")
            $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item_from").empty().append("-Διάλεξε σημείο-");

        if ($.trim($("#source_address").html()).length) {		// Source is not empty

            $("#show_step_content_1").val("default");
            $("#show_step_content_2").val("default");
            $(".step").fadeOut(0);

   //          $("#step2_div").slideUp();		// Hide step 2 div
   //          $("#step1_div").slideDown(function() {
			// 	$("#remove_source").show("slow"); 
			// 	$("#remove_destination").show("slow"); 
			// 	$("#change_addresses_btn").show("slow");
			// });	// Show step 1 div

   //          // $("#step2").slideUp();
   //          $("#step3_div").slideUp();
            $("#mode_1").val("default");

            directionsDisplay.setMap(null);
            for (var i = 0; i < dirDis.length; i++) {
                dirDis[i].setMap(null);
            }
        }

        if (flag_2 === "true") {
            $("#source_address").empty();
            $("#source_address").prev().attr("id", " ");
            // REMOVE/HIDE SOURCE MARKER FROM THE MAP 
            for (var i = 0; i < showMarker.length; i++) {
                if (showMarker[i]["id"] == route_source_point) {
                    showMarker[i].setMap(null);
                }
            }
            console.log("source removed");
            source_added = "false";
            route_source_point = "null";
            try {
                dijkstra_current_route_points[0].setVisible(false);
            }
            catch (TypeError) {
            }

        }
        else {
            $("#destination_address").empty();
            $("#destination_address").prev().attr("id", " ");
            // REMOVE/HIDE SOURCE MARKER FROM THE MAP
            for (var i = 0; i < showMarker.length; i++) {
                if (showMarker[i]["id"] == route_destination_point)
                    showMarker[i].setMap(null);
            }
            destination_added = "false";
            route_destination_point = "null";
            try {
                dijkstra_current_route_points[dijkstra_current_route_points.length - 1].setVisible(false);
            }
            catch (TypeError) {
            }
        }

        $("#show_step_content_1").prop('disabled', false);		// enable source
        $("#show_step_content_1").css('border', '2px solid #00CF00');
        $("#show_step_content_1").css('opacity', '1');
        $("#show_step_content_2").css('border', '2px solid red');
        $("#show_step_content_2").css('opacity', '0.5');

        if (destination_added === "false") {
            $("#show_step_content_2").prop('disabled', true);		// disable destination
        }


        for (var i = 0; i < showMarker.length; i++) {
            showMarker[i].setDraggable(true);
        }

        $("#search_by_location_1").val("");

        $("#route_1").val("default");
        $("#route_2").val("default");
        InfoWindow.close();
        flag = 0;
        total_addresses--;

        if ($('#source_address').is(':empty') && $('#destination_address').is(':empty') && total_addresses == 0) {

            $("#source_address_div").empty().append(source_content);
            $("#destination_address_div").empty().append(destination_content);
            flag_2 = "true";

        }
       if (!($.trim($("#source_address").html()).length) && !($.trim($("#destination_address").html()).length)) {

            $("#show_step_content_1").prop("disabled", false);			// enable source
            $("#show_step_content_2").prop("disabled", true);			// disable destination
            $("#show_step_content_2").css('border', '2px solid red');
            $("#show_step_content_2").css('opacity', '0.5');
            $("#directions_div").slideUp();

            change_addresses_flag = 0;
            source_added = "false";
            destination_added = "false";
        }
    });

    // When user removes the desination point's address
    $(document).on("click", "#remove_destination", function () {
        console.log(change_addresses_flag);
        if(change_addresses_flag == 0  && !($.trim($("#destination_address").html()).length)){
           return;
        }
        if(change_addresses_flag == 1  &&  !($.trim($("#source_address").html()).length)){
           return;
        }

       
        if (language === "gr")
            $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item_to").empty().append("-Διάλεξε σημείο-");

        if ($.trim($("#destination_address").html()).length) {

            $("#show_step_content_1").val("default");
            $("#show_step_content_2").val("default");
            $(".step").fadeOut(0);

   //          $("#step2_div").slideUp();
   //          $("#step1_div").slideDown(function() {
			// 	$("#remove_source").show("slow"); 
			// 	$("#remove_destination").show("slow"); 
			// 	$("#change_addresses_btn").show("slow");
			// });
   //          // $("#step2").slideUp();
   //          $("#step3_div").slideUp();
            $("#mode_1").val("default");
            directionsDisplay.setMap(null);
            for (var i = 0; i < dirDis.length; i++) {
                dirDis[i].setMap(null);
            }
        }

        if (flag_2 === "true") {
            $("#destination_address").empty();
            $("#destination_address").prev().attr("id", " ");
            /* REMOVE/HIDE DESTINATION MARKER FROM THE MAP */
            for (var i = 0; i < showMarker.length; i++) {
                if (showMarker[i]["id"] == route_destination_point)
                    showMarker[i].setMap(null);
            }
            console.log("destination removed");
            destination_added = "false";
            route_destination_point = "null";
            try {
                dijkstra_current_route_points[dijkstra_current_route_points.length - 1].setVisible(false);
            }
            catch (TypeError) {
            }
        }
        else {
            $("#source_address").empty();
            $("#source_address").prev().attr("id", " ");
            /* REMOVE/HIDE DESTINATION MARKER FROM THE MAP */
            for (var i = 0; i < showMarker.length; i++) {
                if (showMarker[i]["id"] == route_source_point)
                    showMarker[i].setMap(null);
            }
            source_added = "false";
            route_source_point = "null";
            try {
                dijkstra_current_route_points[0].setVisible(false);
            }
            catch (TypeError) {
            }
        }

        for (var i = 0; i < showMarker.length; i++) {
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
        $("#search_by_location_2").val("");
        if ($('#source_address').is(':empty') && $('#destination_address').is(':empty') && total_addresses == 0) {
            // CHANGE THE ADDRESSES
            $("#source_address_div").empty().append(source_content);
            $("#destination_address_div").empty().append(destination_content);
            flag_2 = "true";

        }
        if (!($.trim($("#source_address").html()).length) && !($.trim($("#destination_address").html()).length)) {

            $("#show_step_content_1").prop("disabled", false);			// enable source

            $("#show_step_content_2").prop("disabled", true);			// disable destination
            $("#show_step_content_2").css('border', '2px solid red');
            $("#show_step_content_2").css('opacity', '0.5');
            $("#directions_div").slideUp();

            change_addresses_flag = 0;
            source_added = "false";
            destination_added = "false";

        }
    });

    // When user enters an address in step 1
    $(document).on("click", "#search_location_btn_1", function () {
        if ($("#search_by_location_1").val() == "") {
            if (language === "greek")
                alert("Παρακαλώ εισάγεται διεύθυνση");
            else
                alert("Please,enter and address");
            return;
        }
        else {

            $("#choose_by_address_1").slideUp();

            var address = $("#search_by_location_1").val();
            geocoder.geocode({'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);


                    var pos1_lat_lng = [];
                    Object.keys(results[0].geometry.location).forEach(function (key) {
                        var val = results[0].geometry.location[key];
                        pos1_lat_lng.push(val);
                    });
                    var marker_id = pos1_lat_lng[0] + "," + pos1_lat_lng[1];

                    var marker = new google.maps.Marker({
                        map: map,
                        id: marker_id,
                        animation: google.maps.Animation.DROP,
                        draggable: true,
                        position: results[0].geometry.location
                    });

                    if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                    }
                    else {
                        if (language === "greek") {
                            alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                        else {
                            alert("i-Mobi Volos can't provide route outside the green region.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;

                        }
                    }
                    if (source_added === "false")	// ΝΟ SOURCE
                        marker.setIcon("img/dd-start.png");
                    else if (destination_added === "false")
                        marker.setIcon("img/dd-end.png");

                    google.maps.event.addListener(marker, 'dragend', function () {

                        InfoWindow.close();
                        geocodeNewPosition(marker);

                    });
                    setTimeout(function () {
                        InfoWindow.close();
                    }, 0);

                    marker.setMap(map);
                    showMarker.push(marker);
                    google.maps.event.addListener(map, "click", function () {
                        InfoWindow.close();
                    });
                    choose_this_point(999, marker_id, address, "geocode_address", " ");
                } else {
                    if (language === "greek")
                        alert("Λυπούμαστε αλλά η διεύθυνση που εισάγεται είναι λανθασμένη");
                    else
                        alert("Sorry but the address you entered is not valid");
                }
            });

        }
    });

    // When user enters an address in step 2
    $(document).on("click", "#search_location_btn_2", function () {
        if ($("#search_by_location_2").val() == "") {
            if (language === "greek")
                alert("Παρακαλώ εισάγεται διεύθυνση");
            else
                alert("Please,enter and address");
            return;
        }
        else {
            $("#choose_by_address_2").slideUp();
            var address = $("#search_by_location_2").val();
            geocoder.geocode({'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);

                    var pos1_lat_lng = [];
                    Object.keys(results[0].geometry.location).forEach(function (key) {
                        var val = results[0].geometry.location[key];
                        pos1_lat_lng.push(val);
                    });
                    var marker_id = pos1_lat_lng[0] + "," + pos1_lat_lng[1];

                    var marker = new google.maps.Marker({
                        map: map,
                        id: marker_id,
                        animation: google.maps.Animation.DROP,
                        draggable: true,
                        position: results[0].geometry.location
                    });
                    if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                    }
                    else {
                        if (language === "greek") {
                            alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                        else {
                            alert("i-Mobi Volos can't provide routing outside the green region.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                    }

                    if (destination_added === "false") {
                        marker.setIcon("img/dd-end.png");
                    } else {
                        marker.setIcon("img/dd-start.png");
                    }

                    google.maps.event.addListener(marker, 'dragend', function () {
                        InfoWindow.close();
                        geocodeNewPosition(marker);
                    });
                    setTimeout(function () {
                        InfoWindow.close();
                    }, 0);

                    marker.setMap(map);
                    showMarker.push(marker);

                    google.maps.event.addListener(map, "click", function () {
                        InfoWindow.close();
                    });
                    choose_this_point(999, marker_id, address, "geocode_address", " ");
                } else {
                    if (language === "greek")
                        alert("Λυπούμαστε αλλά η διεύθυνση που εισάγεται είναι λανθασμένη");
                    else
                        alert("Sorry but the address you entered is not valid");
                }
            });
        }
    });

    // Display the Dijkstra route
    $(document).on("click", "#dijkstra_btn", function () {

        // Show addiotnal markers
        for (var i = 0; i < route_additional_markers.length; i++) {
            route_additional_markers[i].setVisible(false);
        }
        if (language === "greek")
            $("#route_title").empty().html("ΑΠΟΤΕΛΕΣΜΑΤΑ ΔΙΑΔΡΟΜΗΣ i-Mobi");
        else
            $("#route_title").empty().html("ROUTES RESULTS from i-Mobi");

        if (save_flag == 0) {  		// No route has been saved

            // Hide Google points
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
            }
            // Set marker undraggable
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setDraggable(false);
            }
            // Hide Google routes 
            for (var i = 0; i < dirDis.length; i++) {
                dirDis[i].setMap(null);
            }
            directionsDisplay.setMap(null);

            $("#current_route").hide("slow");

            var dijkstra_points = dijkstra_current_route_points;		// Get the saved  directions
            for (var i = 0; i < dijkstra_points.length; i++) {
                dijkstra_points[i].setVisible(false);
                dijkstra_points[i].setDraggable(false);
            }
            // Show only source and destination
            dijkstra_points[0].setVisible(true);
            dijkstra_points[dijkstra_points.length - 1].setVisible(true);

            var dijkstra_polyline = dijkstra_current_route_line;		// Get the saved polyline
            dijkstra_polyline.setVisible(true);

            try {
                if (dijkstra_route_polyline_extra !== 'null') {
                    //var dijkstra_polyline_extra = dijkstra_route_polyline_extra;		// Get the saved polyline
                    dijkstra_route_polyline_extra.setVisible(true);
                }
                if (route_mode === 'TRANSIT') {
                    dijkstra_route_polyline_start_extra_global.setMap(map);
                    dijkstra_route_polyline_end_extra_global.setMap(map);
                }
                else {
                    dijkstra_route_polyline_start_extra_global_2.setMap(map);
                    dijkstra_route_polyline_end_extra_global_2.setMap(map);
                }
            }
            catch (TypeError) {
            }

            $("#source_address").empty().append(route_source_point_address);
            $("#destination_address").empty().append(route_destination_point_address);

            var dijkstra_directions = dijkstra_current_route_directions;	// Get the saved  directions
            console.log(dijkstra_directions);

            $("#dijkstra_route_container").empty().append(dijkstra_directions);
            $("#dijkstra_route_container").show("slow");

            var pos1_lat_lng = [];
            Object.keys(dijkstra_points[1].position).forEach(function (key) {
                var val = dijkstra_points[1].position[key];
                pos1_lat_lng.push(val);
            });
            var pos1 = pos1_lat_lng[0];
            var pos2 = pos1_lat_lng[1];
            var center_point = new google.maps.LatLng(pos1, pos2);
            setTimeout(function () {
				map.setZoom(13);
				//map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
				map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
				//map.panTo(center_point);
			}, 500);
        }
        else {
            // Hide Google points
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
            }
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setDraggable(false);
            }
            // Hide Google routes 
            directionsDisplay.setMap(null);
            for (var i = 0; i < dirDis.length; i++) {
                dirDis[i].setMap(null);
            }

            $("#current_route").hide("slow");

            for (var i = 0; i < saved_routes_dict.length; i++) {

                var points = saved_routes_dict[parseInt(i)].dijkstra_route_points;		// Get the saved  points
                //var polyline = saved_routes_dict[parseInt(i)].dijkstra_route_polyline;
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline.setVisible(false);
                try {
                    if (saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra !== 'null') {
                        //var polyline_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra;
                        saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra.setVisible(false);
                    }
                    if (saved_routes_dict[parseInt(i)].mode === "TRANSIT") {

                        if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra !== 'undefined') {
                            var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra;
                            console.log(polyline_start_extra);
                            polyline_start_extra.setMap(null);
                        }
                        if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra !== 'undefined') {
                            var polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra;
                            polyline_end_extra.setMap(null);
                        }
                    }
                    else {
                        if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2 !== 'undefined') {
                            //var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_dijkstra_route_polyline_start_extra_2polyline_start_extra;
                            console.log(saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2);
                            saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2.setMap(null);
                        }
                        if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2 !== 'undefined') {
                            console.log(saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2);
                            saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2.setMap(null);
                        }
                    }

                }
                catch (TypeError) {
                }

                for (var j = 0; j < points.length; j++) {
                    points[j].setVisible(false);
                }
            }

            var dijkstra_points = [];
            dijkstra_points = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_points;		// Get the saved  directions
            for (var i = 0; i < dijkstra_points.length; i++) {
                dijkstra_points[i].setVisible(false);
                dijkstra_points[i].setDraggable(false);
            }

            // Show only source and destination
            dijkstra_points[0].setVisible(true);
            dijkstra_points[dijkstra_points.length - 1].setVisible(true);

            saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline.setVisible(true);

            try {
                if (saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline_extra !== 'null') {
                    // var dijkstra_polyline_extra = saved_routes_dict[parseInt(currently_selected_route)-1].dijkstra_route_polyline_extra;
                    // console.log(dijkstra_polyline_extra);		
                    saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline_extra.setVisible(true);
                }
                if (saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "TRANSIT") {

                    //var dijkstra_polyline_start_extra = saved_routes_dict[parseInt(currently_selected_route)-1].dijkstra_route_polyline_start_extra;		// Get the saved  directions
                    saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline_start_extra.setMap(map);
                    //var dijkstra_polyline_end_extra = saved_routes_dict[parseInt(currently_selected_route)-1].dijkstra_route_polyline_end_extra;		// Get the saved  directions
                    saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline_end_extra.setMap(map);

                }
                else {
                    //var dijkstra_polyline_start_extra = saved_routes_dict[parseInt(currently_selected_route)-1].dijkstra_route_polyline_start_extra_2;		// Get the saved  directions
                    saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline_start_extra_2.setMap(map);
                    //var dijkstra_polyline_end_extra = saved_routes_dict[parseInt(currently_selected_route)-1].dijkstra_route_polyline_end_extra_2;		// Get the saved  directions
                    saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_polyline_end_extra_2.setMap(map);
                }
            }
            catch (TypeError) {
            }
            // Show additional markers
            if (saved_routes_dict[parseInt(currently_selected_route) - 1].destination_is_island)
                show_port_marker();

            $("#source_address").empty().append(saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_source_point_address);
            $("#destination_address").empty().append(saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_destination_point_address);

            // Update also the id of source and destination
            var dijkstra_directions = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_directions;	// Get the saved  directions

            $("#dijkstra_route_container").empty().append(dijkstra_directions);
            $("#dijkstra_route_container").show("slow");

            // Center the map
            setTimeout(function () {
				var marker = saved_routes_dict[parseInt(currently_selected_route) - 1].dijkstra_route_points[2].position;
				var latlng = new google.maps.LatLng(marker["k"], marker["D"]);	// Marker position
				map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
				map.setZoom(13);
				map.panTo(marker);
			}, 500);
        }
	});

    // Display the Google route
    $(document).on("click", "#google_btn", function () {

        InfoWindow.close();
        if (language === "greek")
            $("#route_title").empty().html("ΑΠΟΤΕΛΕΣΜΑΤΑ ΔΙΑΔΡΟΜΗΣ Google");
        else
            $("#route_title").empty().html("ROUTES RESULTS from Google");

        for (var i = 0; i < route_additional_markers.length; i++) {
            route_additional_markers[i].setVisible(false);
        }
        if (save_flag == 0) {  	// No route has been saved

            if (route_mode === "TRANSIT" || route_mode === "BICYCLING") {
                if (language === "greek")
                    alert("Η Google δεν παρέχει οδηγίες για το μέσο μετακίνησης που επιλέξατε.");
                else
                    alert("Google doesn't provide route directions for route mode you selected.");
                return;
            }
            dijkstra_current_route_line.setVisible(false);
            for (var i = 0; i < dijkstra_current_route_points.length; i++) {
                dijkstra_current_route_points[i].setVisible(false);
            }

            if (dijkstra_route_polyline_extra !== 'null') {
                dijkstra_route_polyline_extra.setVisible(false);
            }
            if (route_mode === "TRANSIT") {
                dijkstra_route_polyline_start_extra_global.setMap(null);
                dijkstra_route_polyline_end_extra_global.setMap(null);
            }
            else {

                dijkstra_route_polyline_start_extra_global_2.setMap(null);
                dijkstra_route_polyline_end_extra_global_2.setMap(null);
            }

            $("#dijkstra_route_container").hide("slow");

            var this_source_id = route_source_point_google;
            var this_destination_id = route_destination_point_google;

            console.log("route_source_point_address_google:" + route_source_point_address_google);
            $("#source_address").empty().append(route_source_point_address_google);
            console.log("route_destination_point_address_google:" + route_destination_point_address_google);
            $("#destination_address").empty().append(route_destination_point_address_google);
            if (route_mode === "ANYTHING" || route_mode === "SUM")
                calcGoogleRoute(this_source_id, this_destination_id, "WALKING", optimization_way);
            else if (route_mode === "BICYCLING")
                calcGoogleRoute(this_source_id, this_destination_id, "DRIVING", optimization_way);
            else
                calcGoogleRoute(this_source_id, this_destination_id, route_mode, optimization_way);

            $("#current_route").show("slow");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setDraggable(false);          // ------------ NEW CHANGE
            }
            for (var i = 0; i < showMarker.length; i++) {
                if (showMarker[i]["id"] == this_source_id) {
                    showMarker[i].setVisible(true);
                }
                else if (showMarker[i]["id"] == this_destination_id) {
                    showMarker[i].setVisible(true);
                }
                else {
                    showMarker[i].setVisible(false);
                }
            }
            directionsDisplay.setMap(map);
            // Show Google routes 
            for (var i = 0; i < dirDis.length; i++) {
                dirDis[i].setMap(map);
            }

        }
        else {

            if (saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "TRANSIT" || saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "BICYCLING") {
                if (language === "greek")
                    alert("Η Google δεν παρέχει οδηγίες για το μέσο μετακίνησης που επιλέξατε.");
                else
                    alert("Google doesn't provide route directions for route mode you selected.");
                return;
            }

            // Hide all the Dijkstra polylines from the map
            for (var i = 0; i < saved_routes_dict.length; i++) {

                var points = saved_routes_dict[parseInt(i)].dijkstra_route_points;		// Get the saved  points

                saved_routes_dict[parseInt(i)].dijkstra_route_polyline.setVisible(false);
                try {
                    if (saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra !== 'null') {
                        var polyline_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra;
                        polyline_extra.setVisible(false);
                    }
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra !== 'undefined') {
                        var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra;
                        polyline_start_extra.setMap(null);
                    }
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra !== 'undefined') {
                        var polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra;
                        polyline_end_extra.setMap(null);
                    }
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2 !== 'undefined') {
                        var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2;
                        polyline_start_extra.setMap(null);
                    }
                    if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2 !== 'undefined') {
                        var polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2;
                        polyline_end_extra.setMap(null);
                    }

                }
                catch (TypeError) {
                }

            }

            $("#dijkstra_route_container").hide("slow");
            console.log(saved_routes_dict[parseInt(currently_selected_route) - 1]);

            var this_source_id = saved_routes_dict[parseInt(currently_selected_route) - 1].source_point_google;
            var this_destination_id = saved_routes_dict[parseInt(currently_selected_route) - 1].destination_point_google;

            $("#source_address").empty().append(saved_routes_dict[parseInt(currently_selected_route) - 1].source_point_address_google);
            $("#destination_address").empty().append(saved_routes_dict[parseInt(currently_selected_route) - 1].destination_point_address_google);
            if (saved_routes_dict[parseInt(currently_selected_route) - 1].mode === "ANYTHING")
                calcGoogleRoute(this_source_id, this_destination_id, "WALKING", saved_routes_dict[parseInt(currently_selected_route) - 1].optimization_way);
            else if (route_mode === "BICYCLING")
                calcGoogleRoute(this_source_id, this_destination_id, "DRIVING", optimization_way);
            else
                calcGoogleRoute(this_source_id, this_destination_id, saved_routes_dict[parseInt(currently_selected_route) - 1].mode, saved_routes_dict[parseInt(currently_selected_route) - 1].optimization_way);

            $("#current_route").show("slow");
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setDraggable(false);
            }
            directionsDisplay.setMap(map);
            // Show Google routes 
            for (var i = 0; i < dirDis.length; i++) {
                dirDis[i].setMap(map);
            }
        }
    });

    // Calculate the min route
    $(document).on("click", "#calculate_min_route", function () {

        if ($("#mode_1").val() === "default") {
            if (language === "greek")
                alert("Παρακαλώ επιλέξτε τρόπο μετακίνησης");
            else
                alert("Please select a way of travel");
        }
        else if ($("#mode_2").val() === "default") {
            if (language === "greek")
                alert("Παρακαλώ επιλέξτε τρόπο βελτιστοποίησης");
            else
                alert("Please select a way of optimization");

        }
        else if ($("#route_time").val() === "" && $("#mode_1").val() === "TRANSIT") {
            if (language === "greek")
                alert("Παρακαλώ επιλέξτε ώρα");
            else
                alert("Please select time");
        }
        else if (source_added === "false" || destination_added === "false") {
            if (language === "greek")
                alert("Παρακαλώ επιλέξτε διαδρομή");
            else
                alert("Please select a route");
        }
        else {		// Caclulate min route
            $("#step2_div").slideUp();
            calcRoute(start_marker.position, end_marker.position, $("#mode_1").val(), $("#mode_2").val());
        }
    });
});
/**
 * Display the time/date picker container
 * @param val
 */
function show_hide_route_time_div(val) {

    if (val === "TRANSIT") {
        $("#route_time_div").fadeIn(700);
    }
    else {
        $("#route_time_div").fadeOut(500);
    }

}
/**
 * Display the step 1 container
 * @param val
 */
function show_step_content_1(val) {

    map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
    map.setZoom(15);

    if (val == "default") {
        $(".step1").fadeOut(600);
        google.maps.event.clearListeners(map, 'rightclick');
        google.maps.event.clearListeners(bound_polygon, 'rightclick');
    }
    else if (val == "choose_by_point_1") {
        $("#choose_by_address_1").fadeOut(0);
        $("#choose_by_right_click_1").fadeOut(0);
        $("#choose_by_point_1").fadeIn(600);
        google.maps.event.clearListeners(map, 'rightclick');
        google.maps.event.clearListeners(bound_polygon, 'rightclick');
    }
    else if (val == "choose_by_right_click_1") {
        $("#choose_by_point_1").fadeOut(0);
        $("#choose_by_address_1").fadeOut(0);
        $("#choose_by_right_click_1").fadeIn(600);
        rightclick();
        bound_flag = 1;
        showBounds();
        bound_polygon.setMap(map);
    }
    else if (val == "choose_by_address_1") {
        $("#choose_by_point_1").fadeOut(0);
        $("#choose_by_right_click_1").fadeOut(0);
        $("#choose_by_address_1").fadeIn(600);
        google.maps.event.clearListeners(map, 'rightclick');
        google.maps.event.clearListeners(bound_polygon, 'rightclick');
    }
}
/**
 * Display the step 2 container
 * @param val
 */
function show_step_content_2(val) {

    map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
    map.setZoom(15);
    if (source_added == "true" || flag_2 == "false") { 			// source has been added
        if (val == "default") {
            $(".step2").fadeOut(600);
            google.maps.event.clearListeners(map, 'rightclick');
            google.maps.event.clearListeners(bound_polygon, 'rightclick');
        }
        else if (val == "choose_by_point_2") {
            $("#choose_by_address_2").fadeOut(0);
            $("#choose_by_right_click_2").fadeOut(0);
            $("#choose_by_point_2").fadeIn(600);
            google.maps.event.clearListeners(map, 'rightclick');
            google.maps.event.clearListeners(bound_polygon, 'rightclick');
        }
        else if (val == "choose_by_right_click_2") {
            $("#choose_by_point_2").fadeOut(0);
            $("#choose_by_address_2").fadeOut(0);
            $("#choose_by_right_click_2").fadeIn(600);
            rightclick();
            bound_flag = 1;
            showBounds();
            bound_polygon.setMap(map);
        }
        else if (val == "choose_by_address_2") {
            $("#choose_by_point_2").fadeOut(0);
            $("#choose_by_right_click_2").fadeOut(0);
            $("#choose_by_address_2").fadeIn(600);
            google.maps.event.clearListeners(map, 'rightclick');
            google.maps.event.clearListeners(bound_polygon, 'rightclick');
        }
    }
}

/**
 * Richt click event listener inside the boundnaries area
 */
function rightclick() {

    google.maps.event.addListener(map, 'rightclick', function (event) {

        // Must work only if the menu is open
        if ($("nav").hasClass("gn-open-all")) {
            if (source_added == "false" || destination_added == "false") {

                var lat = event.latLng.lat();
                var lng = event.latLng.lng();
                var latlng = new google.maps.LatLng(lat, lng);
                var address_p = "(" + lat + "," + lng + ")";
                map.setCenter(latlng);

                var marker = new google.maps.Marker({
                    map: map,
                    id: lat + "," + lng,
                    position: event.latLng,
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });

                if (!$.trim($("#source_address").html()).length) {		// SOURCE

                    marker.setIcon("img/dd-start.png");
                    if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                    }
                    else {

                        if (language === "greek") {
                            alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                        else {
                            alert("i-Mobi Volos can't provide route outside the green region.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                    }
                }	// Detination
                else if (destination_added == "false") {
                    marker.setIcon("img/dd-end.png");
                    if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                    }
                    else {
                        if (language === "greek") {
                            alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                        else {
                            alert("i-Mobi Volos can't provide route outside the green region.");
                            marker.setMap(null);
                            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                            return;
                        }
                    }
                }
                setTimeout(function () {
                    InfoWindow.close();
                }, 0);

                marker.setMap(map);
                showMarker.push(marker);

                google.maps.event.addListener(map, "click", function () {
                    InfoWindow.close();
                });

                google.maps.event.addListener(marker, 'dragend', function () {
                    InfoWindow.close();
                    geocodeNewPosition(marker);

                });

                // Reverse Geocoding
                var marker_address = "";
                geocoder.geocode({'latLng': latlng}, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            marker_address = results[0].formatted_address;

                            if (address_is_island(marker_address)) {
                                destination_is_island = true;
                            }

                            choose_this_point(999, address_p, marker_address, "non_geοcode_address", " ");
                        } else {
                            alert('No results found');
                        }
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            }
        }
    });
}

/**
 * Remove all the elements from the map
 */
function clearMap(){

    for (var i = 0; i < showMarker.length; i++) {
        showMarker[i].setVisible(false);
    }
    showMarker = [];

    for (var i = 0; i < showBus.length; i++) {
        showBus[i].setVisible(false);
    }
    showBus = [];
    for (var i = 0; i < showInvBus.length; i++) {
        showInvBus[i].setVisible(false);
    }
    showInvBus = [];


    InfoWindow.close();		// Close any open info window
    for (var i = 0; i < saved_routes_dict.length; i++) {

        var points = saved_routes_dict[parseInt(i)].dijkstra_route_points;		// Get the saved  points
        //var polyline = saved_routes_dict[parseInt(i)].dijkstra_route_polyline;
        saved_routes_dict[parseInt(i)].dijkstra_route_polyline.setVisible(false);
        try {
            if (saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra !== 'null') {
                //var polyline_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra;
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline_extra.setVisible(false);
            }
            if (saved_routes_dict[parseInt(i)].mode === "TRANSIT") {

                if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra !== 'undefined') {
                    var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra;
                    polyline_start_extra.setMap(null);
                }
                if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra !== 'undefined') {
                    var polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra;
                    polyline_end_extra.setMap(null);
                }
            }
            else {
                if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2 !== 'undefined') {
                    //var polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_dijkstra_route_polyline_start_extra_2polyline_start_extra;
                    console.log(saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2);
                    saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2.setMap(null);
                }
                if (typeof saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2 !== 'undefined') {
                    console.log(saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2);
                    saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2.setMap(null);
                }
            }
        }
        catch (TypeError) {
        }
    }

    if (dijkstra_route_polyline_extra !== "null")
        dijkstra_route_polyline_extra.setVisible(false);
    dijkstra_route_polyline_extra = "null";

    marker_content_array = [];


    directionsDisplay_array = [];
    directionsService_array = [];
    route_start_directions = [];
    route_end_directions = [];

    dijkstra_route_direction_content = [];
    dirs = [];
    transit_route_directions = [];
    source_added = "false";
    destination_added = "false";

    for (var i = 0; i < tmp_calc_markers.length; i++)
        tmp_calc_markers[i].setVisible(false);
    tmp_calc_markers = [];

// Route extra markers
    for (var i = 0; i < route_additional_markers.length; i++)
        route_additional_markers[i].setVisible(false);
    route_additional_markers = [];



    directionsDisplay.setMap(null);
// Remove all Google routes from map
    for (var i = 0; i < dirDis.length; i++) {
        dirDis[i].setMap(null);
    }

    dijkstra_current_route_line.setVisible(false);

    if (saved_routes_counter == 0) {		// No route has been saved

        var dijkstra_points = dijkstra_current_route_points;		// Get the saved  directions
        for (var i = 0; i < dijkstra_points.length; i++) {
            dijkstra_points[i].setVisible(false);
        }
        try {

            if (route_mode === "TRANSIT") {
                dijkstra_route_polyline_start_extra_global.setMap(null);
                dijkstra_route_polyline_end_extra_global.setMap(null);
            }
            else {
                dijkstra_route_polyline_start_extra_global_2.setMap(null);
                dijkstra_route_polyline_end_extra_global_2.setMap(null);
            }

        }
        catch (TypeError) {}
    }
    else {
        try {
            if (route_mode === "TRANSIT") {
                dijkstra_route_polyline_start_extra_global.setMap(null);
                dijkstra_route_polyline_end_extra_global.setMap(null);
            }
            else {
                dijkstra_route_polyline_start_extra_global_2.setMap(null);
                dijkstra_route_polyline_end_extra_global_2.setMap(null);
            }
        }
        catch (TypeError) {
        }

        hide_all_markers_lines();

    }

// Hide the current marker from the map
    for (var i = 0; i < showMarker.length; i++) {
        showMarker[i].setVisible(false);
    }
// Prevent dragging the markers
    for (var i = 0; i < showMarker.length; i++) {
        showMarker[i].setDraggable(true);
    }
}

/**
 * Check if the input address is in island (SKiathos.Skopelos, Alonnissos)
 * @param marker_address
 * @returns {boolean}
 */
function address_is_island(marker_address) {

    if (marker_address.indexOf("Skiathos") > -1 || marker_address.indexOf("Σκιάθος") > -1 || marker_address.indexOf("Skiathou") > -1 || marker_address.indexOf("Σκιάθου") > -1 || marker_address.indexOf("Skopelos") > -1 || marker_address.indexOf("Σκόπελος") > -1 || marker_address.indexOf("Skopelou") > -1 || marker_address.indexOf("Σκόπελου") > -1 || marker_address.indexOf("Alonnisos") > -1 || marker_address.indexOf("Αλόννησος") > -1 || marker_address.indexOf("Alonnisou") > -1 || marker_address.indexOf("Αλοννήσου") > -1)
        return true;
    else
        return false;
}
/**
 * Hide all markers and polylines from the map - case 1
 */
function hide_all_markers_lines() {

    for (var i = 0; i < dijkstra_current_route_points.length; i++) {
        dijkstra_current_route_points[i].setVisible(false);
    }

    try {
        dijkstra_polyline.setVisible(false);

        if (dijkstra_route_polyline_extra !== 'null') {
            var dijkstra_polyline_extra = dijkstra_route_polyline_extra;		// Get the saved polyline
            dijkstra_polyline_extra.setVisible(false);
        }
        if (route_mode === "TRANSIT") {
            dijkstra_route_polyline_start_extra_global.setMap(null);
            dijkstra_route_polyline_end_extra_global.setMap(null);
        }
        else {

            dijkstra_route_polyline_start_extra_global_2.setMap(null);
            dijkstra_route_polyline_end_extra_global_2.setMap(null);
        }
    }
    catch (TypeError) {
    }
    //console.log(saved_routes_dict);
    for (var i = 0; i < saved_routes_dict.length; i++) {
        try {
            var points = [];
            points = saved_routes_dict[parseInt(i)].dijkstra_route_points;		// Get the saved  points
            //var polyline = saved_routes_dict[parseInt(i)].dijkstra_route_polyline;
            saved_routes_dict[parseInt(i)].dijkstra_route_polyline.setVisible(false);
            for (var j = 0; j < points.length; j++) {
                points[j].setVisible(false);
            }
            if (saved_routes_dict[parseInt(i)].mode === "TRANSIT") {
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra.setMap(null);
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra.setMap(null);
            }
            else {
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline(null);
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2.setMap(null);
                saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2.setMap(null);
            }
        }

        catch (TypeError) {
        }
    }
}
/**
 * Hide all markers and polylines from the map - case 2
 */
function hide_all_markers_lines_2() {

    dijkstra_current_route_line.setVisible(false);

    if (dijkstra_route_polyline_extra !== 'null') {
        dijkstra_route_polyline_extra.setVisible(false);
    }
    try {
        dijkstra_route_polyline_start_extra_global.setMap(null);
        dijkstra_route_polyline_end_extra_global.setMap(null);
        dijkstra_route_polyline_start_extra_global_2.setMap(null);
        dijkstra_route_polyline_end_extra_global_2.setMap(null);
    }
    catch (TypeError) {
    }

    for (var i = 0; i < saved_routes_dict.length; i++) {
        var polyline = saved_routes_dict[parseInt(i)].dijkstra_route_polyline;
        polyline.setVisible(false);

        try {
            var dijkstra_polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra;
            dijkstra_polyline_start_extra.setMap(null);
            var dijkstra_polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra;		// Get the saved polyline
            dijkstra_polyline_end_extra.setMap(null);

            var dijkstra_polyline_start_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_start_extra_2;
            dijkstra_polyline_start_extra.setMap(null);
            var dijkstra_polyline_end_extra = saved_routes_dict[parseInt(i)].dijkstra_route_polyline_end_extra_2;		// Get the saved polyline
            dijkstra_polyline_end_extra.setMap(null);

        }
        catch (TypeError) {
        }
    }
}
/**
 * Process a given direction
 * @param direction
 */
function proc_direction(direction) {

    var old_s = direction;
    var str = old_s.replace(/<b>/g, '@').replace(/x/g, ".").replace(/<.b>/g, "#");
    var pattern = /@([\s\S]*?)(?=#)/g;
    var result = str.match(pattern);
    if (result === null)
        return;
    var words = [];
    for (var i = 0; i < result.length; i++) {
        if (result[i].length > 1) {
            result[i] = result[i].substring(1, result[i].length);
        }
        words.push(result[i]);
    }
    var json_file = {};
    try {
        if (words.length == 3) {
            json_file["dir"] = words[0];
            json_file["from"] = words[1];
            json_file["to"] = words[2];
        }
        else if (words.length == 2) {
            json_file["dir"] = words[0];
            json_file["from"] = "null";
            json_file["to"] = words[1];
        }
        else if (words.length == 1) {
            json_file["dir"] = "null";
            json_file["from"] = words[0];
            json_file["to"] = "null";
        }
        route_proc_directions.push(json_file);

    }
    catch (TypeError) {
    }

}
/**
 * Get the final directions of the route (only for the drawRoute_2 case)
 * @returns {Array}
 */
function get_final_directions() {

    console.log(route_proc_directions);
    // Remove any possible wrong direction 
    for (var i = 0; i < route_proc_directions.length - 1; i++) {
        try {
            if (route_proc_directions[i]["dir"] === route_proc_directions[i + 1]["dir"] && route_proc_directions[i]["from"] === route_proc_directions[i + 1]["from"] && route_proc_directions[i]["to"] === route_proc_directions[i + 1]["to"]) {

                route_proc_directions[i + 1]["dir"] = "null";
                route_proc_directions[i + 1]["from"] = "null";
                route_proc_directions[i + 1]["to"] = "null";

            }
            else if (route_proc_directions[i]["from"] === route_proc_directions[i + 1]["to"] && route_proc_directions[i]["to"] === route_proc_directions[i + 1]["from"]) {

                route_proc_directions[i + 1]["dir"] = "null";
                route_proc_directions[i + 1]["from"] = "null";
                route_proc_directions[i + 1]["to"] = "null";
            }
        }
        catch (TypeError) {
        }
    }
    var json_dirs = {};

    // Check the first direction
    if (typeof route_proc_directions[0]["dir"] !== 'undefined' || typeof route_proc_directions[0]["from"] !== 'undefined' || typeof route_proc_directions[0]["to"] !== 'undefined') {
        // alert("INSIDE 1 IF");
        if (route_proc_directions[0]["dir"] === "null") {

            if (language === "greek") {
                if(route_proc_directions[0]["from"] === "null")
                    json_dirs["dir"] = "Προχωρήστε ευθεία";
                else
                    json_dirs["dir"] = "Προχωρήστε προς " + route_proc_directions[0]["from"];
                json_dirs["id"] = 0;
                dirs.push(json_dirs);
            }
            else {
                if(route_proc_directions[0]["from"] === "null")
                    json_dirs["dir"] = "Head on straight";
                else
                    json_dirs["dir"] = "Head toward " + route_proc_directions[0]["from"];
                json_dirs["id"] = 0;
                dirs.push(json_dirs);
            }
        }
        else {
            if (language === "greek") {
                if(route_proc_directions[0]["from"] === "null"){
                    json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[0]["dir"] + "</b> μέχρι <b>" + route_proc_directions[0]["to"] + "</b>";
                }
                else{
                    json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[0]["dir"] + "</b> από <b>" + route_proc_directions[0]["from"] + "</b> μέχρι <b>" + route_proc_directions[0]["to"] + "</b>";
                }
                json_dirs["id"] = 0;
                dirs.push(json_dirs);
            }
            else {
                if (route_proc_directions[0]["from"] === "null") {
                    json_dirs["dir"] = "Head <b>" + route_proc_directions[0]["dir"] + "</b> on <b> toward <b>" + route_proc_directions[0]["to"] + "</b>";
                }
                else{
                    json_dirs["dir"] = "Head <b>" + route_proc_directions[0]["dir"] + "</b> on <b>" + route_proc_directions[0]["from"] + "</b> toward <b>" + route_proc_directions[0]["to"] + "</b>";
                }
                json_dirs["id"] = 0;
                dirs.push(json_dirs);
            }
        }
    }
    // Get the values of the first direction
    var old_dir = route_proc_directions[0]["dir"];
    var old_from = route_proc_directions[0]["from"];
    var old_to = route_proc_directions[0]["to"];

    if (route_proc_directions.length < 6) {

        for (var i = 1; i < route_proc_directions.length - 1; i++) {
            json_dirs = {};

            if (typeof route_proc_directions[i]["dir"] === 'undefined' && typeof route_proc_directions[i]["from"] === 'undefined' && typeof route_proc_directions[i]["from"] === 'undefined')
                continue;

            if (route_proc_directions[i]["dir"] === "null") {
                console.log("HERE");
                var direction;
                if (language === "greek")
                    direction = "Προχωρήστε προς <b>" + route_proc_directions[i]["from"] + "</b>";
                else
                    direction = "Head toward <b>" + route_proc_directions[i]["from"] + "</b>";

                if (!direction_exists(direction, dirs)) {
                    //console.log("id is:"+i);
                    json_dirs["dir"] = direction;
                    json_dirs["id"] = i;
                    dirs.push(json_dirs);
                }
            }
            else {
                var direction;
                if (language === "greek"){
                    if(route_proc_directions[i]["from"] === "null"){
                        direction = "Προχωρήστε <b>" + route_proc_directions[i]["dir"] + "</b> προς <b>" + route_proc_directions[i]["to"] + "</b>";
                    }
                    else{
                        direction = "Προχωρήστε <b>" + route_proc_directions[i]["dir"] + "</b> από " + route_proc_directions[i]["from"] + "</b> προς <b>" + route_proc_directions[i]["to"] + "</b>";
                    }
                }
                else{
                    if(route_proc_directions[i]["from"] === "null")
                        direction = "Head " + route_proc_directions[i]["dir"] + " on toward " + route_proc_directions[i]["to"];
                    else
                        direction = "Head " + route_proc_directions[i]["dir"] + " on " + route_proc_directions[i]["from"] + " toward " + route_proc_directions[i]["to"];
                }

                if (!direction_exists(direction, dirs)) {
                    json_dirs["dir"] = direction;
                    json_dirs["id"] = i;
                    dirs.push(json_dirs);

                }
            }
        }

        json_dirs = {};
        if (typeof route_proc_directions[route_proc_directions.length - 1]["dir"] !== 'undefined' && typeof route_proc_directions[route_proc_directions.length - 1]["from"] !== 'undefined' && typeof route_proc_directions[route_proc_directions.length - 1]["from"] !== 'undefined') {
            if (route_proc_directions[route_proc_directions.length - 1]["dir"] !== "null") {
                if (language === "greek") {
                    if(route_proc_directions[route_proc_directions.length - 1]["from"] === "null")
                        json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[route_proc_directions.length - 1]["dir"] + "</b> προς <b>" + route_proc_directions[route_proc_directions.length - 1]["to"] + "</b>";
                    else
                        json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[route_proc_directions.length - 1]["dir"] + "</b> από <b>" + route_proc_directions[route_proc_directions.length - 1]["from"] + "</b> προς <b>" + route_proc_directions[route_proc_directions.length - 1]["to"] + "</b>";

                    json_dirs["id"] = route_proc_directions.length - 1;
                    dirs.push(json_dirs);
                }
                else {
                    if(route_proc_directions[route_proc_directions.length - 1]["from"] === "null")
                        json_dirs["dir"] = "Head " + route_proc_directions[route_proc_directions.length - 1]["dir"] + " on toward " + route_proc_directions[route_proc_directions.length - 1]["to"];
                    else
                        json_dirs["dir"] = "Head " + route_proc_directions[route_proc_directions.length - 1]["dir"] + " on " + route_proc_directions[route_proc_directions.length - 1]["from"] + " toward " + route_proc_directions[route_proc_directions.length - 1]["to"];

                    json_dirs["id"] = route_proc_directions.length - 1;
                    dirs.push(json_dirs);
                }
            }
            else {
                if (language === "greek") {
                    json_dirs["dir"] = "Προχωρήστε μέχρι <b>" + route_proc_directions[route_proc_directions.length - 1]["from"] + "</b>";
                    json_dirs["id"] = route_proc_directions.length - 1;
                    dirs.push(json_dirs);
                }
                else {
                    json_dirs["dir"] = "Head toward " + route_proc_directions[route_proc_directions.length - 1]["from"];
                    json_dirs["id"] = route_proc_directions.length - 1;
                    dirs.push(json_dirs);
                }
            }
        }
        return dirs;
    }
    else {

        for (var i = 1; i < route_proc_directions.length - 2; i++) {

            if (route_proc_directions[i]["from"] === "null" && route_proc_directions[i]["dir"] === "null" && route_proc_directions[i]["to"] === "null")
                continue;
            json_dirs = {};

            if (route_proc_directions[i]["from"] === old_from) {	// We are in the same road

                old_dir = route_proc_directions[i]["dir"];
                old_from = route_proc_directions[i]["from"];
                old_to = route_proc_directions[i]["to"];

                // Check if there are undefined values
                if (typeof old_dir === 'undefined' || typeof old_from === 'undefined' || typeof old_to === 'undefined')
                    continue;

                if (route_proc_directions[i + 1]["from"] !== route_proc_directions[i]["from"]) {	// if the next road differs from the current one

                    // Case 1 - turn1
                    if (route_proc_directions[i]["dir"] === "turn") {
                        var direction;
                        if (language === "greek"){
                            if(route_proc_directions[i + 1]["from"] === "null")
                                direction = "Στρίψτε <b>" + route_proc_directions[i]["from"] + "</b> προς <b>" + route_proc_directions[i]["to"];
                            else
                                direction = "Στρίψτε <b>" + route_proc_directions[i]["from"] + "</b> προς <b>" + route_proc_directions[i]["to"] + "</b> και κατευθυνθείτε μέχρι <b>" + route_proc_directions[i + 1]["from"] + "</b>";    
                        }
                        else{
                            if(route_proc_directions[i + 1]["from"] === "null")
                                direction = "Turn " + route_proc_directions[i]["from"] + " toward " + route_proc_directions[i]["to"];
                            else
                                direction = "Turn " + route_proc_directions[i]["from"] + " toward " + route_proc_directions[i]["to"] + " until " + route_proc_directions[i + 1]["from"];    
                        
                        }
                           
    
                        json_dirs["dir"] = direction;
                        json_dirs["id"] = get_direction_id(direction);
                        dirs.push(json_dirs);
                    }
                    else if (route_proc_directions[i + 1]["dir"] !== route_proc_directions[i]["dir"]) {	  // Case 2 - turn2 
                        var direction;
                        if (language === "greek"){
                            if(route_proc_directions[i + 1]["from"] === "null")
                                direction = "Στρίψτε προς <b>" + route_proc_directions[i]["to"] + "</b>";
                            else
                                direction = "Στρίψτε προς <b>" + route_proc_directions[i]["to"] + "</b> και κατευθυνθείτε μέχρι <b>" + route_proc_directions[i + 1]["from"] + "</b>";
                        }
                        else{
                            if(route_proc_directions[i + 1]["from"] === "null")
                                direction = "Turn toward " + route_proc_directions[i]["to"];
                            else
                                direction = "Turn toward " + route_proc_directions[i]["to"] + "until " + route_proc_directions[i + 1]["from"];

                        }
                            
                        json_dirs["dir"] = direction;
                        json_dirs["id"] = get_direction_id(direction);
                        dirs.push(json_dirs);

                    }
                    else {	// Case 3
                        if (old_dir === "null") {
                            var direction;
                            if (language === "greek")
                                direction = "Προχωρήστε προς <b>" + old_from + "</b>";
                            else
                                direction = "Head toward " + old_from;

                            if (!direction_exists(direction, dirs)) {
                                json_dirs["dir"] = direction;
                                json_dirs["id"] = get_direction_id(direction);
                                dirs.push(json_dirs);
                            }

                        }
                        else {	// The same road

                            var direction;
                            if (language === "greek")
                                direction = "Προχωρήστε <b>" + old_dir + "</b> από <b>" + old_from + "</b> προς " + old_to + "</b>";
                            else
                                direction = "Head " + old_dir + " on " + old_from + " toward " + old_to;
                            if (!direction_exists(direction, dirs)) {
                                json_dirs["dir"] = direction;
                                json_dirs["id"] = get_direction_id(direction);
                                dirs.push(json_dirs);
                            }
                        }
                    }
                }
                else 		// continue with the current road
                    continue;
            }
            else {		// We must change road
                json_dirs = {};
                // Check if there are undefined values
                if (typeof route_proc_directions[i]["dir"] === 'undefined' || typeof route_proc_directions[i]["from"] === 'undefined' || typeof route_proc_directions[i]["to"] === 'undefined')
                    continue;

                // Case 1 - turn1
                if (route_proc_directions[i]["dir"] === "turn") {
                    var direction;
                    if (language === "greek"){
                        if(route_proc_directions[i + 1]["from"] === "null")
                            direction = "Στρίψτε <b>" + route_proc_directions[i]["from"] + "</b> προς <b>" + route_proc_directions[i]["to"]+ "</b>";
                        else
                            direction = "Στρίψτε <b>" + route_proc_directions[i]["from"] + "</b> προς <b>" + route_proc_directions[i]["to"] + "</b> και κατευθυνθείτε μέχρι <b>" + route_proc_directions[i + 1]["from"] + "</b>";     
                    }
                    else{
                        if(route_proc_directions[i + 1]["from"] === "null")
                            direction = "Turn " + route_proc_directions[i]["from"] + " toward " + route_proc_directions[i]["to"];
                        else
                            direction = "Turn " + route_proc_directions[i]["from"] + " toward " + route_proc_directions[i]["to"] + " until " + route_proc_directions[i + 1]["from"];
                    }
                    json_dirs["dir"] = direction;
                    json_dirs["id"] = get_direction_id(direction);
                    dirs.push(json_dirs);
                }
                else if (route_proc_directions[i]["dir"] !== old_dir) {	  // Case 2 - turn2 
                    var direction;
                    if (language === "greek"){
                        if(route_proc_directions[i + 1]["from"] === "null")
                             direction = "Στρίψτε προς <b>" + route_proc_directions[i]["to"] + "</b>";
                        else
                            direction = "Στρίψτε προς <b>" + route_proc_directions[i]["to"] + "</b> και κατευθυνθείτε μέχρι <b>" + route_proc_directions[i + 1]["from"] + "</b>";
                    }
                    else{
                        if(route_proc_directions[i + 1]["from"] === "null")
                            direction = "Turn toward " + route_proc_directions[i]["to"];
                        else
                            direction = "Turn toward " + route_proc_directions[i]["to"] + "until " + route_proc_directions[i + 1]["from"];
                    }
                    json_dirs["dir"] = direction;
                    json_dirs["id"] = get_direction_id(direction);
                    dirs.push(json_dirs);

                }
                if (route_proc_directions[i + 1]["from"] !== route_proc_directions[i]["from"]) {

                    if (old_dir === "null") {

                        var direction;
                        if (language === "greek")
                            direction = "Προχωρήστε προς <b>" + old_from + "</b>";
                        else
                            direction = "Head toward " + old_from;
                        if (!direction_exists(direction, dirs)) {
                            json_dirs["dir"] = direction;
                            json_dirs["id"] = get_direction_id(direction);
                            dirs.push(json_dirs);
                        }

                    }
                    else {

                        var direction;
                        if (language === "greek"){
                            if(old_from === "null")
                                direction = "Προχωρήστε <b>" + old_dir + "</b> προς <b>" + old_to + "</b>";
                            else
                                direction = "Προχωρήστε <b>" + old_dir + "</b> από <b>" + old_from + "</b> προς <b>" + old_to + "</b>";
                        }

                        else{
                             if(old_from === "null")
                                direction = "Head " + old_dir + " toward " + old_to;
                             else
                                direction = "Head " + old_dir + " on " + old_from + " toward " + old_to;
                        }
                            
                        }
                        if (!direction_exists(direction, dirs)) {
                            json_dirs["dir"] = direction;
                            json_dirs["id"] = get_direction_id(direction);
                            dirs.push(json_dirs);
                        }

                    }
                    old_dir = route_proc_directions[i]["dir"];
                    old_from = route_proc_directions[i]["from"];
                    old_to = route_proc_directions[i]["to"];
                }
            }
        }
        var json_dirs = {};

        if (typeof route_proc_directions[route_proc_directions.length - 2]["dir"] !== 'undefined' && typeof route_proc_directions[route_proc_directions.length - 2]["from"] !== 'undefined' && typeof route_proc_directions[route_proc_directions.length - 2]["from"] !== 'undefined') {
            if (route_proc_directions[route_proc_directions.length - 2]["dir"] !== "null") {
                if (language === "greek") {
                    if(route_proc_directions[route_proc_directions.length - 2]["from"] === "null")
                        json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[route_proc_directions.length - 2]["dir"] + "</b> προς <b>" + route_proc_directions[route_proc_directions.length - 2]["to"] + "</b>";
                    else
                        json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[route_proc_directions.length - 2]["dir"] + "</b> από <b>" + route_proc_directions[route_proc_directions.length - 2]["from"] + "</b> προς <b>" + route_proc_directions[route_proc_directions.length - 2]["to"] + "</b>";
                    json_dirs["id"] = route_proc_directions.length - 2;
                    dirs.push(json_dirs);
                }
                else {
                    if(route_proc_directions[route_proc_directions.length - 2]["from"] === "null")
                        json_dirs["dir"] = "Head " + route_proc_directions[route_proc_directions.length - 2]["dir"] + " on toward " + route_proc_directions[route_proc_directions.length - 2]["to"];
                    else
                        json_dirs["dir"] = "Head " + route_proc_directions[route_proc_directions.length - 2]["dir"] + " on " + route_proc_directions[route_proc_directions.length - 2]["from"] + " toward " + route_proc_directions[route_proc_directions.length - 2]["to"];
                    json_dirs["id"] = route_proc_directions.length - 2;
                    dirs.push(json_dirs);

                }
            }
            else {
                if (language === "greek") {
                    json_dirs["dir"] = "Προχωρήστε μέχρι <b>" + route_proc_directions[route_proc_directions.length - 2]["from"] + "</b>";
                    json_dirs["id"] = route_proc_directions.length - 2;
                    dirs.push(json_dirs);
                }
                else {
                    json_dirs["dir"] = "Head toward " + route_proc_directions[route_proc_directions.length - 2]["from"];
                    json_dirs["id"] = route_proc_directions.length - 2;
                    dirs.push(json_dirs);
                }
            }

        }
        var json_dirs = {};
        if (typeof route_proc_directions[route_proc_directions.length - 1]["dir"] !== 'undefined' && typeof route_proc_directions[route_proc_directions.length - 1]["from"] !== 'undefined' && typeof route_proc_directions[route_proc_directions.length - 1]["from"] !== 'undefined') {
            if (route_proc_directions[route_proc_directions.length - 1]["dir"] !== "null") {
                if (language === "greek") {
                    if(route_proc_directions[route_proc_directions.length - 1]["from"] === "null")
                        json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[route_proc_directions.length - 1]["dir"] + "</b> προς <b>" + route_proc_directions[route_proc_directions.length - 1]["to"] + "</b>";
                    else
                        json_dirs["dir"] = "Προχωρήστε <b>" + route_proc_directions[route_proc_directions.length - 1]["dir"] + "</b> από <b>" + route_proc_directions[route_proc_directions.length - 1]["from"] + "</b> προς <b>" + route_proc_directions[route_proc_directions.length - 1]["to"] + "</b>";
                    json_dirs["id"] = route_proc_directions.length - 1;
                    dirs.push(json_dirs);
                }
                else {
                    json_dirs["dir"] = "Head " + route_proc_directions[route_proc_directions.length - 1]["dir"] + " on " + route_proc_directions[route_proc_directions.length - 1]["from"] + " toward " + route_proc_directions[route_proc_directions.length - 1]["to"];
                    json_dirs["id"] = route_proc_directions.length - 1;
                    dirs.push(json_dirs);
                }
            }
            else if (language === "greek") {
                json_dirs["dir"] = "Προχωρήστε μέχρι <b>" + route_proc_directions[route_proc_directions.length - 1]["from"] + "</b>";
                json_dirs["id"] = route_proc_directions.length - 1;
                dirs.push(json_dirs);
            }
            else {

                json_dirs["dir"] = "Head toward " + route_proc_directions[route_proc_directions.length - 1]["from"];
                json_dirs["id"] = route_proc_directions.length - 1;
                dirs.push(json_dirs);

            }
        }
        return dirs;

}
/**
 * Get the element's id of a bus code
 * @param current_bus
 * @returns {number}
 */
function getElementId(current_bus) {

    var elem;
    for (var i = 0; i <= bus_codes.length - 1; i++) {

        if (bus_codes[i] === "none") {
            continue;
        }
        if (current_bus === bus_codes[i])
            return i - 1;
    }
}
/**
 * Calculate and return the final and main directions of a transit route
 * @returns {Array}
 */
function get_route_main_directions_transit() {

    var bus_codes_without_none = bus_codes.slice(0);
    var index = bus_codes_without_none.indexOf("none");
	var index2 = bus_codes_without_none.indexOf("allo");

    if (index > -1) {
        for (var i = bus_codes_without_none.length - 1; i >= 0; i--) {
            if (bus_codes_without_none[i] === "none") {
                bus_codes_without_none.splice(i, 1);
            }
        }
    }
	
	if(index2 > -1) {
		for (var i = bus_codes_without_none.length - 1; i >= 0; i--) {
            if (bus_codes_without_none[i] === "allo") {
                bus_codes_without_none.splice(i, 1);
            }
        }
	}
	
	console.log(bus_codes_without_none);

    var final_bus_directions = [];
    var current_bus_codes = []; //pinakas me current bus mesa se kathe vhma
    var elem = {};
    var bus_code_name = []; //pinakas px ["Dimarxeio", "1"]
		
	/*for (var k = 0; k <= bus_codes_without_none.length - 1; k++) {
		try {
			if(bus_codes_without_none[k].split("_")[1] == bus_codes_without_none[k+1].split("_")[1] && bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k+2].split("_")[1] && bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k-1].split("_")[1] && bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k-2].split("_")[1]  && bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k+2].split("_")[1]) {
				bus_codes_without_none.splice(k, 2);
			}
		}
		catch (TypeError) {    // "none"
			console.log(TypeError);
			continue;	// go to the next bus node          
		}
	}
	
	if(bus_codes_without_none[0].split("_")[1] == bus_codes_without_none[1].split("_")[1] && bus_codes_without_none[0].split("_")[1] != bus_codes_without_none[2].split("_")[1] && bus_codes_without_none[0].split("_")[1] != bus_codes_without_none[3].split("_")[1]) {
		bus_codes_without_none.splice(0, 2);
	}
	
	if(bus_codes_without_none[bus_codes_without_none.length-1].split("_")[1] == bus_codes_without_none[bus_codes_without_none.length-2].split("_")[1] && bus_codes_without_none[bus_codes_without_none.length-2].split("_")[1] != bus_codes_without_none[bus_codes_without_none.length-3].split("_")[1] && bus_codes_without_none[bus_codes_without_none.length-2].split("_")[1] != bus_codes_without_none[bus_codes_without_none.length-4].split("_")[1]) {
		bus_codes_without_none.splice(bus_codes_without_none.length-2, 2);
	}
	
	console.log(bus_codes_without_none);*/
	
    if (bus_codes_without_none[0].split("_")[1] != bus_codes_without_none[1].split("_")[1]) { //an einai ta 2 prwta diaforetika noumera px ["Βασσάνη_1", "Δημαρχείο_2",...]
        if ((bus_codes_without_none[0].split("_")[0] == bus_codes_without_none[1].split("_")[0]) && (bus_codes_without_none[0].split("_")[1] == bus_codes_without_none[2].split("_")[1])) {
            //an einai ta 2 prwta diaforetika noumera, idia onomata kai to 1o me to 3o idia noumera px ["Δημαρχείο_1", "Δημαρχείο_2", "Ερμού_1",...]
			bus_code_name = bus_codes_without_none[0].split("_");
        }
		else if ((bus_codes_without_none[0].split("_")[0] != bus_codes_without_none[1].split("_")[0]) && (bus_codes_without_none[0].split("_")[1] == bus_codes_without_none[2].split("_")[1]) && (bus_codes_without_none[1].split("_")[0] == bus_codes_without_none[2].split("_")[0])) {
            //an einai ta 2 prwta diaforetika noumera, diaforetika onomata kai to 1o me to 3o idia noumera kai to 2o me to 3o idia onomata px ["Δημαρχείο_1", "Παλαια_2", "Παλαια_1",...]
			bus_code_name = bus_codes_without_none[1].split("_");
        }
		else if ((bus_codes_without_none[0].split("_")[0] != bus_codes_without_none[1].split("_")[0]) && (bus_codes_without_none[0].split("_")[1] == bus_codes_without_none[2].split("_")[1])) {
            //an einai ta 2 prwta diaforetika noumera, diaforetika onomata kai to 1o me to 3o idia noumera px ["Δημαρχείο_1", "Σόλωνος_2", "Ερμού_1",...]
			bus_code_name = bus_codes_without_none[0].split("_");
        }
        else {
            bus_code_name = bus_codes_without_none[1].split("_");
        }
    }
    else {
        bus_code_name = bus_codes_without_none[0].split("_");
    }

    // The first direction of the route
    elem["mode"] = "foot";
    if (language === "greek")
        elem["dir"] = "Επιβιβαστείτε στο λεωφορείο " + bus_code_name[1] + " στη σταση <b>" + bus_code_name[0] + "</b>";
    else
        elem["dir"] = "Get the bus " + bus_code_name[1] + " from the station <b>" + bus_code_name[0] + "</b>";
    elem["id"] = 0;
    final_bus_directions.push(elem);
    elem = {};
    elem["mode"] = "bus";
    if (language === "greek")
        elem["dir"] = "Συνεχίστε με το λεωφορείο " + bus_code_name[1];
    else
        elem["dir"] = "Continue with bus " + bus_code_name[1];
    elem["id"] = 1;
    final_bus_directions.push(elem);

    current_bus_codes.push(bus_code_name[1]);

    // Middle directions of the route

    var current_bus = bus_code_name[1]; //px "1"
    var current_bus_id = 0;
    var current_bus_name = bus_code_name[0]; //px "Dimarxeio"

    for (var k = 1; k < bus_codes_without_none.length - 1; k++) {
        try {

            if (bus_codes_without_none[k].split("_")[1] === current_bus) {
                current_bus_id = k; //if the same bus then go to next node
                continue;	// go to the next bus node
            }
            else {
                if (code_exists(bus_codes_without_none[k].split("_")[1], current_bus_codes)) {
                    continue; //an to prohgoumeno current bus einai idio me to twrino tou for tote aplws sunexise sto epomeno
                }
                else if (bus_codes_without_none[k].split("_")[1] == bus_codes_without_none[bus_codes_without_none.length - 1].split("_")[1]) { //an exei ftasei sto teleutaio pou uparxei sth lista
                    if (bus_codes_without_none[k].split("_")[0] != bus_codes_without_none[k - 1].split("_")[0]) {

                        if ((bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k - 1].split("_")[1]) && (bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k + 1].split("_")[1]) && (bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k + 2].split("_")[1])) { //se periptwsh pou bgainei sta anamesa kapoio ksekarfwto mono tou to paraleipoume
                            continue;
                        }
                        elem = {};
                        elem["mode"] = "foot";
                        if (language === "greek")
                            elem["dir"] = "Αποβιβαστείτε απο το λεωφορείο " + current_bus + " στη στάση <b>" + bus_codes_without_none[k-1].split("_")[0] + "</b>";
                        else
                            elem["dir"] = "Get off the bus " + current_bus + " from the station <b>" + bus_codes_without_none[k-1].split("_")[0] + "</b>";
                        var currentId = getElementId(bus_codes_without_none[k]);
                        elem["id"] = currentId;
                        final_bus_directions.push(elem);
                        elem = {};
                        elem["mode"] = "foot";
                        if (language === "greek")
                            elem["dir"] = "Eπιβιβαστείτε στο λεωφορείο " + bus_codes_without_none[k].split("_")[1] + " στη στάση <b>" + bus_codes_without_none[k].split("_")[0] + "</b>";
                        else
                            elem["dir"] = "Get the bus " + bus_codes_without_none[k].split("_")[1] + " from the station <b>" + bus_codes_without_none[k].split("_")[0] + "</b>";
                        elem["id"] = currentId + 1;
                        final_bus_directions.push(elem);

                        elem = {};
                        elem["mode"] = "bus";
                        if (language === "greek")
                            elem["dir"] = "Συνεχίστε με το λεωφορείο " + bus_codes_without_none[k].split("_")[1];
                        else
                            elem["dir"] = "Continue with bus " + bus_codes_without_none[k].split("_")[1];
                        elem["id"] = currentId + 4;
                        final_bus_directions.push(elem);

                        current_bus_codes.push(bus_codes_without_none[k].split("_")[1]);

                        current_bus = bus_codes_without_none[k].split("_")[1];
                        current_bus_name = bus_codes_without_none[k].split("_")[0];

                        break;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    if ((bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k - 1].split("_")[1]) && (bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k + 1].split("_")[1]) && (bus_codes_without_none[k].split("_")[1] != bus_codes_without_none[k + 2].split("_")[1])) { //se periptwsh pou bgainei sta anamesa kapoio ksekarfwto mono tou to paraleipoume
                        continue;
                    }
					if (bus_codes_without_none[k].split("_")[0] != bus_codes_without_none[k - 1].split("_")[0]) {
                        elem = {};
                        elem["mode"] = "foot";
                        if (language === "greek")
                            elem["dir"] = "Αποβιβαστείτε απο το λεωφορείο " + current_bus + " στη στάση <b>" + bus_codes_without_none[k-1].split("_")[0] + "</b>";
                        else
                            elem["dir"] = "Get off the bus " + current_bus + " from the station <b>" + bus_codes_without_none[k-1].split("_")[0] + "</b>";
                        var currentId = getElementId(bus_codes_without_none[k]);
                        elem["id"] = currentId;
                        final_bus_directions.push(elem);

                        elem = {};
                        elem["mode"] = "foot";
                        if (language === "greek")
                            elem["dir"] = "Eπιβιβαστείτε στο λεωφορείο " + bus_codes_without_none[k].split("_")[1] + " στη στάση <b>" + bus_codes_without_none[k].split("_")[0] + "</b>";
                        else
                            elem["dir"] = "Get the bus " + bus_codes_without_none[k].split("_")[1] + " from the station <b>" + bus_codes_without_none[k].split("_")[0] + "</b>";

                        elem["id"] = currentId + 1;
                        final_bus_directions.push(elem);
                        current_bus_id = k;		// Update value

                        elem = {};
                        elem["mode"] = "bus";
                        if (language === "greek")
                            elem["dir"] = "Συνεχίστε με το λεωφορείο " + bus_codes_without_none[k].split("_")[1];
                        else
                            elem["dir"] = "Continue with bus " + bus_codes_without_none[k].split("_")[1];
                        elem["id"] = currentId + 4;
                        final_bus_directions.push(elem);

                        current_bus_codes.push(bus_codes_without_none[k].split("_")[1]);
                        current_bus = bus_codes_without_none[k].split("_")[1];
                        current_bus_name = bus_codes_without_none[k].split("_")[0];
                    }
                    else {
                        continue;
                    }
                }

            }
        }
        catch (TypeError) {    // "none"
            console.log(TypeError);
            continue;	// go to the next bus node          
        }
    }

    // The last direction of route
    elem = {};
    if (bus_codes_without_none[bus_codes_without_none.length - 1].split("_")[0] == bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[0]) { //an ta 2 teleutaia onomata stasewn einai idia tote to lewforeio menei to idio
        bus_code_name[0] = bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[0];
        bus_code_name[1] = bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[1];
        elem["id"] = bus_codes.length - 1;
    }
    else if (bus_codes_without_none[bus_codes_without_none.length - 1].split("_")[1] != bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[1] && bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[1] == bus_codes_without_none[bus_codes_without_none.length - 3].split("_")[1]) { //an to teleutaio noumero einai ksekarfwto meine sto prohgoumeno
        bus_code_name[0] = bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[0];
        bus_code_name[1] = bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[1];
        elem["id"] = bus_codes.length - 1;
    }
	else if (bus_codes_without_none[bus_codes_without_none.length - 1].split("_")[1] != bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[1] && bus_codes_without_none[bus_codes_without_none.length - 2].split("_")[1] != bus_codes_without_none[bus_codes_without_none.length - 3].split("_")[1]) { //an ta teleutaia 2 noumera einai ksekarfwta meine sto prohgoumeno
		bus_code_name[0] = bus_codes_without_none[bus_codes_without_none.length - 3].split("_")[0];
        bus_code_name[1] = bus_codes_without_none[bus_codes_without_none.length - 3].split("_")[1];
        elem["id"] = bus_codes.length - 1;
    }
    else {
        bus_code_name = bus_codes_without_none[bus_codes_without_none.length - 1].split("_");
        elem["id"] = bus_codes.length - 1;
    }

    elem["mode"] = "foot";
    if (language === "greek")
        elem["dir"] = "Αποβιβαστείτε απο το λεωφορειο " + bus_code_name[1] + " στη στάση <b>" + bus_code_name[0] + "</b>";
    else
        elem["dir"] = "Get off the bus " + bus_code_name[1] + " from the station <b>" + bus_code_name[0] + "</b>";
    final_bus_directions.push(elem);


    return final_bus_directions;

}

/**
 * Calculate and return the final and main directions of a transit route - case 2 (limited points)
 * @returns {Array}
 */
function get_final_directions_2() {

    for (var i = 0; i < route_proc_directions.length; i++) {
        try {

            if (route_proc_directions[i]["dir"] === "null" && route_proc_directions[i]["from"] === "null" && route_proc_directions[i]["to"] === "null")
                continue;
            if (typeof route_proc_directions[i]["dir"] === 'undefined' || typeof route_proc_directions[i]["from"] === 'undefined' || typeof route_proc_directions[i]["to"] === 'undefined')
                continue;
            if (route_proc_directions[i]["dir"] === "null" && route_proc_directions[i]["to"] === "null") {
            }
            else {
                if (route_proc_directions[i]["from"] === route_proc_directions[i + 1]["to"]) {
                    route_proc_directions[i + 1]["dir"] = "null";
                    route_proc_directions[i + 1]["from"] = "null";
                    route_proc_directions[i + 1]["to"] = "null";

                }
            }
        }
        catch (TypeError) {
        }
    }

    var curr_direction;
    if (language === "greek"){
        if(route_proc_directions[0]["from"] === "null")
            curr_direction = "Προχωρήστε μέχρι ";
        else
            curr_direction = "Προχωρήστε από <b>" + route_proc_directions[0]["from"] + "</b> μέχρι ";
    }
    else{
        if(route_proc_directions[0]["from"] === "null")
            urr_direction = "Go on until ";
        else
            curr_direction = "Go on from <b>" + route_proc_directions[0]["from"] + "</b> until ";
    }
    var curr_direction_from = route_proc_directions[0]["from"];
    var curr_direction_to = route_proc_directions[0]["to"];
    var curr_direction_dir = route_proc_directions[0]["dir"];
    var las_curr_to;
    var last_curr_dir = route_proc_directions[0]["dir"];
    var last_dir_id = 0;
    var json_dirs = {};

    for (var i = 1; i < route_proc_directions.length; i++) {

        json_dirs = {};
        if (route_proc_directions[i]["dir"] === "null" && route_proc_directions[i]["from"] === "null" && route_proc_directions[i]["to"] === "null") {
            continue;	// ignore broken directions
        }

        if (route_proc_directions[i]["from"] === curr_direction_from) {	// We are in the same road

            curr_direction_to = route_proc_directions[i]["to"];
            last_curr_dir = route_proc_directions[i]["dir"];
            //dijkstra_route_direction_content.push("null"); // wrong
            continue;

        } else {		// There is a turn
            if(curr_direction_to === "null")
                if(language === "greek")
                    curr_direction = curr_direction + "τον επόμενο δρόμο";
                else
                    curr_direction = curr_direction + "until the next road";        
            else
                curr_direction = curr_direction + "<b>" + curr_direction_to + "</b>";	// add the last direction["to"]

            json_dirs["dir"] = curr_direction;
            json_dirs["id"] = last_dir_id;
            dirs.push(json_dirs);	// Save direction

            // Update values
            last_dir_id = i;
            curr_direction_from = route_proc_directions[i]["from"];
            curr_direction_to = route_proc_directions[i]["to"];
            curr_direction_dir = route_proc_directions[i]["dir"];

            // Now we must change road
            // 1. Check if there is a turn
            if (curr_direction_dir !== last_curr_dir) {
                if (language === "greek") {
                    if (curr_direction_from === "null")
                        curr_direction = "Στρίψτε <b>" + get_turn(last_curr_dir, curr_direction_dir) + "</b> και προχωρήστε μέχρι ";
                    else
                        curr_direction = "Στρίψτε <b>" + get_turn(last_curr_dir, curr_direction_dir) + "</b> στην <b>" + curr_direction_from + "</b> και προχωρήστε μέχρι ";
                }
                else {
                    if (curr_direction_from === "null")
                        curr_direction = "Turn <b>" + get_turn(last_curr_dir, curr_direction_dir) + "</b> and go on until ";
                    else
                        curr_direction = "Turn <b>" + get_turn(last_curr_dir, curr_direction_dir) + "</b> to <b>" + curr_direction_from + "</b> and go on until ";
                }
            }
            else {
                if (route_proc_directions[i]["from"] !== "null") {

                    if (language === "greek")
                        curr_direction = "Προχωρήστε απο <b>" + route_proc_directions[i]["from"] + "</b> προς ";
                    else
                        curr_direction = "Go on from <b>" + route_proc_directions[i]["from"] + "</b> toward ";
                }
                else {

                    if (language === "greek")
                        curr_direction = "Προχωρήστε ευθεία προς ";
                    else
                        curr_direction = "Go on toward ";
                }
            }
        }
    }
    try {
        // Check if the last direction have been added or not	
        if (route_proc_directions[route_proc_directions.length - 1]["to"] !== "null")
            curr_direction = curr_direction + "<b>" + route_proc_directions[route_proc_directions.length - 1]["to"] + "</b>";
        else
            curr_direction = curr_direction + "<b>" + route_proc_direc + "<b>" + route_proc_directions[route_proc_directions.length - 2]["to"] + "</b>";
    }
    catch (TypeError) {
    }

    json_dirs["dir"] = curr_direction;
    json_dirs["id"] = last_dir_id;
    var exists = true;
    // Chek if the last directions exists
    for (var i = 0; i < dirs.length; i++) {
        if (dirs[i]["dir"] === curr_direction)
            exists = false;
    }

    if (exists) {
        dirs.push(json_dirs);
    }

    return dirs;

}
/**
 * Calculates and returns the tunr of a current direction
 * @param val1
 * @param val2
 * @returns {*}
 */
function get_turn(val1, val2) {

    if (language === "greek") {
        if (val1 === "νοτιοδυτικά" && val2 === "νοτιοανατολικά")
            return "αριστερά";
        else if (val1 === "νοτιοανατολικά" && val2 === "βορειοανατολικά")
            return "αριστερά";
        else if (val1 === "βορειοανατολικά" && val2 === "νοτιοανατολικά")
            return "δεξιά";
        else if (val1 === "νοτιοανατολικά" && val2 === "νοτιοδυτικά")
            return "δεξιά";
        else if (val1 === "νοτιοδυτικά" && val2 === "βορειοανατολικά")
            return "δεξιά";
        else if (val1 === "βορειοδυτικά" && val2 === "βορειοανατολικά")
            return "δεξιά"
        else if (val1 === "νότια" && val2 === "βορειοανατολικά")
            return "αριστερά";
        else if (val1 === "βορειοανατολικά" && val2 === "νότια")
            return "δεξιά";
        else if (val1 === "βορειοανατολικά" && val2 === "νοτιοδυτικά")
            return "αριστερά";
        else if (val1 === "νοτιοδυτικά" && val2 === "βορειοδυτικά")
            return "δεξιά";
        else if (val1 === "νοτιοανατολικά" && val2 === "βόρεια")
            return "δεξιά";
        else if (val1 === "βορειοανατολικά" && val2 === "βορειοδυτικά")
            return "αριστερά";
        else if (val1 === "ανατολικά" && val2 === "νοτιοανατολικά")
            return "δεξιά";
        else if (val1 === "νοτιοανατολικά" && val2 === "ανατολικά")
            return "αριστερά";
        else if (val1 === "βόρεια" && val2 === "βορειοανατολικά")
            return "δεξιά";
        else if (val1 === "βορειοανατολικά" && val2 === "βορεια")
            return "αριστερά";
        else if (val1 === "βορειοδυτικά" && val2 === "νοτιοανατολικά")
            return "δεξιά";
        else if (val1 === "νοτιοδυτικά" && val2 === "νότια")
            return "δεξιά";
        else if (val1 === "null" && val2 !== "null")
            return val2;
        else if (val1 !== "null" && val2 === "null")
            return val1;
        else {
            return "";
        }

    }
    else {
        if (val1 === "southwest" && val2 === "southeast")
            return "left";
        else if (val1 === "southeast" && val2 === "northeast")
            return "left";
        else if (val1 === "northeast" && val2 === "southeast")
            return "right";
        else if (val1 === "southeast" && val2 === "southwest")
            return "right";
        else if (val1 === "southwest" && val2 === "northeast")
            return "right";
        else if (val1 === "northwest" && val2 === "northeast")
            return "right"
        else if (val1 === "southerly" && val2 === "northeast")
            return "left";
        else if (val1 === "northeast" && val2 === "southerly")
            return "right";
        else if (val1 === "northeast" && val2 === "southwest")
            return "left";
        else if (val1 === "southwest" && val2 === "northwest")
            return "right";
        else if (val1 === "southeast" && val2 === "north")
            return "right";
        else if (val1 === "northeast" && val2 === "northwest")
            return "left";
        else if (val1 === "eastward" && val2 === "southeast")
            return "right";
        else if (val1 === "southeast" && val2 === "eastward")
            return "left";
        else if (val1 === "north" && val2 === "northeast")
            return "right";
        else if (val1 === "northeast" && val2 === "north")
            return "left";
        else if (val1 === "northwest" && val2 === "southeast")
            return "right";
        else if (val1 === "southwest" && val2 === "southerly")
            return "right";
        else if (val1 === "null" && val2 !== "null")
            return val2;
        else if (val1 !== "null" && val2 === "null")
            return val1;
        else {
            return "";
        }
    }

}
/**
 * Returns the direction's id
 * @param direction
 * @returns {number}
 */
function get_direction_id(direction) {
    //console.log("direction is"+direction);
    for (var i = 0; i < dijkstra_route_direction_content.length; i++) {

        var con = dijkstra_route_direction_content[i].replace(/<b>/g, '').replace(/x/g, ".").replace(/<.b>/g, "");

        if (con === direction) {
            return i;
        }

    }

    return 4;
}


/**
 *
 * @param code
 * @param all_codes
 * @returns {boolean}
 */
function code_exists(code, all_codes) {

    for (var i = 0; i < all_codes.length; i++) {
        if (all_codes[i] == code) {
            return true;
        }
    }

    return false;

}

/**
 * Check if a direction already exists
 * @param direction
 * @param all_direction_json
 * @returns {boolean}
 */
function direction_exists(direction, all_direction_json) {

    for (var i = 0; i < all_direction_json.length; i++) {
        if (all_direction_json[i]["dir"] === direction) {
            return true;
        }
    }
    return false;

}
/**
 * This is the main function which calculates and draws the route on the map
 * @param service
 * @param waypoints
 * @param userFunction
 * @param waypointIndex
 * @param path
 */
function gDirRequest(service, waypoints, userFunction, waypointIndex, path) {
    // Set defaults
    waypointIndex = typeof waypointIndex !== 'undefined' ? waypointIndex : 0;
    path = typeof path !== 'undefined' ? path : [];

    // Get next set of waypoints
    var s = gDirGetNextSet(waypoints, waypointIndex);
    var startl = s[0].shift()["location"];
    var endl = s[0].pop()["location"];
    var request = {
        origin: startl,
        destination: endl,
        waypoints: s[0],
        travelMode: google.maps.TravelMode.WALKING,	// travelMode: google.maps.TravelMode[curr_mode],
        unitSystem: google.maps.UnitSystem.METRIC,
        optimizeWaypoints: false,
        provideRouteAlternatives: false,
        avoidHighways: false,
        avoidTolls: false
    };

    service.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            path = path.concat(response.routes[0].overview_path);
            var routes = response.routes;

            for (var rte in routes) {

                var legs = routes[rte].legs;
                for (var leg in legs) {
                    var steps = legs[leg].steps;
                    var route_json_data = {};

                    route_json_data["distance"] = steps[0].distance.text;
                    route_json_data["duration"] = steps[0].duration.text;

                    if (route_mode !== "TRANSIT") {
                        try {
                            proc_direction(steps[0].instructions);
                        }
                        catch (TypeError) {
                        }
                    }
                    min_route_directions.push(route_json_data);
                }

            }

            oldpath = path;
            if (s[1] != null) {
                lastIndx = s[1];
                gDirRequest(service, waypoints, userFunction, s[1], path);
            } else {
                userFunction(path);
            }

        } else {
            path = oldpath;
            lastIndx = lastIndx + 1;
            if (s[lastIndx] != null) {
                gDirRequest(service, waypoints, userFunction, lastIndx, path);
            }
            else {
                userFunction(path);
            }
        }

    });
}
/**
 * The service for drawing on the map
 * @param waypoints
 * @param startIndex
 * @returns {*}
 */
function gDirGetNextSet(waypoints, startIndex) {

    var MAX_WAYPOINTS_PER_REQUEST = 8;

    var w = [];    // array of waypoints to return

    if (startIndex > waypoints.length - 1) {
        return [w, null];
    } // no more waypoints to process

    var endIndex = startIndex + MAX_WAYPOINTS_PER_REQUEST;

    // adjust waypoints, because Google allows us to include the start and destination latlongs for free!
    endIndex += 2;

    if (endIndex > waypoints.length - 1) {
        endIndex = waypoints.length;
    }

    for (var i = startIndex; i < endIndex; i++) {
        w.push(waypoints[i]);
    }

    if (endIndex != waypoints.length) {
        return [w, endIndex -= 1];
    } else {
        return [w, null];
    }
}
/**
 * Calculate the total time and the distance of the route
 */
function get_total_dis_time() {

    var current_route_mode;
    if (route_mode === "BICYCLING")
        current_route_mode = "DRIVING";
    else
        current_route_mode = route_mode;
    var total_dis_time = [];

    var request = {
        origin: calculated_route_points[0],
        destination: dijkstra_current_route_points[dijkstra_current_route_points.length - 1].position,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode[current_route_mode]
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            var routes = result.routes;
            for (var rte in routes) {
                var legs = routes[rte].legs;

                for (var leg in legs) {
                    var steps = legs[leg].steps;
                    total_dis_time.push(legs[0].distance.text);
                    total_dis_time.push(legs[0].duration.text);
                }
                break;      // Use only the first route
            }
            var time;
            var distance;
			var timeOffset;
            if(route_mode === "BICYCLING"){
				//console.log(total_dis_time); //total_dis_time[0] -> km , total_dis_time[1] -> mins
				
				if(parseInt(total_dis_time[1]) >= 1 && parseInt(total_dis_time[1]) < 3) 
					timeOffset = parseInt(total_dis_time[1]) + 2;
				else if(parseInt(total_dis_time[1]) >= 3 && parseInt(total_dis_time[1]) < 4) 
					timeOffset = parseInt(total_dis_time[1]) + 4;
				else if(parseInt(total_dis_time[1]) >= 4 && parseInt(total_dis_time[1]) < 7)
					timeOffset = parseInt(total_dis_time[1]) + 7;
				else if(parseInt(total_dis_time[1]) >= 7 && parseInt(total_dis_time[1]) < 10)
					timeOffset = parseInt(total_dis_time[1]) + 10;
				else if(parseInt(total_dis_time[1]) >= 10 && parseInt(total_dis_time[1]) < 13)
					timeOffset = parseInt(total_dis_time[1]) + 14;
				else if(parseInt(total_dis_time[1]) >= 13  && parseInt(total_dis_time[1]) < 16)
					timeOffset = parseInt(total_dis_time[1]) + 18;
				else if(parseInt(total_dis_time[1]) >= 16  && parseInt(total_dis_time[1]) < 19)
					timeOffset = parseInt(total_dis_time[1]) + 20;
				else if(parseInt(total_dis_time[1]) >= 19 )
					timeOffset = parseInt(total_dis_time[1]) + 25;
				
                if(language === "greek"){
					
					distance = total_dis_time[0];
					time = timeOffset + " λεπτά";     

                }else{
                   
					distance = total_dis_time[0];
                    time = timeOffset + " mins";
                    
                }
                console.log(time + "," + distance);
            }
            else{

                distance = total_dis_time[0];
                time = total_dis_time[1];

            }

            $("#route_total_length").empty().append(distance + " -  ");
            $("#route_total_time").empty().append(time + " - ");

            var route = $("#dijkstra_route_container").html();
            dijkstra_current_route_directions = route;
            console.log(dijkstra_current_route_directions);
        }
        else {
            console.log("ERROR, CALL AGAIN......");
			// === if we were sending the requests to fast, try this one again and increase the delay
		  if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
			nextAddress--;
			delay++;
		  } else {
			var reason="Code "+status;
			var msg = 'address="' + search + '" error=' +reason+ '(delay='+delay+'ms)<br>';
			document.getElementById("messages").innerHTML += msg;
		  }  
        }
    });

}
/**
 * Calculate the total time and the distance of a transit route
 */
var transit_flag = 0;
function get_total_dis_timeTransit(transitWaypts) {

    total_dis_timeMIDDLE = [];
	
    var request = {
        origin: transitWaypts[0].location,
        destination: transitWaypts[transitWaypts.length-1].location,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode["DRIVING"]
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            var routes = result.routes;
			console.log(routes);
            for (var rte in routes) {
                var legs = routes[rte].legs;
				console.log(legs);
                for (var leg in legs) {
                    var steps = legs[leg].steps;
                    total_dis_timeMIDDLE.push(legs[0].distance.text);
                    total_dis_timeMIDDLE.push(legs[0].duration.text);
                }
                break;      // Use only the first route
            }
			
			for(var i=0; i<total_dis_timeSTART.length; i++) {}
			
			var time1 = total_dis_timeSTART[i-1].split(" ")[0];
			var time2 = total_dis_timeMIDDLE[1].split(" ")[0];
			var time3 = total_dis_timeEND[i-1].split(" ")[0];

			console.log(total_dis_timeSTART);
			console.log(total_dis_timeMIDDLE);
			console.log(total_dis_timeEND);
			
			var distance1;
			var distance2;
			var distance3;
			
			if(total_dis_timeSTART[i-2].split(" ")[1] == "χλμ" || total_dis_timeSTART[i-2].split(" ")[1] == "km") 
				distance1 = total_dis_timeSTART[i-2].split(" ")[0].replace(",", ".");
			else if(total_dis_timeSTART[i-2].split(" ")[1] == "μ" || total_dis_timeSTART[i-2].split(" ")[1] == "m") 
				distance1 = getMeters(total_dis_timeSTART[i-2].split(" ")[0]);
			
			if(total_dis_timeMIDDLE[0].split(" ")[1] == "χλμ" || total_dis_timeMIDDLE[0].split(" ")[1] == "km") 
				distance2 = total_dis_timeMIDDLE[0].split(" ")[0].replace(",", ".");
			else if(total_dis_timeMIDDLE[0].split(" ")[1] == "μ" || total_dis_timeMIDDLE[0].split(" ")[1] == "m") 
				distance2 = getMeters(total_dis_timeMIDDLE[0].split(" ")[0]);
			
			if(total_dis_timeEND[i-2].split(" ")[1] == "χλμ" || total_dis_timeEND[i-2].split(" ")[1] == "km") 
				distance3 = total_dis_timeEND[i-2].split(" ")[0].replace(",", ".");
			else if(total_dis_timeEND[i-2].split(" ")[1] == "μ" || total_dis_timeEND[i-2].split(" ")[1] == "m") 
				distance3 = getMeters(total_dis_timeEND[i-2].split(" ")[0]);
			
            var finalDistanceStart = parseFloat(distance1);
            var finalDistanceMiddle = parseFloat(distance2);
            var finalDistanceEnd = parseFloat(distance3);

            var finalTimeStart = parseFloat(time1);
            var finalTimeMiddle = parseFloat(time2);
            var finalTimeEnd = parseFloat(time3);

            var finalDistance = finalDistanceStart + finalDistanceMiddle + finalDistanceEnd;
            var finalTime = finalTimeStart + finalTimeMiddle + finalTimeEnd;
			
			var finalWalk = finalDistanceStart + finalDistanceEnd;
            console.log(finalDistanceStart + "," + finalDistanceMiddle + "," + finalDistanceEnd);
            // Clear mode icon div
            $("#mode_icon").empty();

            if (language === "english") {
                $("#route_total_length").empty().append("<b>Total Distance:</b> " + finalDistance.toFixed(1) + " km");
                var walkTime = parseFloat(finalTimeStart) + parseFloat(finalTimeEnd);
                var finalTimeDetails = "<br><br><img src='img/walk_icon.png' height='20' width=20/> " + walkTime + " min -> "+ finalWalk.toFixed(1) +" km, <img src='img/bus_icon.png' height='20' width=20/>" + finalTimeMiddle + " min ->"+ finalDistanceMiddle.toFixed(1) +" km";
                $("#route_total_time").empty().append("<b>Total Time:</b> " + finalTime + " min " + finalTimeDetails);
            } else {
                $("#route_total_length").empty().append("<b>Συνολική Απόσταση:</b> " + finalDistance.toFixed(1) + " χλμ");
                var walkTime = parseFloat(finalTimeStart) + parseFloat(finalTimeEnd);
                var finalTimeDetails = "<br><br><img src='img/walk_icon.png' height='20' width=20/> " + walkTime + " λεπτά -> "+ finalWalk.toFixed(1) +" χλμ, <img src='img/bus_icon.png' height='20' width=20/> " + finalTimeMiddle + " λεπτά ->"+ finalDistanceMiddle.toFixed(1) +" χλμ";
                $("#route_total_time").empty().append("<b>Συνολικός Χρόνος:</b> " + finalTime + " λεπτά " + finalTimeDetails);
            }

            var route = $("#dijkstra_route_container").html();
            dijkstra_current_route_directions = route;
            //console.log(dijkstra_current_route_directions);
        }
        else {
            console.log("ERROR, CALL AGAIN......");
				// === if we were sending the requests to fast, try this one again and increase the delay
			  if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				nextAddress--;
				delay++;
			  } else {
				var reason="Code "+status;
				var msg = 'address="' + search + '" error=' +reason+ '(delay='+delay+'ms)<br>';
				document.getElementById("messages").innerHTML += msg;
			  }   
        }
		//next();
    });

}

function getMeters(i) {
     return i*0.001;
}

/**
 * This is the main function which starts the process of drawing the Dijkstra route on the map
 * @param data =  the waypoints returned from Dijkstra
 */
function main(data) {

    min_route_directions = [];
    // Get maindirections and draw on map
    gDirRequest(directionsService, data, function drawGDirLine(path) {		// function drawGDirLine is a callback function

        $("#dijkstra_route").empty();
        var content;
        if(change_addresses_flag == 0)
            content = "<div style='display:inline-block; background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-start.png' /><span id='directions_div_src_address' style='float:left;margin-left:5px;'>" + route_source_point_address + "</span></div><br>"
        else
            content = "<div style='display:inline-block; background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-start.png' /><span id='directions_div_src_address' style='float:left;margin-left:5px;'>" + route_destination_point_address + "</span></div><br>"
        $("#dijkstra_route").append(content);

        /*if (route_mode === "WALKING") {
            var dijkstra_line = new google.maps.Polyline({
                clickable: true,
                map: map,
                path: path,
                strokeColor: "blue",
                strokeOpacity: 0.4,
                strokeWeight: 4
            });
        }*/
        var c = 2;
        var starl_line_c = start_line_directions_counter;		// # of directions added from start polyline
        if (destination_is_island)
            show_port_marker();

		
		setTimeout(function () {
			if (route_mode === "TRANSIT") {

				for (var i = 0; i < min_route_directions.length; i++) {
					counter_step = parseInt(i) + 1;
					var id = parseInt(i) + parseInt(starl_line_c);
					var dir_nr = id + 1;
					c = c + 1;
				}
				// Append the start directions we have already calculated
				var id, direction, id, coun;
				for (var i = 0; i < route_start_directions.length; i++) {	// Start directions
					//var id = parseInt(i)+1;
					direction = route_start_directions[i]["directions"];
					id = route_start_directions[i]["start_point"];
					coun = parseInt(i) + 1;

					content = "<div class='min_route_step_google' id='" + id + "'>" + coun + ". " + direction + "<span class='route_icon'><img src='img/walk_icon.png' height='20' width='20'></span></div></br>";
					$("#dijkstra_route").append(content);

				}
				var transit_main_dir_counter = 2;
				var route_dirs = get_route_main_directions_transit();

				for (var i = 0; i < route_dirs.length; i++) {

					direction = route_dirs[i]["dir"];
					id = route_dirs[i]["id"];
					//console.log(route_dirs[i]["id"]);
					coun = parseInt(route_start_directions.length) + 1 + parseInt(i);

					if (route_dirs[i]["mode"] === "bus") {
						content = "<div class='min_route_step' id='" + id + "'>" + coun + ". " + direction + "<span class='route_icon'><img src='img/bus_icon.png' height='20' width='20'></span></div></br>";
					}
					else {
						content = "<div class='min_route_step' id='" + id + "'>" + coun + ". " + direction + "<span class='route_icon'><img src='img/bus_icon.png' height='20' width='20'></span></div></br>";
					}
					$("#dijkstra_route").append(content);

				}
				// Append the end directions we already have calculated
				for (var i = 0; i < route_end_directions.length - 1; i++) {
					direction = route_end_directions[i]["directions"];
					id = route_end_directions[i]["start_point"];
					coun = coun + 1;
					content = "<div class='min_route_step_google' id='" + id + "'>" + coun + ". " + direction + "<span class='route_icon'><img src='img/walk_icon.png' height='20' width='20'></span></div></br>";
					$("#dijkstra_route").append(content);

				}
				// After end directions
				if (language === "greek")
					direction = route_end_directions[route_end_directions.length - 1]["directions"];
				else
					direction = route_end_directions[route_end_directions.length - 1]["directions"];
				id = route_end_directions[route_end_directions.length - 1]["start_point"];
				coun = coun + 1;
				content = "<div class='min_route_step_google' id='" + id + "'>" + coun + ". " + direction + "<span class='route_icon'><img src='img/walk_icon.png' height='20' width='20'><br></span></div>";
				$("#dijkstra_route").append(content);

				// Add the destination marker
				if(change_addresses_flag == 0)
                    content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span id='directions_div_dst_address' style='float:left;margin-left:5px;'>" + route_destination_point_address + "</span></div><br>"
				else
                     content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span id='directions_div_dst_address' style='float:left;margin-left:5px;'>" + route_source_point_address + "</span></div><br>"
                
                $("#dijkstra_route").append(content);

				$("#dijkstra_route").show();
				$("#dijkstra_route_container").show();
			}
            directionsLoaded = "true";
		}, 3000);
        
		setTimeout(function () {
			if(route_mode !== "TRANSIT") {

				var route_dirs = get_final_directions_2();	// Main directions
				for (var i = 0; i < min_route_directions.length; i++) {	// Start + end directions
					counter_step = parseInt(i) + 1;
					c = c + 1;
				}
				if (dijkstra_current_route_points.length - 2 > counter_step) {
					draw_extra_lines();
					setTimeout(function () {
						map.setZoom(15);
						map.panBy(-200, 0);
					}, 500);
				}
				else {

					var id, direction, id, coun;

					for (var i = 0; i < route_start_directions.length; i++) {	// Start directions
						direction = route_start_directions[i]["directions"];
						id = route_start_directions[i]["start_point"];
						coun = parseInt(i) + 1;
						content = "<div class='min_route_step_google' id='" + id + "'>" + coun + ". " + direction;
						$("#dijkstra_route").append(content);
					}
					for (var i = 0; i < route_dirs.length; i++) {
						direction = route_dirs[i]["dir"];
						id = route_dirs[i]["id"];
						coun = parseInt(route_start_directions.length) + 1 + parseInt(i);
						content = "<div class='min_route_step' id='" + id + "'>" + coun + ". " + direction;
						$("#dijkstra_route").append(content);

					}

					for (var i = 0; i < route_end_directions.length - 1; i++) {	// End directions
						direction = route_end_directions[i]["directions"];
						id = route_end_directions[i]["start_point"];
						coun = parseInt(coun) + 1;
						content = "<div class='min_route_step_google' id='" + id + "'>" + coun + ". " + direction;
						$("#dijkstra_route").append(content);

					}
					if (language === "greek")
						direction = route_end_directions[route_end_directions.length - 1]["directions"];
					else
						direction = route_end_directions[route_end_directions.length - 1]["directions"];
					id = route_end_directions[route_end_directions.length - 1]["start_point"];
					coun = coun + 1;
					content = "<div class='min_route_step_google' id='" + id + "'>" + coun + ". " + direction;
					$("#dijkstra_route").append(content);

					// Add the destination
					content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span id='directions_div_dst_address' style='float:left;margin-left:5px;'>" + route_destination_point_address + "</span></div><br>"
					$("#dijkstra_route").append(content);
				}
			}
            directionsLoaded = "true";
		}, 3000);
		
        $("#step1_div").slideUp();
        $("#step2_div").slideUp();
        $("#current_route").hide("slow");
        $("#dijkstra_route_container").show("slow");
        $("#step3_div").show("slow", function() {
			$("#remove_source").hide(); 
			$("#remove_destination").hide(); 
			$("#change_addresses_btn").hide();
		});
		
		var transitWaypts = [];

		for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {
			if(dijkstra_current_route_points[i].isBusStop == "true") {
				transitWaypts.push({
					location: dijkstra_current_route_points[i].position
				});
			}
		}
		
        if (route_mode === "TRANSIT")
			setTimeout(function(){ get_total_dis_timeTransit(transitWaypts); }, 1000);
        else
			setTimeout(function(){ get_total_dis_time(); }, 1000);

        if (route_mode === "BICYCLING")
            $("#mode_icon").empty().append("<img src='img/bicycle_icon.png' height='20' width=20/>");
        else if (route_mode === "DRIVING")
            $("#mode_icon").empty().append(" <img src='img/driving_icon.png' height='20' width=20/>");
        else if (route_mode === "WALKING")
            $("#mode_icon").empty().append(" <img src='img/walk_icon.png' height='20' width=20/>");

        dijkstra_current_route_directions = $("#dijkstra_route_container").html();

        if (route_mode === "TRANSIT") {
			var polygonCoords = [];

            for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {	// iterate through all markers
				if(dijkstra_current_route_points[i].isBusStop == "true")
					polygonCoords.push(dijkstra_current_route_points[i].position);
            }
            var dijkstra_line = new google.maps.Polyline({
                clickable: true,
                map: map,
                path: polygonCoords,
                strokeColor: "blue",
                strokeOpacity: 0.4,
                strokeWeight: 4
            });
            dijkstra_current_route_line = dijkstra_line;
		}
        else if (route_mode === "WALKING"){
            var polygonCoords = [];
            for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {	// iterate through all markers
                polygonCoords.push(dijkstra_current_route_points[i].position);
            }
            var dijkstra_line = new google.maps.Polyline({
                clickable: true,
                map: map,
                path: polygonCoords,
                strokeColor: "blue",
                strokeOpacity: 0,
                strokeWeight: 0,
				icons: [{
					icon: dashed_line,
					offset: '0',
					repeat: '20px'
				}],
            });
            dijkstra_current_route_line = dijkstra_line;
        }
		else if (route_mode === "BICYCLING"){
            var polygonCoords = [];
            for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {	// iterate through all markers
                polygonCoords.push(dijkstra_current_route_points[i].position);
            }
            var dijkstra_line = new google.maps.Polyline({
                clickable: true,
                map: map,
                path: polygonCoords,
                strokeColor: "blue",
                strokeOpacity: 0.4,
                strokeWeight: 4
            });
            dijkstra_current_route_line = dijkstra_line;
        }
		else {
            var polygonCoords = [];
            for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {	// iterate through all markers
                polygonCoords.push(dijkstra_current_route_points[i].position);
            }
            var dijkstra_line = new google.maps.Polyline({
                clickable: true,
                map: map,
                path: polygonCoords,
                strokeColor: "blue",
                strokeOpacity: 0.4,
                strokeWeight: 4
            });
            dijkstra_current_route_line = dijkstra_line;
        }

        setTimeout(function(){
            dijkstra_current_route_directions = $("#dijkstra_route_container").html();

        },3000)

        $("#dijkstra_route_container").show("slow");
    });

}
/**
 * A helper function which draws the rest of the route when the route's size content is big
 */
function draw_extra_lines() {

    var extra_min_route_directions = [];
    var pos1_lat_lng = [];
    Object.keys(dijkstra_current_route_points[parseInt(counter_step) + 1].position).forEach(function (key) {
        var val = dijkstra_current_route_points[parseInt(counter_step) + 1].position[key];
        pos1_lat_lng.push(val);
    });
    var start_point = new google.maps.LatLng(pos1_lat_lng[0], pos1_lat_lng[1]);
    var end_point;
    if (destination_not_exists && route_mode === "TRANSIT") {

        var pos2_lat_lng = [];
        Object.keys(dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position).forEach(function (key) {
            var val = dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position[key];
            pos2_lat_lng.push(val);
        });
        end_point = new google.maps.LatLng(pos2_lat_lng[0], pos2_lat_lng[1]);
    }
    else {
        var pos2_lat_lng = [];
        Object.keys(dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position).forEach(function (key) {
            var val = dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position[key];
            pos2_lat_lng.push(val);
        });
        end_point = new google.maps.LatLng(pos2_lat_lng[0], pos2_lat_lng[1]);
    }

    var extra_waypts = [];
    if (destination_not_exists && route_mode === "TRANSIT") {

        for (var i = counter_step; i < dijkstra_current_route_points.length - 2; i++) {
            extra_waypts.push({
                location: dijkstra_current_route_points[i].position,
                stopover: true
            });
        }
    }
    else {
        for (var i = counter_step + 1; i < dijkstra_current_route_points.length - 2; i++) {
            extra_waypts.push({
                location: dijkstra_current_route_points[i].position,
                stopover: true
            });
        }
    }
    var new_extra_waypts = extra_waypts;
    if (extra_waypts.length >= 9) {
        for (var i = 0; i < extra_waypts.length; i++) {
            if (i == 0)
                continue;
            extra_waypts.splice(i, 1);
            if (extra_waypts.length >= 9)
                continue;
            else
                break;
        }
    }
    var request = {
        origin: start_point,
        destination: end_point,
        waypoints: extra_waypts,
        travelMode: google.maps.TravelMode.WALKING,	// travelMode: google.maps.TravelMode[curr_mode],
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);
            for (var i = 0, len = response.routes.length; i < len; i++) {

                new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
                    map: map,
                    directions: response,
                    routeIndex: i,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "blue",
                        strokeOpacity: 0.4,
                        strokeWeight: 4
                    }
                });
            }
            var extra_route_points = [];
            if (destination_not_exists && route_mode === "TRANSIT") {
                var pos2_lat_lng = [];
                Object.keys(dijkstra_current_route_points[i].position).forEach(function (key) {
                    var val = dijkstra_current_route_points[i].position[key];
                    pos2_lat_lng.push(val);
                });
                for (var i = counter_step; i < dijkstra_current_route_points.length - 3; i++) {
                    var point = new google.maps.LatLng(pos2_lat_lng[0], pos2_lat_lng[1]);
                    extra_route_points.push(point);
                }
            }
            else {
                var pos2_lat_lng = [];
                Object.keys(dijkstra_current_route_points[i].position).forEach(function (key) {
                    var val = dijkstra_current_route_points[i].position[key];
                    pos2_lat_lng.push(val);
                });
                for (var i = counter_step; i < dijkstra_current_route_points.length; i++) {
                    var point = new google.maps.LatLng(pos2_lat_lng[0], pos2_lat_lng[1]);
                    extra_route_points.push(point);
                }
            }
            var line = new google.maps.Polyline({
                clickable: true,
                map: map,
                path: extra_route_points,
                strokeColor: "blue",
                strokeOpacity: 0.4,
                strokeWeight: 4
            });

            dijkstra_route_polyline_extra = line;

            var routes = response.routes;
            for (var rte in routes) {
                var legs = routes[rte].legs;
                for (var leg in legs) {
                    var steps = legs[leg].steps;
                    var route_json_data = {};

                    route_json_data["distance"] = steps[0].distance.text;
                    route_json_data["duration"] = steps[0].duration.text;
                    extra_min_route_directions.push(route_json_data);
                    try {
                        proc_direction(steps[0].instructions);
                    }
                    catch (TypeError) {
                    }

                }

                var c = parseInt(counter_step) + 2;
                var content;

                for (var k = 0; k < extra_min_route_directions.length - 1; k++) {

                    counter_step = parseInt(counter_step) + 1;			// counter_step++
                    if (route_mode === "TRANSIT") {

                        try {
                            if (language === "greek") {
                                content = "<div class='min_route_step' id='" + c + "'>" + c + ". Συνεχίστε με το λεωφορείο " + bus_codes[i].replace('_', ' ή ') + "<span class='route_time'>" + min_route_directions[i]["distance"] + "</span></div><br>";
                            }
                            else {
                                content = "<div class='min_route_step' id='" + c + "'>" + c + ". Continue with the bus " + bus_codes[i].replace('_', ' or ') + "<span class='route_time'>" + min_route_directions[i]["distance"] + "</span></div><br>";
                            }
                        }
                        catch (TypeError) {
                        }

                    }
                    c = c + 1;
                    var unit = extra_min_route_directions[k]["distance"].split(" ")[1];
                    var dis;

                    if (language === "greek") {
                        if (unit === "μ") {
                            dis = parseFloat(min_route_directions[k]["distance"].split(" ")[0]);
                        }
                        else
                            dis = (parseFloat(min_route_directions[k]["distance"].split(" ")[0])) * 1000;
                    }
                    else {
                        if (unit === "m") {
                            dis = parseFloat(min_route_directions[k]["distance"].split(" ")[0]);
                        }
                        else
                            dis = (parseFloat(min_route_directions[k]["distance"].split(" ")[0])) * 1000;
                    }
                    total_dis = total_dis + dis;
                    var time = extra_min_route_directions[k]["duration"].split(" ")[0];
                    route_total_time = route_total_time + parseInt(time);
                }
                var route_dirs = get_final_directions_2();

                for (var i = 0; i < route_dirs.length - 1; i++) {
                    //var id = parseInt(i)+1;
                    var direc = route_dirs[i]["dir"];
                    var id = route_dirs[i]["id"];
                    var coun = parseInt(i) + 1;
                    content = "<div class='min_route_step' id='" + id + "'>" + coun + ". " + direc;
                    $("#dijkstra_route").append(content);

                }
                var f_direc = route_dirs[i]["dir"];
                var f_id = route_dirs[i]["id"];
                var f_coun = parseInt(i) + 1;
                if (language === "greek") {
                    content = "<div class='min_route_step' id='" + f_id + "'>" + f_coun + ". " + f_direc + " για να φτάσετε στον προορισμό σας.";
                }
                else {
                    content = "<div class='min_route_step' id='" + f_id + "'>" + f_coun + ". " + f_direc + " until your desination.";
                }
                $("#dijkstra_route").append(content);
                // add the destination
                content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span style='float:left;margin-left:5px;'>" + route_destination_point_address + "</span></div><br>"
                $("#dijkstra_route").append(content);

            }
            var dijkstra_points = dijkstra_current_route_points;

            var pos2_lat_lng = [];
            Object.keys(dijkstra_points[1].position).forEach(function (key) {
                var val = dijkstra_points[1].position[key];
                pos2_lat_lng.push(val);
            });

            var pos1 = pos2_lat_lng[0];
            var pos2 = pos2_lat_lng[1];
            var center_point = new google.maps.LatLng(pos2, pos1);
            map.setZoom(14);
            map.setCenter(center_point);
        } else {
            var content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span style='float:left;margin-left:5px;'>" + route_destination_point_address + "</span></div><br>"
            $("#dijkstra_route").append(content);
        }
    });
}
function procDirection(direction){

    if(language === "greek"){
        if(direction.indexOf(unwantedStringGr1) > -1){
            return direction.replace(unwantedStringGr1,"");
        }
        else if(direction.indexOf(unwantedStringGr2) > -1)
            return direction.replace(unwantedStringGr2,"");
        else
            return direction
    }
    else{
        if(direction.indexOf(unwantedStringEn1) > -1){
            return direction.replace(unwantedStringEn1,"");
        }
        else if(direction.indexOf(unwantedStringEn2) > -1)
            return direction.replace(unwantedStringEn2,"");
        else
            return direction
    }
}
/**
 * The main for drawing the route on the map
 */
function drawRoute() {

	if(route_mode !== "TRANSIT") {
		route_start_directions = [];
		var waypts = [];
		for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {
			waypts.push({
				location: dijkstra_current_route_points[i].position
			});
		}
	}
	
	else {
		route_start_directions = [];
		var wayptsTransit = [];

		for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {
			if(dijkstra_current_route_points[i].isBusStop == "true") {
				wayptsTransit.push({
					location: dijkstra_current_route_points[i].position
				});
			}
		}
	}
	
    if (source_not_exists && route_mode === "TRANSIT") {
		//console.log(dijkstra_current_route_points);
		//console.log(wayptsTransit);

        // Request for start line
        var request = {
            origin: dijkstra_current_route_points[0].position,
            destination: wayptsTransit[0].location,
            travelMode: google.maps.TravelMode.WALKING
        };
        // Get directions of start line
        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {

                directionsDisplay.setDirections(response);
                for (var i = 0, len = response.routes.length; i < len; i++) {

                    start_line_array.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
                        map: map,
                        directions: response,
                        routeIndex: i,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "green",
                            strokeOpacity: 0,
                            strokeWeight: 0,
                            icons: [{
                                icon: dashed_line,
                                offset: '0',
                                repeat: '20px'
                            }],
                        }
                    }));
                }
                dijkstra_route_polyline_start_extra_global = start_line_array[0];

                start_line_array = [];
                var routes = response.routes;
                var route_json_data = {};

                // Calculate the start directions
                for (var rte in routes) {

                    var legs = routes[rte].legs;
                    for (var leg in legs) {
                        var steps = legs[leg].steps;
                        total_dis_timeSTART.push(legs[0].distance.text);
                        total_dis_timeSTART.push(legs[0].duration.text);
                        for (var i = 0; i < steps.length; i++) {
                            route_json_data = {};
                            route_json_data["directions"] = procDirection(steps[i].instructions);
                            route_json_data["start_point"] = steps[i].start_point;
                            route_json_data["end_point"] = steps[i].end_point;
                            route_json_data["distance"] = steps[i].distance.text;
                            route_json_data["duration"] = steps[i].duration.text;

                            route_start_directions.push(route_json_data);
                        }
                    }
                    $("#dijkstra_route").empty();
                    break;
                }
            }
            else
                alert("ERROR");
        });
        directionsDisplay.setMap(map);
    }
    else if (route_mode !== "TRANSIT") {
		
		var rad = function(x) {
			return x * Math.PI / 180;
		};

		var getDistance = function(p1, p2) {
			var R = 6378137; // Earth’s mean radius in meter
			var dLat = rad(p2.lat() - p1.lat());
			var dLong = rad(p2.lng() - p1.lng());
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;
			return d; // returns the distance in meter
		};
		
		if(route_mode === "DRIVING" || route_mode === "BICYCLING") {
			var distanceDeparture = getDistance(dijkstra_current_route_points[0].position, dijkstra_current_route_points[1].position);
			var distanceArrival = getDistance(dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position, dijkstra_current_route_points[dijkstra_current_route_points.length - 1].position);
			
			if(distanceDeparture >= 200) {
				draw_start_line("DRIVING");
			}
			
			else {
				draw_start_line("WALKING", "car_bicycle");
			}
			
			if(distanceArrival >= 200) {
				draw_end_line("DRIVING");
			}
			
			else {
				draw_end_line("WALKING", "car_bicycle");
			}
			console.log("DISTANCE DEPARTURE: " + distanceDeparture);
			console.log("DISTANCE ARRIVAL: " + distanceArrival);
		}
		
		else if(route_mode === "WALKING") {
			draw_start_line(route_mode);	// Start line + Google directions
			draw_end_line(route_mode);	// End line + Google directions
		}
        
		main(waypts);
		dijkstra_current_route_waypoints = waypts;
    }

    if (route_mode === "TRANSIT") {
        draw_end_line_transit(wayptsTransit);
		main(wayptsTransit);
		dijkstra_current_route_waypoints = wayptsTransit;
    }
    if (route_mode === "TRANSIT" || route_mode === "BICYCLING") {
        $("#dijkstra_google_btns").hide();
    }
    else{
        $("#dijkstra_google_btns").show();
    }
}
/**
 * Draw the start line of the route and calculate-store its content
 */
function draw_start_line(routeMode, vehicle) {

    //mode = "WALKING";
	console.log("ROUTE MODE: " + routeMode);
    // Request for start line
    var request = {
        origin: dijkstra_current_route_points[0].position,
        destination: dijkstra_current_route_points[1].position,
        travelMode: google.maps.TravelMode[routeMode]
    };
    // Get directions of start line
    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);
            for (var i = 0, len = response.routes.length; i < len; i++) {
				if(routeMode == "WALKING" && vehicle !== "car_bicycle") {
					start_line_array_2.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
						map: map,
						directions: response,
						routeIndex: i,
						suppressMarkers: true,
						polylineOptions: {
							strokeColor: "blue",
							strokeOpacity: 0,
							strokeWeight: 0,
							icons: [{
								icon: dashed_line,
								offset: '0',
								repeat: '20px'
							}],
						}
					}));
				}
				else {
					start_line_array_2.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
						map: map,
						directions: response,
						routeIndex: i,
						suppressMarkers: true,
						polylineOptions: {
							strokeColor: "blue",
							strokeOpacity: 0.4,
							strokeWeight: 4,
						}
					}));
				}
            }
			
			/*var path = [];
			path.push(dijkstra_current_route_points[0].position);
			path.push(dijkstra_current_route_points[1].position);
            var dijkstra_line = new google.maps.Polyline({
				map: map,
				path: path,
				strokeColor: "blue",
				strokeOpacity: 0.4,
				strokeWeight: 4
			});*/

            dijkstra_route_polyline_start_extra_global_2 = start_line_array_2[0];

            start_line_array_2 = [];

            var routes = response.routes;
            var route_json_data = {};

            for (var rte in routes) {

                var legs = routes[rte].legs;
                for (var leg in legs) {
                    var steps = legs[leg].steps;

                    for (var i = 0; i < steps.length; i++) {

                        route_json_data = {};
                        route_json_data["directions"] = procDirection(steps[i].instructions);
                        route_json_data["start_point"] = steps[i].start_point;
                        route_json_data["end_point"] = steps[i].end_point;
                        route_json_data["distance"] = steps[i].distance.text;
                        route_json_data["duration"] = steps[i].duration.text;
                
                        route_start_directions.push(route_json_data);
                        if (route_mode !== "TRANSIT") {
                            try {
                                dijkstra_route_direction_content.push(procDirection(steps[i].instructions));
                            }
                            catch (TypeError) {
                            }
                        }
                        min_route_directions.push(route_json_data);
                    }
                }
            }
        }
        else
            alert("ERROR");

    });
    //directionsDisplay.setMap(map);

}
/**
 * Draw the end line of the route and calculate-store its content
 */
function draw_end_line(routeMode, vehicle) {

    mode = "WALKING";

    // Request for start line
    var request = {
        origin: dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position,
        destination: dijkstra_current_route_points[dijkstra_current_route_points.length - 1].position,
        travelMode: google.maps.TravelMode[mode]
    };

    // Get directions of start line
    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);
            for (var i = 0, len = response.routes.length; i < len; i++) {
				if (routeMode == "WALKING" && vehicle !== "car_bicycle") {
					end_line_array_2.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
						map: map,
						directions: response,
						routeIndex: i,
						suppressMarkers: true,
						polylineOptions: {
							strokeColor: "blue",
							strokeOpacity: 0,
							strokeWeight: 0,
							icons: [{
								icon: dashed_line,
								offset: '0',
								repeat: '20px'
							}],
						}
					}));
				}
				else {
					end_line_array_2.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
						map: map,
						directions: response,
						routeIndex: i,
						suppressMarkers: true,
						polylineOptions: {
							strokeColor: "blue",
							strokeOpacity: 0.4,
							strokeWeight: 4,
						}
					}));
				}
            }
			/*var path = [];
			path.push(dijkstra_current_route_points[dijkstra_current_route_points.length - 2].position);
			path.push(dijkstra_current_route_points[dijkstra_current_route_points.length - 1].position);
            var dijkstra_line = new google.maps.Polyline({
				map: map,
				path: path,
				strokeColor: "blue",
				strokeOpacity: 0.4,
				strokeWeight: 4
			});*/
            dijkstra_route_polyline_end_extra_global_2 = end_line_array_2[0];

            end_line_array_2 = [];

            var routes = response.routes;
            var route_json_data = {};
            for (var rte in routes) {

                var legs = routes[rte].legs;
                for (var leg in legs) {
                    // console.log("P1");
                    var steps = legs[leg].steps;

                    for (var i = 0; i < steps.length; i++) {

                        route_json_data = {};
                        if(i === steps.length-1)
                            route_json_data["directions"] = steps[i].instructions;
                        else
                            route_json_data["directions"] = procDirection(steps[i].instructions);
                        route_json_data["start_point"] = steps[i].start_point;
                        route_json_data["end_point"] = steps[i].end_point;
                        route_json_data["distance"] = steps[i].distance.text;
                        route_json_data["duration"] = steps[i].duration.text;
                        route_end_directions.push(route_json_data);
                        if (route_mode !== "TRANSIT") {
                            try {
                                if(i === steps.length-1)
                                    dijkstra_route_direction_content.push(steps[i].instructions);
                                else
                                    dijkstra_route_direction_content.push(procDirection(steps[i].instructions));
                            }
                            catch (TypeError) {
                            }
                        }
                        min_route_directions.push(route_json_data);
                    }
                }
            }
        }
        else
            alert("ERROR");
    });
    //directionsDisplay.setMap(map);
}
/**
 * Draw the end line of the transit route and calculate-store its content
 */
function draw_end_line_transit(wayptsTransit) {
	var pointer = 0;
	for(var i=0; i<wayptsTransit.length; i++) {
		pointer++;
	}
	//console.log(pointer);
    var request = {
        origin: wayptsTransit[pointer-1].location,
		destination: dijkstra_current_route_points[dijkstra_current_route_points.length - 1].position,
        travelMode: google.maps.TravelMode.WALKING
    };

    // Get directions of end line
    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);
            for (var i = 0, len = response.routes.length; i < len; i++) {

                end_line_array.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
                    map: map,
                    directions: response,
                    routeIndex: i,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "red",
                        strokeOpacity: 0, //0.4
                        strokeWeight: 0, //4
                        icons: [{
                            icon: dashed_line,
                            offset: '0',
                            repeat: '20px'
                        }],
                    }
                }));

            }
            if (route_mode === "TRANSIT") {
                var dijkstra_route_polyline_end_extra = end_line_array[0];
                dijkstra_route_polyline_end_extra_global = dijkstra_route_polyline_end_extra;
            }
            end_line_array = [];
            var routes = response.routes;
            var route_json_data = {};
            for (var rte in routes) {

                var legs = routes[rte].legs;
                for (var leg in legs) {
                    var steps = legs[leg].steps;
                    for (var i = 0; i < steps.length; i++) {
                        route_json_data = {};
                        if(i === steps.length-1)
                            route_json_data["directions"] = steps[i].instructions;
                        else
                            route_json_data["directions"] = procDirection(steps[i].instructions);
                        route_json_data["start_point"] = steps[i].start_point;
                        route_json_data["end_point"] = steps[i].end_point;
                        route_json_data["distance"] = steps[i].distance.text;
                        route_json_data["duration"] = steps[i].duration.text;
                        route_end_directions.push(route_json_data);
                        //marker_content_array.push(steps[i].instructions);
                    }
                    total_dis_timeEND.push(legs[0].distance.text);
                    total_dis_timeEND.push(legs[0].duration.text);
                }
                var content;
                var c = parseInt(counter_step) + 1;
                break;
            }
            //Store the dijkstra route directions and its markers
            var route = $("#dijkstra_route_container").html();
            dijkstra_current_route_directions = route;


        }
        else
            alert("ERROR");

    });
    directionsDisplay.setMap(map);
}
/**
 * Draw the start line of the route - case 2 (limited points)
 */
function draw_start_line_2() {

    var waypts = [];
    for (var i = 1; i < calculated_route_points.length - 2; i++) {
        waypts.push({
            location: calculated_route_points[i]
        });
    }

    var directions = [];
    // Request for start line
    var request = {
        origin: calculated_route_points[0],
        destination: calculated_route_points[1],
        travelMode: google.maps.TravelMode.WALKING
    };

    // Get directions of start line
    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);
            for (var i = 0, len = response.routes.length; i < len; i++) {

                start_line_array.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
                    map: map,
                    directions: response,
                    routeIndex: i,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "red",
                        strokeOpacity: 0,
                        strokeWeight: 0,
                        icons: [{
                            icon: dashed_line,
                            offset: '0',
                            repeat: '20px'
                        }],
                    }
                }));

            }
            var dijkstra_route_polyline_start_extra = start_line_array[0];
            dijkstra_route_polyline_start_extra_global = dijkstra_route_polyline_start_extra;

            start_line_array = [];
            var routes = response.routes;
            for (var rte in routes) {

                var legs = routes[rte].legs;
                for (var leg in legs) {
                    var steps = legs[leg].steps;
                    var route_json_data = {};
                    route_json_data["directions"] = steps[0].instructions;
                    route_json_data["start_point"] = steps[0].start_point;
                    route_json_data["end_point"] = steps[0].end_point;
                    route_json_data["distance"] = steps[0].distance.text;
                    route_json_data["duration"] = steps[0].duration.text;
                    directions.push(route_json_data);

                    marker_content_array.push(steps[0].instructions);
                }
                //dijkstra_route_direction_content = marker_content_array;		// Store all the directions of the route
                $("#dijkstra_route").empty();

                var content;

                var c;
                for (var i = 0; i < directions.length; i++) {
                    c = parseInt(i) + 1;
                    var add_content;
                    if (language === "greek")
                        add_content = " για να φτάσετε στη στάση του λεωφορείου " + start_bus_code;
                    else
                        add_content = " to reach the bus station " + start_bus_code;
                    content = "<div class='min_route_step' id='" + i + "'>" + c + ". " + directions[i]["directions"] + " " + add_content + "<div class='walk_icons'><span><img src='img/walk_icon.png' height='20' width='20'></span><span class='route_time'>" + directions[i]["distance"] + "</span></div></div><br>";
                    start_directions.push(content);
                    start_line_directions_counter = c;
                }
            }
        }
        else
            alert("ERROR");

    });
    directionsDisplay.setMap(map);

}
/**
 * Draw the main line of the route - case 2 (limited points)
 * @param waypts
 * @param new_points
 */
function draw_main_route_2(waypts, new_points) {

    var min_route_directions = [];

    var request = {

        origin: calculated_route_points[2],
        destination: calculated_route_points[calculated_route_points.length - 3],
        waypoints: waypts,
        travelMode: google.maps.TravelMode.WALKING

    }

    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {


            directionsDisplay.setDirections(response);
            for (var i = 0, len = response.routes.length; i < len; i++) {

                var routes = response.routes;
                for (var rte in routes) {

                    var legs = routes[rte].legs;
                    for (var leg in legs) {
                        var steps = legs[leg].steps;
                        var route_json_data = {};

                        route_json_data["start_point"] = steps[0].start_point;
                        route_json_data["end_point"] = steps[0].end_point;
                        route_json_data["distance"] = steps[0].distance.text;
                        route_json_data["duration"] = steps[0].duration.text;
                        min_route_directions.push(route_json_data);

                        dijkstra_route_direction_content.push(steps[0].instructions);
                    }
                    $("#dijkstra_route").empty();

                    var content;
                    content = "<div style='display:inline-block; background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-start.png' /><span style='float:left;margin-left:5px;'>" + route_source_point_address + "</span></div><br>"
                    $("#dijkstra_route").append(content);

                    for (var i = 0; i < start_directions.length; i++) {
                        //console.log(start_directions[i]);
                        var add_content;
                        if (language === "greek")

                            add_content = " για να φτάσετε στη στάση του λεωφορείου " + start_bus_code;
                        else
                            add_content = " to reach the bus station " + start_bus_code;

                        var content = start_directions[i] + " " + add_content;
                        $("#dijkstra_route").append(content);
                    }
                    var c = 2;
                    var starl_line_c = start_line_directions_counter;		// # of directions added from start polyline

                    for (var i = 0; i < min_route_directions.length; i++) {

                        counter_step = parseInt(i) + 1;
                        var id = parseInt(i) + parseInt(starl_line_c);
                        //console.log("id: "+id);
                        counter_step = dir_nr;
                        var dir_nr = id + 1;
                        if (language === "greek") {
                            content = "<div class='min_route_step' id='" + id + "'>" + dir_nr + ". Συνεχίστε με το λεωφορείο " + bus_codes[i].replace('_', ' ή ') + "<span class='route_time'>" + min_route_directions[i]["distance"] + "</span></div><br>";
                        }
                        else {
                            content = "<div class='min_route_step' id='" + id + "'>" + dir_nr + ". Continue with the bus " + bus_codes[i].replace('_', ' or ') + "<span class='route_time'>" + min_route_directions[i]["distance"] + "</span></div><br>";
                        }

                        counter_step = dir_nr;

                        $("#dijkstra_route").append(content);
                        c = c + 1;

                    }
					
					var transitWaypts = [];

					for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {
						if(dijkstra_current_route_points[i].isBusStop == "true") {
							transitWaypts.push({
								location: dijkstra_current_route_points[i].position
							});
						}
					}
					
                    if (route_mode === "TRANSIT")
                        setTimeout(function(){ get_total_dis_timeTransit(transitWaypts); }, 1000);
                    else
						setTimeout(function(){ get_total_dis_time(); }, 1000);
                        

                    content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span style='float:left;margin-left:5px;'>" + route_destination_point_address + "</span></div><br>"
                    $("#dijkstra_route").append(content);

                    $("#step1_div").slideUp();
                    $("#step2_div").slideUp();
                    $("#current_route").hide("slow");
                    $("#dijkstra_route_container").show("slow");
                    $("#step3_div").show("slow", function() {
						$("#remove_source").hide(); 
						$("#remove_destination").hide(); 
						$("#change_addresses_btn").hide();
					});

                    // Store the dijkstra route directions and its markers
                    var route = $("#dijkstra_route_container").html();
                    dijkstra_current_route_directions = route;
                }
            }
        }
        else {
            alert("ERROR");
        }

    });
    directionsDisplay.setMap(map);

    var new_points_2 = [];
    for (var i = 1; i < new_points.length - 1; i++) {
        new_points_2.push(new_points[i]);
    }
    var dijkstra_line = new google.maps.Polyline({
        map: map,
        path: new_points_2,
        strokeColor: "blue",
        strokeOpacity: 0.4,
        strokeWeight: 4
    });

    dijkstra_current_route_line = dijkstra_line;
    dijkstra_current_route_waypoints = waypts;

}
/**
 * Draw the main line of the route - case 2 (limited points)
 * @param mode
 */
function drawRoute_2(mode) {

    var route_times = [];
    var new_points = [];
    for (var i = 0; i < dijkstra_current_route_points.length; i++) {
        var pos2_lat_lng = [];
        Object.keys(dijkstra_current_route_points[i].position).forEach(function (key) {
            var val = dijkstra_current_route_points[i].position[key];
            pos2_lat_lng.push(val);
        });

        var point = new google.maps.LatLng(pos2_lat_lng[0], pos2_lat_lng[1]);
        new_points.push(point);
    }

    min_route_directions = [];

    var waypts = [];

    if (route_mode === "TRANSIT") {

        for (var i = 1; i < new_points.length - 2; i++) {
            waypts.push({
                location: calculated_route_points[i]
            });
        }
        draw_start_line_2();
        draw_main_route_2(waypts, new_points);
        draw_end_line_transit(wayptsTransit); //XREIAZETAI NEA WAYPTS h' OXI?

    }
    else {
        for (var i = 1; i < new_points.length - 1; i++) {
            waypts.push({
                location: calculated_route_points[i]
            });
        }
        if (route_mode === "BICYCLING")
            mode = "DRIVING"
        else if (route_mode === "DRIVING")
            mode = "WALKING"
        else 	// TRANSIT,WALKING,ANYTHING
            mode = "WALKING"
        var request = {
            origin: calculated_route_points[1],
            destination: calculated_route_points[calculated_route_points.length - 2],
            waypoints: waypts,
            travelMode: google.maps.TravelMode[mode]

        }
        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {

                var routes = response.routes;
                for (var rte in routes) {

                    var legs = routes[rte].legs;
                    for (var leg in legs) {
                        var steps = legs[leg].steps;
                        var route_json_data = {};
                        route_json_data["distance"] = steps[0].distance.text;
                        route_json_data["duration"] = steps[0].duration.text;

                        try {
                            proc_direction(steps[0].instructions);
                            dijkstra_route_direction_content.push(steps[0].instructions);

                        }
                        catch (TypeError) {
                        }
                        min_route_directions.push(route_json_data);
                    }
                }
                $("#dijkstra_route").empty();
                var content;
                content = "<div style='display:inline-block; background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-start.png' /><span style='float:left;margin-left:5px;'>" + route_source_point_address + "</span></div><br>"
                $("#dijkstra_route").append(content);
                var c = 0;
				
				var transitWaypts = [];
				
				for (var i = 1; i < dijkstra_current_route_points.length - 1; i++) {
					if(dijkstra_current_route_points[i].isBusStop == "true") {
						transitWaypts.push({
							location: dijkstra_current_route_points[i].position
						});
					}
				}
				
                if (route_mode === "TRANSIT")
                    setTimeout(function(){ get_total_dis_timeTransit(transitWaypts); }, 1000);
                else
                    setTimeout(function(){ get_total_dis_time(); }, 1000);

                if (route_mode === "BICYCLING")
                    $("#mode_icon").empty().append("<img src='img/bicycle_icon.png' height='20' width=20/>");
                else if (route_mode === "DRIVING")
                    $("#mode_icon").empty().append(" <img src='img/driving_icon.png' height='20' width=20/>");
                else if (route_mode === "WALKING")
                    $("#mode_icon").empty().append(" <img src='img/walk_icon.png' height='20' width=20/>");

                var route_dirs = get_final_directions();

                for (var i = 0; i < route_dirs.length - 1; i++) {
                    var count = parseInt(i) + 1;
                    var id = route_dirs[i]["id"];
                    content = "<div class='min_route_step' id='" + id + "'>" + count + ". " + route_dirs[i]["dir"];
                    $("#dijkstra_route").append(content);

                }
                var f_id = route_dirs[i]["id"];
                var f_count = i + 1;
                if (language === "greek")
                    content = "<div class='min_route_step' id='" + f_id + "'>" + f_count + ". " + route_dirs[i]["dir"] + " για να φτάσετε στον προορισμό σας.";
                else
                    content = "<div class='min_route_step' id='" + f_id + "'>" + f_count + ". " + route_dirs[i]["dir"] + " until your desination.";
                $("#dijkstra_route").append(content);

                // Αdd destination marker
                content = "<div style='display:inline-block;background-color:#EEEEEE;padding:5px;width:100%;'><img style='float:left;' src ='img/dd-end.png' /><span style='float:left;margin-left:5px;'>" + dijkstra_destination_point_address + "</span></div><br>"
                $("#dijkstra_route").append(content);

                $("#step1_div").slideUp();
                $("#step2_div").slideUp();
                $("#current_route").hide("slow");
                $("#dijkstra_route_container").show("slow");
                $("#step3_div").show("slow", function() {
					$("#remove_source").hide(); 
					$("#remove_destination").hide(); 
					$("#change_addresses_btn").hide();
				});

                // Store the dijkstra route directions and its markers
                var route = $("#dijkstra_route_container").html();
                dijkstra_current_route_directions = route;

            }
            else {
                alert("ERROR");
            }

        });
        directionsDisplay.setMap(map);

        var dijkstra_line = new google.maps.Polyline({
            map: map,
            path: new_points,
            strokeColor: "blue",
            strokeOpacity: 0.4,
            strokeWeight: 4
        });

        dijkstra_current_route_line = dijkstra_line;
        dijkstra_current_route_waypoints = waypts;
    }
}

//FUNCTION FOR CHANGING ADDRESSES (SOURCE <-> DESTINATION)
function change_addresses(){
	
	// if both source address and destination address have been not added, return
	if (source_added === "false" && destination_added === "false")
		return;
	console.log(change_addresses_flag);
	if (change_addresses_flag == 0){
		
		var tmp = route_source_point_address;
		route_source_point_address = route_destination_point_address;
		route_destination_point_address = tmp;
		// console.log("ROUTE S NOW IS:"+route_source_point_address);
		// console.log("ROUTE D NOW IS:"+route_destination_point_address);

		if (source_added === "true" && destination_added === "false"){	
			if(step_3_go_back === "true"){
				dijkstra_current_route_points[0].setIcon("img/dd-end.png");
			}
			else{
				for (var i=0; i<showMarker.length; i++) {
					if (showMarker[i]["id"] == route_source_point ){
						showMarker[i].setIcon("img/dd-end.png");	// the source with go down
						flag_2 = "false";
						break;	// exit foor loop
					}
				}
   
                $("#show_step_content_1").prop('disabled', false);
                $("#show_step_content_1").css('border', '2px solid #00CF00');
                $("#show_step_content_1").css('opacity', '1');
         
                $("#show_step_content_2").prop('disabled', true);
                $("#show_step_content_2").css('border', '2px solid red');
                $("#show_step_content_2").css('opacity', '0.5');
                
                source_added = "false";
                destination_added ="true";
                $("#show_step_content_1").val("default");
                $(".step").fadeOut(0);
                change_addresses_flag = 1;

                // CHANGE THE ADDRESSES
                $source_address = $("#source_address_div").html();
                $destination_address = $("#destination_address_div").html();
                route_source_point_address = $source_address;
                route_source_point_address_google = $source_address;
                route_destination_point_address = $destination_address;
                route_destinatio_point_address_google = $destination_address;
                $("#source_address_div").empty().append($destination_address);
                $("#destination_address_div").empty().append($source_address);
                return;


			}
		}
		else if (destination_added === "true"  && source_added === "false"){	

			if(step_3_go_back === "true"){
				dijkstra_current_route_points[dijkstra_current_route_points.length-1].setIcon("img/dd-start.png");
			}
			else{
				for (var i=0; i<showMarker.length; i++) {
					if (showMarker[i]["id"] == route_destination_point ){	// destination
						showMarker[i].setIcon("img/dd-start.png");	// the destination with go up
						flag_2 = "false";
						break;
					}
				}
                $("#show_step_content_1").prop('disabled', true);
                $("#show_step_content_1").css('border', '2px solid red');
                $("#show_step_content_1").css('opacity', '0.5');

                $("#show_step_content_2").prop('disabled', false);
                $("#show_step_content_2").css('border', '2px solid #00CF00');
                $("#show_step_content_2").css('opacity', '1');

                source_added = "true";
                destination_added = "false";
                $("#show_step_content_2").val("default");
                $(".step").fadeOut(0);
                
			}
		}
		change_addresses_flag = 1;
	}
	else{
		
		var tmp = route_destination_point_address;
		route_destination_point_address = route_source_point_address;
		route_source_point_address = tmp;
	
		if (source_added === "true"){ 	// source exists
    			if(step_3_go_back === "true"){

				dijkstra_current_route_points[0].setIcon("img/dd-start.png");
			}
			else{
				for (var i=0; i<showMarker.length; i++) {
					if (showMarker[i]["id"] == route_source_point ){
						showMarker[i].setIcon("img/dd-start.png");	// the source with go up
						flag_2 = "true";
						break;	// exit foor loop
					}
				}
			}
			
		}
		else if (destination_added === "true"){	// destination exists
            console.log("CASE");
			if(step_3_go_back === "true"){
				dijkstra_current_route_points[dijkstra_current_route_points.length-1].setIcon("img/dd-start.png");
			}
			else{
				for (var i=0; i<showMarker.length; i++) {
					if (showMarker[i]["id"] == route_source_point ){	  
						showMarker[i].setIcon("img/dd-start.png");	
						flag_2 = "true";
						break;
					}
                    else{
                        showMarker[i].setIcon("img/dd-start.png");
                    }
				}
			}
			
		}
        $("#show_step_content_1").prop('disabled', true);
        $("#show_step_content_1").css('border', '2px solid red');
        $("#show_step_content_1").css('opacity', '0.5');

        $("#show_step_content_2").prop('disabled', false);
        $("#show_step_content_2").css('border', '2px solid #00CF00');
        $("#show_step_content_2").css('opacity', '1');

        source_added = "true";
        destination_added = "false";
        $("#show_step_content_2").val("default");
        $(".step").fadeOut(0);

		change_addresses_flag = 0;
	}


	// CHANGE THE ADDRESSES
	$source_address = $("#source_address_div").html();
	$destination_address = $("#destination_address_div").html();
	route_source_point_address = $source_address;
	route_source_point_address_google = $source_address;
    route_destination_point_address = $destination_address;
	route_destinatio_point_address_google = $destination_address;
    $("#source_address_div").empty().append($destination_address);
	$("#destination_address_div").empty().append($source_address);

	
}


function getTransitMarkerContent(item){
    console.log("SET CONTENT TO MARKER:"+item);
    var markerContent;
    if(item == 1){
        if(language === "greek"){
            markerContent = "Επιβιβαστείτε στο λεωφορείο " + finalBusCode + " στη σταση <b>" + finalStopName[0] + "</b>";
        }
        else{
            markerContent = "Get the bus " + finalBusCode + " from the station <b>" + finalStopName[0] + "</b>";
        }
    }
    else if(item == 2){
        if(language === "greek"){
            markerContent = "Συνεχίστε με το λεωφορείο " + finalBusCode;
        }
        else{
            markerContent = "Go on with the bus " + finalBusCode;
        }
    }
    else{
        if(language === "greek"){
            markerContent = "Αποβιβαστείτε απο το λεωφορειο " + finalBusCode + " στη σταση <b>" + finalStopName[1] + "</b>";
        }
        else{
            markerContent = "Get off the bus " + finalBusCode + " from the staion <b>" + finalStopName[1] + "</b>";
        }
    }

    return markerContent;
}
function createTransitMarker(lat, lng, item){
    
    var latlng = new google.maps.LatLng(lat, lng);
    // Iniatialize the start and end marker of the transit route
    var marker = new google.maps.Marker({
        position: latlng,
        id: lat + "," + lng,
        map: map,
        icon: "img/other_marker_2.png"
        // title: 'route'
    });
    marker.setMap(map);
    marker.setVisible(false);

    google.maps.event.addListener(marker, "click", function () {
        InfoWindow.setContent(getTransitMarkerContent(item));
        InfoWindow.open(map, marker);
    });
    google.maps.event.addListener(map, "click", function () {
        InfoWindow.close();
    });
    if(item == 1)
        dijkstra_current_route_pointsTransitFirst = marker;      // Save markers in order to access them
    else if(item == 2)
        dijkstra_current_route_pointsTransitSecond = marker;
    else
        dijkstra_current_route_pointsTransitThird = marker;

    console.log(dijkstra_current_route_pointsTransitFirst);
}
/**
 * Start the proccess of calculating the Dijkstra route
 * @param pos1
 * @param pos2
 * @param mode1
 * @param mode2
 */
function calcRoute(pos1, pos2, mode1, mode2) {

    if (flag_2 === "false") {
        var tmp = pos1;
        pos1 = pos2;
        pos2 = tmp;
    }
    for (var i = 0; i < showMarker.length; i++) {
        showMarker[i].setDraggable(false);
    }
    $("#route_time_div").hide("slow");
    transit_case_2 = false;
    route_proc_directions = [];

    directionsDisplay_array = [];
    directionsService_array = [];
    route_start_directions = [];
    route_end_directions = [];

    dijkstra_route_direction_content = [];
    bus_codes = [];
    dirs = [];
    transit_route_directions = [];
    start_directions = [];
    end_directions = [];
    route_total_length = 0;
    total_dis = 0;
    route_total_time = 0;
    first_time = true;
    source_not_exists = false;
    destination_not_exists = false;
    best_route_mode = "no";
    route_exists = "true";
    step_3_go_back = "false";
    $(".directions_div_btn_2").css("opacity", "0.6");

    route_mode = mode1;
    optimization_way = mode2;

    // min_route_mode = route_mode;
    var route_optimization = mode2;
    var pos1_lat_lng = [];

    Object.keys(pos1).forEach(function (key) {
        var val = pos1[key];
        pos1_lat_lng.push(val);
    });
    var pos2_lat_lng = [];
    Object.keys(pos1).forEach(function (key) {
        var val = pos2[key];
        pos2_lat_lng.push(val);
    });

    var pos1_lat = pos1_lat_lng[0];
    var pos1_lng = pos1_lat_lng[1];

    var pos2_lat, pos2_lng;

    if (!destination_is_island) {			// Destination is not island
        pos2_lat = pos2_lat_lng[0];
        pos2_lng = pos2_lat_lng[1];
    }
    else {							// Destination is island
        pos2_lat = "39.357719";
        pos2_lng = "22.943949";
    }

    dijkstra_current_route_points = [];		// Empty tha array

    var route_time;
    try {
        route_time = $("#route_time").val().split(" ")[1].replace(":", ".");
    }
    catch (TypeError) {
        // Get current time
        var d = new Date();
        route_time = "" + d.getHours() + "." + d.getMinutes();
    }

    var route_date = $("#route_time").val().split(" ")[0];
    // Here we are making an Ajax request to call the "bridger" which will call the Dijkstra algorithm and returns the final route
    $.ajax({
        url: "php/findMinRoute.php?pos1_lat=" + pos1_lat + "&pos1_lng=" + pos1_lng + "&pos2_lat=" + pos2_lat + "&pos2_lng=" + pos2_lng + "&route_mode=" + route_mode + "&route_optimization=" + route_optimization + "&route_time=" + route_time,
        cache: false,
        dataType: "json",
        success: function (data) {
            data_length = Object.keys(data).length;

            if (data_length <= 3) {
                raise_error();
                return;
            }
            prev_lat = pos1_lat;
            prev_lng = pos1_lng;
            calculated_route_points = [];	            // Empty the array of the points
            for (var i = 0; i < showMarker.length; i++) {
                showMarker[i].setVisible(false);
            }
            // Hide any line of  point from the map
            hide_all_markers_lines();
            if (data[0][1] === "OTHER") {       // The returned route is a DRIVING/BIKE/WALKING route
                $.each(data, function (index, value) {	// Iterate through the returned data    	

                    if (index == 0)
                        return true;
                    var prev_lat = value[0];
                    var prev_lng = value[1];
                    var latlng = new google.maps.LatLng(prev_lat, prev_lng);
                    calculated_route_points.push(latlng);

                    if (index == 1) {			// start marker

                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + prev_lng,
                            map: map,
                            draggable: true,
                            icon: "img/dd-start.png"
                        });

                        tmp_calc_markers.push(marker);
                        marker.setMap(map);

                        google.maps.event.addListener(marker, "click", function () {
                            //InfoWindow.setContent(marker_content_array[parseInt(index)]);
                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);
                            // console.log(marker.position);
                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        google.maps.event.addListener(marker, 'dragend', function () {

                            InfoWindow.close();
                            geocodeNewPosition(marker);

                        });
                        dijkstra_current_route_points.push(marker);


                    }
                    else if (index == data_length - 2) {			// end marker
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + prev_lng,
                            map: map,
                            draggable: true,
                            icon: "img/dd-end.png"
                        });

                        tmp_calc_markers.push(marker);
                        marker.setMap(map);
                        google.maps.event.addListener(marker, 'dragend', function () {

                            InfoWindow.close();
                            geocodeNewPosition(marker);

                        });
                        dijkstra_current_route_points.push(marker);

                    }
                    else if (index == data_length - 1) {		// time, length
                        var time = value[0].split("time.")[1];
                        var length = value[1].split("length.")[1];

                    }
                    else {		// middle marker
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + latlng,
                            map: map,
                            draggable: false,
                            icon: "img/other_marker_2.png"
                        });
                        marker.setMap(map);
                        marker.setVisible(false);
                        var content = marker_content_array[index];
                        google.maps.event.addListener(marker, "click", function () {

                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);

                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);
                    }
                });
            }
			
            else if (data[0][1] === "TRANSIT") {        // The returned route is a TRANSIT route
			//--------------------------------------------------------------
				Object.size = function(obj) {
					var size = 0, key;
					for (key in obj) {
						if (obj.hasOwnProperty(key)) size++;
					}
					return size;
				};
	
				// Get the size of an object
				var size = Object.size(data);
				
				var testArr = [];
				for(var i=2; i<size-2; i++) {
					var stasi = data[i][1].split("-")[1].split("*")[0]; //px "Μουρτζουκου_3"
					if(stasi != "none")
						testArr.push(stasi);
				}
				
				console.log("TestArr(all staseis + diples mazi): ");
				console.log(testArr);
				
				var uniqueNames = [];
				$.each(testArr, function(i, el){
					////////////KOITA EDW!!!!!!////////////////////////
					if($.inArray(el, uniqueNames) === -1) 
						uniqueNames.push(el);
					else 
						testArr[i] = "none";
				})
				
				console.log("uniqueNames(mones staseis): ");
				console.log(uniqueNames);
				
				console.log("TestArr(after uniqueNames): ");
				console.log(testArr);
				//KAI EDWWWWWWWWWWWW!!!!!!!!//////////////////////////
				var freqArr = [];
				for(var i=0; i<uniqueNames.length; i++) {
					var stasi = uniqueNames[i]; //px "Μουρτζουκου_3_4_15"
					console.log(stasi.split("_"));
					if(stasi != "none")
						for(var j=1; j<stasi.split("_").length; j++)
							freqArr.push(stasi.split("_")[j]);
				}
				
				console.log("FreqArr: (mono ta noumera)");
				console.log(freqArr);
					
				freqArr.sort();
				console.log("FreqArr sorted: ");
				console.log(freqArr);
				var max=0,result,freq = 1;
				var freqObj = {};
				for(var i=0; i < freqArr.length; i++){
					if(freqArr[i]===freqArr[i+1]){
						freq++;
					}
					else {
						var f = freqArr[i];
						freqObj[f] = freq;
						freq=1;
					}
					if(freq>max){
						result = freqArr[i];
						max = freq;
					}
				}
				console.log(freqObj);
				
				console.log("megalutero apo ola: ");
				console.log(result);
				console.log("Suxnotita emfanishs: ");
				console.log(max);
				var busInterested = [];
				for(var i=2; i<size-2; i++) {
					var stasi = data[i][1].split("-")[1]; //px "Μουρτζουκου_3_4_15"
					console.log(stasi.split("_").indexOf(result));
					if(stasi == "none")
						continue;
					else if(stasi != "none") {
						if(stasi.split("_").indexOf(result) == -1) {
							data[i][1] = data[i][1].split("-")[0] + "-none";
						}
						else if (stasi.split("_").indexOf(result) > -1) {
							data[i][1] = data[i][1].split("-")[0] + "-" + stasi.split("_")[0] + "_" + result;
							busInterested.push(data[i][1].split("-")[1]);
						}
					}	
				}
				
				console.log("Dijkstra data meta thn euresh tou megaluterou: ");
				console.log(data);
				
				var forFlag = 0;

				for(var i=2; i<size-2; i++) {
					var stasi = data[i][1].split("-")[1]; //px "Μουρτζουκου_3"
					if(stasi == "none" && forFlag == 1) {
						data[i][1] = data[i][1].split("-")[0] + "-allo";
					}
					else if(stasi != "none" && stasi != busInterested[busInterested.length-1]) {		
						forFlag = 1;
					}
					if(stasi == busInterested[busInterested.length-1]) {
						forFlag = 0;
					}
				}
				
				console.log("Dijkstra data meta to teleutaio for: ");
				console.log(data);

                /***********************************************************/
                var newData = [];
                $.each(data, function (i, value) {
                    newData.push(value);
                });
				
                console.log(newData);
				
				var tmp = 2;
				
				//helper function for finding last element in the array of the transit waypoints in order to implement step2 direction with the bus
				Object.findLast = function (j) {
					var pointer = j;
					for (var i=pointer+1; i < newData.length-2; i++) {
						var thisPoint = newData[i][1].split("-")[1];
						if(thisPoint === "none" || thisPoint === "new_point"){
							continue;
						}
						else {
							pointer++;
						}
					}
					return pointer;
				}
				
                // Find the first and second marker
				console.log("New DATA: ");
				console.log(newData);
                for(var i=2; i < newData.length-2; i++) {
                    if(newData[i][1].split("-")[1] !== "none"){

                        var firstMarkerLat = newData[i][0];
                        var firstMarkerLng = newData[i][1].split("-")[0];

                        finalBusCode = newData[i][1].split("_")[1].split("*")[0];
						console.log("First Stop Name: ");
						console.log(newData[i][1].split("_")[0].split("-")[1]);
                        finalStopName.push(newData[i][1].split("_")[0].split("-")[1]);
                        console.log(firstMarkerLat+","+ firstMarkerLng+","+ 1);
                        createTransitMarker(firstMarkerLat, firstMarkerLng, 1);
						
						//second marker place in map when clicked it is in the middle of the bus route
						var pointer = Object.findLast(i);
						pointer = pointer - i;
						console.log("Pointer (last element): " +pointer);
						console.log("i elem (first element): " +i);
						var new_i = parseInt(pointer / 2);
                        new_i = new_i + i;
						
						// The second marker
                        var secondMarkerLat = newData[new_i][0];
                        var secondMarkerLng = newData[new_i][1].split("-")[0];
                        console.log(secondMarkerLat+","+ secondMarkerLng+","+ 2);
                        createTransitMarker(secondMarkerLat, secondMarkerLng, 2);
						
                        break;          // Exit loop
                    }
					else {
						tmp++; //sto telos tou for otan ftasei sto break to tmp tha exei thn thesh tou 1ou stoixeiou
					}
                }
				
				console.log(tmp);
                // Find the third marker
                for(var i=tmp+1; i < newData.length-1; i++){
                    var thisPoint = newData[i][1].split("-")[1];
                    //var nextPoint = newData[i+1][1].split("-")[1];
					//var prevPoint = newData[i-1][1].split("-")[1];
					
                    if(thisPoint === "none" || thisPoint === "new_point"){
                        var thirdMarkerLat = newData[i-1][0];
                        var thirdMarkerLng = newData[i-1][1].split("-")[0];
						console.log("Final Stop Name: ");
						console.log(newData[i-1][1].split("_")[0].split("-")[1]);
                        finalStopName.push(newData[i-1][1].split("_")[0].split("-")[1]);
                        console.log(thirdMarkerLat+","+ thirdMarkerLng+","+ 3);
                        createTransitMarker(thirdMarkerLat, thirdMarkerLng, 3);
                        console.log(i-1);
                        console.log(newData[i-1][1].split("_")[0].split("-")[1]);

                        break;      // Exit loop
                    }
                }
                /***********************************************************/
                //----------------------------------------------------------------------------------------------
                $.each(data, function (index, value) {	// Iterate through the returned data    	
                    if (index == 0 || index == data_length || index == data_length - 1) {
                        return true;
                    }

                    var prev_lat = value[0];
                    var prev_lng = value[1].split("-")[0];
                    var bus_code = value[1].split("-")[1].split("*")[0];
					
					if (bus_code !== "new_point")
                        bus_codes.push(bus_code);	// Store bus codes for each returned dijkstra point of algorithm
                    var latlng = new google.maps.LatLng(prev_lat, prev_lng);

                    calculated_route_points.push(latlng);

                    if (index == 1) {			// start marker

                        if (value[1].split("-")[1] === "new_point") {
                            source_not_exists = true;
                        }

                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + prev_lng,
                            map: map,
                            icon: "img/dd-start.png"
                        });

                        tmp_calc_markers.push(marker);
                        marker.setMap(map);
                        var content = marker_content_array[index];
                        google.maps.event.addListener(marker, "click", function () {
                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);

                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);

                    }
                    else if (index == data_length - 2) {		// end marker

                        if (value[1].split("-")[1] === "new_point") {
                            destination_not_exists = true;
                        }
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + prev_lng,
                            map: map,
                            icon: "img/dd-end.png"
                        });

                        tmp_calc_markers.push(marker);
                        marker.setMap(map);

                        dijkstra_current_route_points.push(marker); //periexei olous tous markers tous mikrous mple pou tha sxediastei h diadromh mazi me prasino kokkino 

                    }
                    else if (index === 2) {		// points after start and after before end
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + latlng,
                            map: map,
                            icon: "img/other_marker_2.png"
                            // title: 'route'
                        });
                        marker.setMap(map);
                        marker.setVisible(false);
						if(bus_code != "none") {
							marker.isBusStop = "true";
						}
						else {
							marker.isBusStop = "false";
						}
                        google.maps.event.addListener(marker, "click", function () {
                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);
                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();
                        });
                        dijkstra_current_route_points.push(marker);
                    }
                    else if (index == data_length - 3) {		// points after start and after before end
						
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + latlng,
                            map: map,
                            icon: "img/other_marker_2.png"
                            // title: 'route'
                        });
                        marker.setMap(map);
                        marker.setVisible(false);
						
						if(bus_code != "none") {
							marker.isBusStop = "true";
						}
						else {
							marker.isBusStop = "false";
						}
						
                        var content = marker_content_array[index];
                        google.maps.event.addListener(marker, "click", function () {

                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);

                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);
                    }
                    else {		// middle marker
						
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + latlng,
                            map: map,
                            draggable: false,
                            icon: "img/other_marker_2.png"
                            // title: 'route'
                        });
						
                        marker.setMap(map);
                        marker.setVisible(false);

						if(bus_code != "none") {
							marker.isBusStop = "true";
						}
						else {
							marker.isBusStop = "false";
						}
						
                        google.maps.event.addListener(marker, "click", function () {
                            //InfoWindow.setContent(marker_content_array[parseInt(index)]);
                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);
                            // console.log(marker.position);
                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);
                    }
                });
            }
            else {		// The returned route is ANYTING route

                var mode;
                $.each(data, function (index, value) {	// Iterate through the returned data    	

                    if (index == 0) {
                        mode = value[1].split(".")[1];
                        route_mode = mode;
                        best_route_mode = "yes";

                        return true;
                    }

                    if (index == 1) {			// start point

                        var prev_lat = value[0];
                        var prev_lng = value[1];
                        var latlng = new google.maps.LatLng(prev_lat, prev_lng);
                        calculated_route_points.push(latlng);
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + prev_lng,
                            map: map,
                            icon: "img/dd-start.png"
                        });

                        tmp_calc_markers.push(marker);
                        marker.setMap(map);
                        // var content = marker_content_array[index];
                        google.maps.event.addListener(marker, "click", function () {
                            //InfoWindow.setContent(marker_content_array[parseInt(index)]);
                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);
                            // console.log(marker.position);
                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);

                    }

                    else if (index == data_length - 5) {	// end point

                        var prev_lat = value[0];
                        var prev_lng = value[1];
                        var latlng = new google.maps.LatLng(prev_lat, prev_lng);
                        calculated_route_points.push(latlng);

                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + prev_lng,
                            map: map,
                            icon: "img/dd-end.png"
                        });

                        tmp_calc_markers.push(marker);
                        marker.setMap(map);

                        var content = marker_content_array[index];
                        google.maps.event.addListener(marker, "click", function () {

                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);

                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);

                    }
                    else if (index == data_length - 4) {}
                    else if (index == data_length - 3) {}
                    else if (index == data_length - 2) {		// time, length
                        var time = value[1].split("time.")[1];

                    }
                    else if (index == data_length - 1) {		// time, length
                        var length = value[1].split("length.")[1];
                    }

                    else {		// middle point

                        var prev_lat = value[0];
                        var prev_lng = value[1];
                        var latlng = new google.maps.LatLng(prev_lat, prev_lng);
                        calculated_route_points.push(latlng);
                        var marker = new google.maps.Marker({
                            position: latlng,
                            id: prev_lat + "," + latlng,
                            map: map,
                            icon: "img/other_marker_2.png"

                        });
                        marker.setMap(map);
                        marker.setVisible(false);
                        google.maps.event.addListener(marker, "click", function () {

                            InfoWindow.setContent(get_marker_content(index));
                            InfoWindow.open(map, marker);

                        });
                        google.maps.event.addListener(map, "click", function () {
                            InfoWindow.close();

                        });
                        dijkstra_current_route_points.push(marker);
                    }
                });
            }

            for (var i = 0; i < dijkstra_current_route_points.length; i++) {
                dijkstra_current_route_points[i].setDraggable(false);
            }
            saves_results_to_database();

            latlng_to_address(pos1_lat, pos1_lng);
            latlng_to_address_2(pos2_lat, pos2_lng);

            dijkstra_current_route_waypoints = [];


            if (data_length <= 10 && route_mode !== "TRANSIT")
                drawRoute_2(route_mode);
            else
                drawRoute(route_mode);

            $("#change_addresses_btn").hide("slow");
            $("#remove_source").hide("slow");
            $("#remove_destination").hide("slow");
            setTimeout(function () {
                map.setZoom(14);
                map.panBy(-200, 0);
            }, 1000);
        },
        error: function (request, status, error) {
            console.log(status);
            console.log(error);
            if (language === "greek")
                alert("Παρουσιάστηκε ένα σφάλμα,παρακαλώ προσπαθήστε πάλι");
            else
                alert("There was an error,please try again");

            $("#show_step_content_1").val("default");
            $("#show_step_content_2").val("default");

            $("#show_step_content_1").css('border', '2px solid #00CF00');
            $("#show_step_content_1").css('opacity', '1');
            $("#show_step_content_2").css('border', '2px solid red');
            $("#show_step_content_2").css('opacity', '0.5');
            $("#show_step_content_1").prop("disabled", false);			// enable destination
            $("#show_step_content_2").prop("disabled", true);			// disable destination

            $("#mode_1").val("default");
            $("#mode_2").val("default");

            if (saved_routes_counter == 0) {
                $("#step3_div").slideUp();
                $("#step2_div").slideUp();
                $("#step1_div").slideDown(function() {
					$("#remove_source").show("slow"); 
					$("#remove_destination").show("slow"); 
					$("#change_addresses_btn").show("slow");
				});
                $("#remove_source").trigger("click");
                $("#remove_destination").trigger("click");
            }
            else {
                $("#source_address").empty();
                $("#source_address").prev().attr("id", " ");
                // REMOVE/HIDE SOURCE MARKER FROM THE MAP 
                for (var i = 0; i < showMarker.length; i++) {
                    if (showMarker[i]["id"] == source_id) {
                        showMarker[i].setMap(null);
                    }
                }
                source_added = "false";
                source_id = "null";

                $("#destination_address").empty();
                $("#desntination_address").prev().attr("id", " ");
                // REMOVE/HIDE SOURCE MARKER FROM THE MAP 
                for (var i = 0; i < showMarker.length; i++) {
                    if (showMarker[i]["id"] == destination_id) {
                        showMarker[i].setMap(null);
                    }
                }
                destination_added = "false";
                dest_link_id_id = "null";

                $("#directions_div").hide("slow");
                $("#directions_div").slideUp();

                $("#step3_div").show("slow", function() {
					$("#remove_source").hide(); 
					$("#remove_destination").hide(); 
					$("#change_addresses_btn").hide();
				});
                $("#step2_div").slideUp();
                $("#step1_div").slideUp();

            }
        }
    });

}

/**
 * Iniatialize the pltagorm's situation when an error occurs
 */
function raise_error() {

    if (language === "greek")
        alert("Παρουσιάστηκε ένα σφάλμα,παρακαλώ προσπαθήστε πάλι");
    else
        alert("There was an error,please try again");

    $("#show_step_content_1").val("default");
    $("#show_step_content_2").val("default");

    $("#show_step_content_1").css('border', '2px solid #00CF00');
    $("#show_step_content_1").css('opacity', '1');
    $("#show_step_content_2").css('border', '2px solid red');
    $("#show_step_content_2").css('opacity', '0.5');
    $("#show_step_content_1").prop("disabled", false);			// Enable the source point
    $("#show_step_content_2").prop("disabled", true);			// Disable the destination point

    $("#mode_1").val("default");
    $("#mode_2").val("default");

    if (saved_routes_counter == 0) {
        $("#step3_div").slideUp();
        $("#step2_div").slideUp();
        $("#step1_div").slideDown(function() {
			$("#remove_source").show("slow"); 
			$("#remove_destination").show("slow"); 
			$("#change_addresses_btn").show("slow");
		});
        $("#remove_source").trigger("click");
        $("#remove_destination").trigger("click");
    }
    else {
        $("#source_address").empty();
        $("#source_address").prev().attr("id", " ");
        // Hide the source point from the map
        for (var i = 0; i < showMarker.length; i++) {
            if (showMarker[i]["id"] == source_id) {
                showMarker[i].setMap(null);
            }
        }
        source_added = "false";
        source_id = "null";

        $("#destination_address").empty();
        $("#desntination_address").prev().attr("id", " ");
        // Hide the destination point from the map
        for (var i = 0; i < showMarker.length; i++) {
            if (showMarker[i]["id"] == destination_id) {
                showMarker[i].setMap(null);
            }
        }
        destination_added = "false";
        dest_link_id_id = "null";

        $("#directions_div").hide("slow");
        $("#directions_div").slideUp();

        $("#step3_div").show("slow", function() {
			$("#remove_source").hide(); 
			$("#remove_destination").hide(); 
			$("#change_addresses_btn").hide();
		});
        $("#step2_div").slideUp();
        $("#step1_div").slideUp();

    }
}
/**
 * Return the content of a marker related to the given direction
 * @param direction_id
 * @returns {*}
 */
function get_marker_content(direction_id) {

    var marker_content;
    $(".min_route_step").each(function (index) {

        if (this.id == parseInt(direction_id) - 2) {

            marker_content = $(this).html().split("<span")[0].substr(3);
            return false;	// Break loop

        }
    });

    return marker_content;

}

/**
 * Save the route to the database
 */
function saves_results_to_database() {

    var route_start_point_a = $("#source_address").html();
    var route_end_point_a = $("#destination_address").html();
    var route_way_of_transp = $("#mode_1").val();
    var route_optimization_way = $("#mode_2").val();
    var route_time = $("#route_time").val();

    $.ajax({
        type: "get",
        url: "php/save_route.php",
        data: {
            "route_start_point": route_start_point_a,
            "route_end_point": route_end_point_a,
            "route_way_of_transp": route_way_of_transp,
            "route_optimization_way": route_optimization_way,
            "route_time": route_time
        },
        success: function (data) {
        }
    });
}
/**
 * Geocoding
 * @param lat
 * @param lng
 */
function latlng_to_address(lat, lng) {

    try {
        lng = lng.split("_")[0];
    }
    catch (TypeError) {
    }

    var latlng = new google.maps.LatLng(lat, lng);
    var marker_address = "";
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                marker_address = results[0].formatted_address;
                dijkstra_source_point_address = marker_address;

            } else {
                console.log("ERROR");
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}
/**
 * Geocoding - case2
 * @param lat
 * @param lng
 */
function latlng_to_address_2(lat, lng) {

    try {
        lng = lng.split("_")[0];
    }
    catch (TypeError) {
    }

    var latlng = new google.maps.LatLng(lat, lng);
    var marker_address = "";
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                marker_address = results[0].formatted_address;
                dijkstra_destination_point_address = marker_address;

            } else {
                console.log("ERROR");
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

/**
 * Calculate the related Google route of the Dijkstra route
 * @param pos1
 * @param pos2
 * @param mode1
 * @param mode2
 */
function calcGoogleRoute(pos1, pos2, mode1, mode2) {

    for (var i = 0; i < dirDis.length; i++) {
        dirDis[i].setMap(null);
    }
    dirDis = [];

    route_exists = "true";
    step_3_go_back = "false";
    $(".directions_div_btn_2").css("opacity", "0.6");
    optimization_way = mode2;

    var request = {
        origin: pos1,
        destination: pos2,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode[mode1]
    };

    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(result);
            for (var i = 0, len = result.routes.length; i < len; i++) {
                dirDis.push(new google.maps.DirectionsRenderer({		// for each route create a new DirectionsRenderer object
                    map: map,
                    directions: result,
                    routeIndex: i,
                    suppressMarkers: true,
                    polylineOptions: {
                        // strokeColor: "green",
                        strokeOpacity: 0.4,
                        strokeWeight: 4
                    }
                }));
            }

        }
    });

    directionsDisplay.setMap(map);
    setTimeout(function () {
        map.setZoom(14);
        map.panBy(-200, 0);
    }, 1000);


    $("#step2_div").slideUp();
    $("#step3_div").fadeIn(500);

    $("#current_route").empty();
    directionsDisplay.setPanel(document.getElementById('current_route'));		// append results to current route

    if (language == "greek")
        selected_route = "διαδρομής";
    else
        selected_route = "route";
    $("#send_a_route_div").fadeOut(0);


}
/**
 * Initialize the map's properties
 */
function initialize() {

    detectBrowser();
    var mapOptions = {
        zoom: 14,
        maxZoom: 16,
        center: new google.maps.LatLng(39.369288, 22.943531),
        zoomControl: true,
        panControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.DEFAULT,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeControl: false,
        disableDefaultUI: true,
        styles: [{featureType: 'water', stylers: [{color: '#46bcec'}, {visibility: 'on'}]}, {
            featureType: 'landscape',
            stylers: [{color: '#f2f2f2'}]
        }, {featureType: 'road', stylers: [{saturation: -100}, {lightness: 45}]}, {
            featureType: 'road.highway',
            stylers: [{visibility: 'simplified'}]
        }, {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [{color: '#444444'}]
        }, {featureType: 'transit', stylers: [{visibility: 'off'}]}, {
            featureType: 'poi',
            stylers: [{visibility: 'off'}]
        }]
    };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addListener(map, "click", function () {
        InfoWindow.close();
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

    var auto_infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    $('#pac-input').val("")
    $('#guide').prop('selectedIndex', 0);
    $('#route').prop('selectedIndex', 0);

    downloadUrl("php/bounds.php", function (data) {

        var data = new XMLHttpRequest();
        data.open("GET", "php/bounds.php", false);
        data.overrideMimeType("text/xml");
        data.send(null);
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
    });

    // Makes the AJAX request to retrieve markers
    function downloadUrl(url, callback) {
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                request.onreadystatechange = doNothing;
                callback(request, request.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    }
    function doNothing() {}
	
	$(".choose_choice_options").change(function() {
		$("li a.help-button").hide();
	});
}

function showBounds2() {
    bound_polygon.setMap(map);
}
/**
 * Display the bounadaries green area on the map
 */
function showBounds() {

    if (bound_flag == 1) {
        bound_polygon.setMap(map);
        // Right click event inside the boundaries area
        google.maps.event.addListener(bound_polygon, 'rightclick', function (event) {

            // Show the boundaries if only if the menu is open
            if ($("nav").hasClass("gn-open-all")) {
                if (source_added == "false" || destination_added == "false") {
                    var lat = event.latLng.lat();
                    var lng = event.latLng.lng();
                    var latlng = new google.maps.LatLng(lat, lng);
                    var address_p = "(" + lat + "," + lng + ")";
                    map.setCenter(latlng);

                    var marker = new google.maps.Marker({
                        map: map,
                        id: lat + "," + lng,
                        position: event.latLng,
                        draggable: true,
                        animation: google.maps.Animation.DROP
                    });
                    if (!$.trim($("#source_address").html()).length) {
                        marker.setIcon("img/dd-start.png");
                        if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                        }
                        else {
                            if (language === "greek") {
                                alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                                marker.setMap(null);
                                map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                                return;
                            }
                            else {
                                alert("i-Mobi Volos can't provide route outside the green region.");
                                marker.setMap(null);
                                map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                                return;

                            }
                        }
                    }
                    else if (destination_added == "false") {
                        marker.setIcon("img/dd-end.png");
                        if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                        }
                        else {
                            if (language === "greek") {
                                alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                                marker.setMap(null);
                                map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                                return;
                            }
                            else {
                                alert("i-Mobi Volos can't provide route outside the green region.");
                                marker.setMap(null);
                                map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                                return;
                            }
                        }
                    }
                    setTimeout(function () {
                        InfoWindow.close();
                    }, 0);

                    marker.setMap(map);
                    showMarker.push(marker);

                    google.maps.event.addListener(map, "click", function () {
                        InfoWindow.close();
                    });

                    google.maps.event.addListener(marker, 'dragend', function () {

                        InfoWindow.close();
                        geocodeNewPosition(marker);

                    });

                    // Reverse Geocoding
                    var marker_address = "";
                    geocoder.geocode({'latLng': latlng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                marker_address = results[0].formatted_address;
                                console.log(marker_address);
                                choose_this_point(999, address_p, marker_address, "non_geοcode_address", " ");
                            } else {
                                alert('No results found');
                            }
                        } else {
                            alert('Geocoder failed due to: ' + status);
                        }

                    });
                }
            }
        });
    }
    else if (bound_flag == 0) {
        bound_polygon.setMap(map);
    }
}

/**
* When a marker is dragged
 * **/
function geocodeNewPosition(marker) {


    geocoder.geocode({
        latLng: marker.getPosition()
    }, function (responses) {

        if (responses && responses.length > 0) {

            var lat = responses[0].geometry.location.lat();
            var lng = responses[0].geometry.location.lng();

            // Source was dragged
            if (marker.icon == "img/dd-start.png") {

                marker_new_address1 = responses[0].formatted_address;
                if (flag_new == 1) {
                    saved_routes_dict[parseInt(currently_selected_route) - 1].source_point_address_google = marker_new_address1;		// The current selected (saved) route
                }
                $("#source_address").empty().append(marker_new_address1);		// Update address
                route_source_point_address = marker_new_address1;
                route_source_point_address_google = marker_new_address1;

                // Update the values of the currently selected route
                var source_id = lat + "," + lng;		// the new source id
                marker.id = source_id;
                route_source_point = source_id;
                route_source_point_google = source_id;
                start_marker = marker;
                marker.setIcon("img/dd-start.png");

                // Source marker
                for (var i = 0; i < showMarker.length; i++) {
                    // Don't hide the source and destination markers
                    if (showMarker[i]["id"] == source_id) {

                        start_marker = showMarker[i];
                        showMarker[i].setIcon("img/dd-start.png");
                        break;
                    }
                }
                // The above code must be executed only if a route has been created
                if (route_exists === "true") {

                    // The current route has been not saved
                    if (no_saved_route == "true") {

                        calc_new_route = "true";
                        var json_data = {};

                        json_data["route_id"] = 0;
                        json_data["source_point"] = route_source_point;
                        json_data["destination_point"] = route_destination_point;
                        json_data["destination_point_google"] = route_destination_point_google;
                        json_data["source_point_address"] = route_source_point_address;
                        json_data["source_point_address_google"] = route_source_point_address_google;
                        json_data["destination_point_address"] = route_destination_point_address;
                        json_data["destination_point_address_google"] = route_destination_point_address_google;
                        json_data["mode"] = route_mode;
                        saved_routes_tmp_dict.push(json_data);
                        saved_routes_tmp_dict[0].source_point_google = source_id;
                        saved_routes_tmp_dict[0].route_source_point_address_google = marker_new_address1;

                        var this_route_source_point = source_id;		// the new source id
                        var this_route_destination_point = saved_routes_tmp_dict[0].destination_point;	// BUG

                        // Remove the existed routes from the map
                        for (var i = 0; i < dirDis.length; i++) {
                            dirDis[i].setMap(null);
                        }
                        // Calculate the new Google route
                        if (this_route_mode === "ANYTHING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "WALKING", "mode_2");
                        else if (route_mode === "BICYCLING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "DRIVING", optimization_way);
                        else
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, route_mode, "mode_2");
                        saved_routes_tmp_dict = [];
                    }
                    else if (step_3_go_back == "false") {

                        // Read the data created by the calcRoute function
                        saved_routes_dict[parseInt(currently_selected_route) - 1].source_point_google = source_id;
                        saved_routes_dict[parseInt(currently_selected_route) - 1].route_source_point_address_google = marker_new_address1;

                        var this_route_source_point = source_id;		// the new source id
                        var this_route_destination_point = saved_routes_dict[parseInt(currently_selected_route) - 1].destination_point;	// BUG
                        var this_route_mode = saved_routes_dict[parseInt(currently_selected_route) - 1].mode;

                        // Remove the existed routes from the map
                        for (var i = 0; i < dirDis.length; i++) {
                            dirDis[i].setMap(null);
                        }
                        if (this_route_mode === "ANYTHING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "WALKING", "mode_2");
                        else if (route_mode === "BICYCLING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "DRIVING", optimization_way);
                        else
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, this_route_mode, "mode_2");

                    }
                }

                if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {}
                else {
                    if (language === "greek") {
                        alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                    }
                    else {
                        alert("i-Mobi Volos can't provide route outside the green region.");
                    }
                    marker.setMap(null);
                    map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                    $("#source_address").empty();

                    $("#show_step_content_2").prop('disabled', true);
                    $("#show_step_content_2").css('border', '2px solid red');
                    $("#show_step_content_2").css('opacity', '0.5');

                    source_added = "false";
                    destination_added = "false";

                    $("#show_step_content_1").prop('disabled', false);
                    $("#show_step_content_1").css('border', '2px solid #00CF00');
                    $("#show_step_content_1").css('opacity', '1');
                    source_added = "false";
                    show_step_content_1("choose_by_right_click_1");
                    return;

                }
            }
            else if (marker.icon == "img/dd-end.png") {

                marker_new_address2 = responses[0].formatted_address;
                if (flag_new == 1) {
                    saved_routes_dict[parseInt(currently_selected_route) - 1].destination_point_address_google = marker_new_address2;
                }

                if (address_is_island(marker_new_address2)) {
                    destination_is_island = true;
                }

                $("#destination_address").empty().append(marker_new_address2);

                // Update the values of the currently selected route
                destination_id = lat + "," + lng;
                marker.id = destination_id;
                route_destination_point = marker.id;
                route_destination_point_google = marker.id;

                // Destination marker
                for (var i = 0; i < showMarker.length; i++) {
                    // Don't hide the source and destination markers
                    if (showMarker[i]["id"] == destination_id) {
                        end_marker = showMarker[i];
                        showMarker[i].setIcon("img/dd-end.png");
                        break;
                    }
                }
                // The above code must be executed only if a route has been created
                if (route_exists === "true") {

                    if (no_saved_route === "true") {

                        calc_new_route = "true";
                        var json_data = {};

                        json_data["route_id"] = 0;
                        json_data["source_point"] = route_source_point;
                        json_data["destination_point"] = route_destination_point;
                        json_data["destination_point_google"] = route_destination_point_google;
                        json_data["source_point_address"] = route_source_point_address;
                        json_data["source_point_address_google"] = route_source_point_address_google;
                        json_data["destination_point_address"] = route_destination_point_address;
                        json_data["destination_point_address_google"] = route_destination_point_address_google;
                        json_data["mode"] = route_mode;
                        saved_routes_tmp_dict.push(json_data);
                        saved_routes_tmp_dict[0].destination_point_google = destination_id;
                        saved_routes_tmp_dict[0].route_destination_point_address_google = marker_new_address2;

                        var this_route_destination_point = destination_id;		// the new destination id
                        var this_route_source_point = saved_routes_tmp_dict[0].source_point;	// BUG
                        var this_route_mode = saved_routes_tmp_dict[0].mode;

                        // Remove the existed routes from the map
                        for (var i = 0; i < dirDis.length; i++) {
                            dirDis[i].setMap(null);
                        }
                        // Calculate the new route
                        if (this_route_mode === "ANYTHING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "WALKING", "mode_2");
                        else if (route_mode === "BICYCLING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "DRIVING", optimization_way);
                        else
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, this_route_mode, "mode_2");

                        saved_routes_tmp_dict = [];
                    }
                    else if (step_3_go_back === "false") {


                        // Read the data created by the calcRoute function
                        saved_routes_dict[parseInt(currently_selected_route) - 1].destination_point_google = destination_id;
                        saved_routes_dict[parseInt(currently_selected_route) - 1].route_destination_point_address_google = marker_new_address2;

                        var this_route_destination_point = destination_id;		// the new destination id
                        var this_route_source_point = saved_routes_dict[parseInt(currently_selected_route) - 1].source_point_google;	// BUG
                        var this_route_mode = saved_routes_dict[parseInt(currently_selected_route) - 1].mode;

                        // Remove the existed routes from the map
                        for (var i = 0; i < dirDis.length; i++) {
                            dirDis[i].setMap(null);
                        }
                        // Calculate the new route
                        if (this_route_mode === "ANYTHING")
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, "WALKING", "mode_2");
                        else if (route_mode === "BICYCLING")
                            calcGoogleRoute(this_source_id, this_destination_id, "DRIVING", optimization_way);
                        else
                            calcGoogleRoute(this_route_source_point, this_route_destination_point, this_route_mode, "mode_2");
                    }

                }
                if (google.maps.geometry.poly.containsLocation(marker.position, bound_polygon)) {
                }
                else {

                    if (language === "greek") {
                        alert("Το i-Mobi Volos δεν μπορεί να παρέχει δρομολόγηση έξω από τα όρια της περιοχής μελέτης.");
                    }
                    else {
                        alert("i-Mobi Volos can't provide route outside the green region.");
                    }
                    marker.setMap(null);
                    map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
                    $("#destination_address").empty();

                    $("#show_step_content_1").prop('disabled', true);
                    $("#show_step_content_1").css('border', '2px solid red');
                    $("#show_step_content_1").css('opacity', '0.5');

                    $("#show_step_content_2").prop('disabled', false);
                    $("#show_step_content_2").css('border', '2px solid #00CF00');
                    $("#show_step_content_2").css('opacity', '1');

                    destination_added = "false";
                    destination_id = "null";
                    $("#step2_div").slideUp();
                    $("#step1_div").slideDown(function() {
						$("#remove_source").show("slow"); 
						$("#remove_destination").show("slow"); 
						$("#change_addresses_btn").show("slow");
					});

                    show_step_content_2("choose_by_right_click_2");

                    return;
                }
            }
        }
    });
}

/**
 * For responsiveness layout
 */
function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map-canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    }
    else {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    }
}

/**
 * Set the icon of the port marker
 */
function show_port_marker() {

    var point = new google.maps.LatLng(
        parseFloat(39.358171),
        parseFloat(22.943610));

    if (language === "greek") {
        var name = "Λιμεναρχείο";
        var address = "Κεντρική Προβλήτα";
    }
    else {
        var name = "Port Authority";
        var address = "Central Jetty";
    }
    var telephone = "2421353800";

    var marker = new google.maps.Marker({
        position: point,
        icon: "img/begrenzungspfahl_poller.png",
        draggable: false,
        animation: google.maps.Animation.DROP
    });

    route_additional_markers.push(marker);

    var txt = "<div class='marker_content'><b>" + name + "</b><br>" +
        "<b>" + address + "</b><br><br>";

    txt = txt + "<div class='icon_text'>" +
        "<div class='marker_elem'>" +
        "<div class='marker_elem_row'>" +
        "<div class='icon'> " +
        "<img src ='img/tel_icon.png' height='20' width='20'>" +
        "</div> " +
        "<div class='text'>" + telephone + "</div>" +
        "</div>" +
        "</div><br>";

    setContent(marker, txt);

}

/**
 * Set the content of a marker
 * @param marker = The marker object
 * @param marker_content = The marker's info window content we want to set
 */
function setContent(marker, marker_content) {

    google.maps.event.addListener(marker, 'click', function () {

        InfoWindow.setContent(marker_content);
        InfoWindow.open(map, marker);

    });
    setTimeout(function () {
        InfoWindow.close();
    }, 0);

    marker.setMap(map);

    google.maps.event.addListener(map, "click", function () {
        InfoWindow.close();
    });

}

/**
 * Display markers on the map
 * @param val = the category of markers we want to display
 */
function show(val) {

    map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
    map.setZoom(15);
    $("#line_options_div").fadeOut(700); // hide the line options div

    InfoWindow.close();
    for (var i = 0; i < showMarker.length; i++) {

        // Don't hide the source and destination marker
        if (showMarker[i]["id"] == route_source_point || showMarker[i]["id"] == route_destination_point)
            continue;
        else
            showMarker[i].setVisible(false);
    }
    for (var i = 0; i < showBus.length; i++) {
        showBus[i].setVisible(true);
    }
    downloadUrl("php/emfanishmarkers.php?val=" + val, function (data) {

        var data = new XMLHttpRequest();
        data.open("GET", "php/emfanishmarkers.php?val=" + val, false);
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

            //Create the marker and attach its content
            var marker = createMarker(id, name, point, address, telephone, website, val);

            google.maps.event.trigger(marker, "click");
        }
        setTimeout(function () {
            map.setZoom(14);
            map.panBy(-200, 0);
        }, 500);
        map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
    });

    // Makes the AJAX request to retrieve markers
    function downloadUrl(url, callback) {
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function () {
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

/**
 * Creates a marker object with the following characteritics
 * @param id
 * @param name
 * @param point
 * @param address
 * @param telephone
 * @param website
 * @param val
 * @returns {google.maps.Marker}
 */
function createMarker(id, name, point, address, telephone, website, val) {

    var pos1_lat_lng = [];

    Object.keys(point).forEach(function (key) {
        var val = point[key];
        pos1_lat_lng.push(val);
    });

    var marker = new google.maps.Marker({
        position: point,
        id: pos1_lat_lng[0] + "," + pos1_lat_lng[1],
        draggable: false,
        animation: google.maps.Animation.DROP
    });

    var source = "non_geοcode_address";
    var txt;
    // console.log(website);
    txt = "<div class='marker_content'><b>" + name + "</b><br>" +
        "<b>" + address + "</b><br><br>";
    if (!website || website === "") {
        if (telephone === "") {

            if (language === "greek")
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Επιλογή σημείου </button></div>";
            else
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Choose this point </button></div>";
        }
        else {

            txt = txt + "<div class='icon'> <img src ='img/tel_icon.png' height='20' width='20'></div> <div class='text'>" + telephone + "</div>" +
                "<br><br><div>";
            if (language === "greek")
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Επιλογή σημείου </button></div>";
            else
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Choose this point </button></div>";
        }

    }
    else {

        if (telephone === "") {
            txt = txt + "<div class='icon_text'>" +
                "<div class='marker_elem'>" +
                "<div class='icon'> <img src = 'img/url_icon.png' height='20' width='20'></div>" +
                "<div class='text link'><a target='blank' href=" + website + ">" + website + "</a></div>" +
                "</div>" +
                "</div><br><br>";
            if (language === "greek")
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Επιλογή σημείου </button></div>";
            else
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Choose this point </button></div>";
        }
        else {
            txt = txt + "<div class='icon_text'>" +
                "<div class='marker_elem'>" +
                "<div class='marker_elem_row'>" +
                "<div class='icon'>" +
                "<img src = 'img/url_icon.png' height='20' width='20'>" +
                "</div>" +
                "<div class='text link'>" +
                "<a target='blank' href=" + website + ">" + website + "</a>" +
                "</div>" +
                "</div>" +
                "<div class='marker_elem_row'>" +
                "<div class='icon'> " +
                "<img src ='img/tel_icon.png' height='20' width='20'>" +
                "</div> " +
                "<div class='text'>" + telephone + "</div>" +
                "</div>" +
                "</div><br>";


            if (language === "greek")
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Επιλογή σημείου </button></div>";
            else
                txt = txt + "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + address + "\", \"" + source + "\", \"" + name + "\")'> Choose this point </button></div>";
        }
    }

    // Marker click event
    google.maps.event.addListener(marker, "click", function () {

        if (marker.id == source_id && flag_2 == "true") {
            marker.setIcon("img/dd-start.png");
        }
        else if (marker.id == source_id && flag_2 == "false")
            marker.setIcon("img/dd-end.png");
        else if (marker.id == destination_id && flag_2 == "true")
            marker.setIcon("img/dd-end.png");
        else if (marker.id == destination_id && flag_2 == "false")
            marker.setIcon("img/dd-start.png");
        else {
            if (val == "grade1") {
                marker.setIcon("img/school.png");
            }
            else if (val == "grade2") {
                marker.setIcon("img/school_2.png");
            }
            else if (val == "grade3") {
                marker.setIcon("img/school_3.png");
            }
            else if (val == "other") {
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
        InfoWindow.open(map, marker);
    });

    setTimeout(function () {
        InfoWindow.close();
    }, 0);

    marker.setMap(map);

    showMarker.push(marker);
    google.maps.event.addListener(map, "click", function () {
        InfoWindow.close();
    });
    google.maps.event.addListener(marker, 'dragend', function () {
        InfoWindow.close();
        geocodeNewPosition(marker);
    });
    return marker;
}

/**
 * Creates a bus stop marker with the following chacaractericts
 * @param id
 * @param name
 * @param point
 * @param direction
 * @param number
 * @param code
 * @param val
 * @param flag
 * @returns {google.maps.Marker}
 */
function createBusStop(id, name, point, direction, number, code, val, flag) {

    var pos1_lat_lng = [];
    Object.keys(point).forEach(function (key) {
        var val = point[key];
        pos1_lat_lng.push(val);
    });

    var marker = new google.maps.Marker({
        position: point,
        id: pos1_lat_lng[0] + "," + pos1_lat_lng[1],
        draggable: false,
        animation: google.maps.Animation.DROP
    });
    var busPlus = [];
    var uniqueBusNames = [];
    google.maps.event.addListener(marker, "click", function () {

        // Make a AJAX request
        downloadUrl("php/plus_routes.php?code=" + code, function (data) {

            var data = new XMLHttpRequest();
            data.open("GET", "php/plus_routes.php?code=" + code, false);
            data.overrideMimeType("text/xml");
            data.send(null);
            //--------------------------------------------------
            var xml = data.responseXML;
            var routes = xml.documentElement.getElementsByTagName("route");

            for (var i = 0; i < routes.length; i++) {	// iterate through all routes
                var bus_route = routes[i].getAttribute("bus_route");
                if (bus_route == "4") {
                    bus_route = "4-1";
                }
                if (bus_route == "44") {
                    bus_route = "4-2";
                }
                if (bus_route == "5") {
                    bus_route = "5-1";
                }
                if (bus_route == "55") {
                    bus_route = "5-2";
                }
                busPlus.push(bus_route);
            }

            $.each(busPlus, function (i, el) {
                if ($.inArray(el, uniqueBusNames) === -1) uniqueBusNames.push(el);
            });

        });

        // Makes the AJAX request to retrieve markers
        function downloadUrl(url, callback) {
            var request = window.ActiveXObject ?
                new ActiveXObject('Microsoft.XMLHTTP') :
                new XMLHttpRequest;

            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    request.onreadystatechange = doNothing;
                    callback(request, request.status);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        }

        function doNothing() {
        }

        if (this.id == source_id && flag_2 == "true") {
            marker.setIcon("img/dd-start.png");
        }
        else if (this.id == source_id && flag_2 == "false") {
            marker.setIcon("img/dd-end.png");
        }
        else if (this.id == destination_id && flag_2 == "true") {
            marker.setIcon("img/dd-end.png");
        }
        else if (this.id == destination_id && flag_2 == "false") {
            marker.setIcon("img/dd-start.png");
        }
        else {
            marker.setIcon("img/other_marker.png");
        }

        var source = "non_geοcode_address";

        if (language == "greek") {
            var txt = "<u><b>Όνομα στάσης</b></u>" +
                "<br>" + name + "<br>" +
                "<u><b>Αριθμός γραμμής</b></u>" + "<br>" + number + "<br>" + "<u><b>Κωδικός στάσης</b></u>" +
                "<br>" + code + "<br>" +
                "<u><b>Γραμμές που περνάνε από εδώ</b></u>" + "<br><b>" + uniqueBusNames + "</b><br><br>" +
                "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + code + "\", \"" + source + "\", \"" + name + "\")'> Επιλογή σημείου</button>";
        }
        else {
            var txt = "<u><b>Station's name</b></u>" +
                "<br>" + name + "<br>" +
                "<u><b>Route's number</b></u>" + "<br>" + number + "<br>" + "<u><b>Station's id</b></u>" +
                "<br>" + code + "<br>" +
                "<u><b>Routes through here</b></u>" + "<br><b>" + uniqueBusNames + "</b><br><br>" +
                "<button class='button_1' onclick='choose_this_point(\"" + id + "\", \"" + point + "\", \"" + code + "\", \"" + source + "\", \"" + name + "\")'> Choose this point</button>";
        }

        InfoWindow.setContent(txt);
        InfoWindow.open(map, marker);

    });

    setTimeout(function () {
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

    google.maps.event.addListener(map, "click", function () {
        InfoWindow.close();
    });
    google.maps.event.addListener(marker, 'dragend', function () {

        InfoWindow.close();
        geocodeNewPosition(marker);

    });

    return marker;
}

/**
 * Set a marker with the following charactericts as the source or the destination point of our route
 * @param marker_id
 * @param marker_pos
 * @param address
 * @param source
 * @param name
 */
function choose_this_point(marker_id, marker_pos, address, source, name) {

    InfoWindow.close();
    // If both source and desntination have been initilized, do nothing
    if (source_added === "true" && destination_added === "true") {
        return;
    }

    var address_added_1 = $.trim($("#destination_address").text());
    var address_added_2 = $.trim($("#source_address").text());

    // Same points
    if (address_added_1 == name + "-" + address || address_added_2 == name + "-" + address) {
        return;
    }
    total_addresses++;
    var marker_pos_parts;

    if (source === "non_geοcode_address") {
        marker_pos_parts = marker_pos.split(",");
    }
    var source_link_id;
    var dest_link_id;

    // Source point is empty
    if (!$.trim($("#source_address").html()).length) {

        if (name === " ") {
            $("#source_address").empty().append(address);
        }
        else {
            $("#source_address").empty().append(name + "-" + address);
        }
        source_added = "true";
        $("#directions_div").slideDown();		// Show directions div
        $(".item_with_options").css("color", "#5f6f81");
        $(".item_with_options").css("font-weight", "normal");
        if (language == "greek")
            $(".menu_selected_item").empty().append("-Διάλεξε σημείο-");
        else
            $(".menu_selected_item").empty().append("-Choose point-");

        if (source === "non_geοcode_address") {
            source_id = marker_pos_parts[0].replace("(", "") + "," + marker_pos_parts[1].replace(")", "").replace(/ /g, '');
            source_link_id = marker_pos_parts[0].replace("(", "") + "," + marker_pos_parts[1].replace(")", "").replace(/ /g, '');

        }
        else {
            source_id = marker_pos;
            source_link_id = marker_pos;
        }

        route_source_point = source_id;
        route_source_point_google = source_id;

        route_source_point_address = $("#source_address").html();
        route_source_point_address_google = $("#source_address").html();

        for (var i = 0; i < showMarker.length; i++) {

            if (showMarker[i]["id"] == route_source_point) {
                if (flag_2 === "true") {
                    showMarker[i].setIcon("img/dd-start.png");
                    start_marker = showMarker[i];

                }
                else {
                    showMarker[i].setIcon("img/dd-end.png");
                    end_marker = showMarker[i];
                }
                break;
            }
        }
        $("#source_point").next().attr("id", source_id);

        $("#show_step_content_1").prop('disabled', true);
        $("#show_step_content_1").css('border', '2px solid red');
        $("#show_step_content_1").css('opacity', '0.5');

        if (destination_added === "false") {
            $("#show_step_content_2").prop('disabled', false);
            $("#show_step_content_2").css('border', '2px solid #00CF00');
            $("#show_step_content_2").css('opacity', '1');
        }
        else {
            $("#show_step_content_2").prop('disabled', true);
            $("#show_step_content_2").css('border', '2px solid red');
            $("#show_step_content_2").css('opacity', '0.5');

        }
        $("#choose_by_point_1").slideUp();


    } else {		// Desination point is empty

        if (source === "non_geοcode_address") {
            destination_id = marker_pos_parts[0].replace("(", "") + "," + marker_pos_parts[1].replace(")", "").replace(/ /g, '');
            dest_link_id = marker_pos_parts[0].replace("(", "") + "," + marker_pos_parts[1].replace(")", "").replace(/ /g, '');
        }
        else {
            destination_id = marker_pos;
            dest_link_id = marker_pos;
        }
        if (destination_id != source_id) {
            if (name == " ") {
                $("#destination_address").empty().append(address);
            }
            else {
                $("#destination_address").empty().append(name + "-" + address);
            }
            destination_added = "true";
            $("#directions_div").slideDown();

        }

        route_destination_point = destination_id;
        route_destination_point_google = destination_id;
        route_destination_point_address = $("#destination_address").html();
        route_destination_point_address_google = $("#destination_address").html();


        for (var i = 0; i < showMarker.length; i++) {
            if (showMarker[i]["id"] == route_destination_point) {
                if (flag_2 === "true") {

                    showMarker[i].setIcon("img/dd-end.png");
                    //end.push(showMarker[i]);				// SAVE DESTINATION MARKER
                    end_marker = showMarker[i];

                }
                else {

                    showMarker[i].setIcon("img/dd-start.png");
                    //start.push(showMarker[i]);				// SAVE SOURCE MARKER
                    start_marker = showMarker[i];
                }
                break;
            }
        }

        // Set destination point's id
        $("#destination_point").next().attr("id", dest_link_id);

        $("#show_step_content_2").prop('disabled', true);
        $("#show_step_content_1").prop('disabled', false);

    }

    // Hide all markers except the current one
    for (var i = 0; i < showMarker.length; i++) {
        if (showMarker[i]["id"] == marker_id + address || showMarker[i]["id"] == route_source_point || showMarker[i]["id"] == route_destination_point) {
            continue;
        }
        else {
            showMarker[i].setVisible(false);
        }
    }

    if (source_added == "true") {
        $("#to_options_div").slideDown();
    }
    //if (source_added === "true" && destination_added === "true") {
    if($.trim($("#source_address").html()).length && $.trim($("#destination_address").html()).length){

        $("#line_options_div").fadeOut(700); 		// hide the line options div
        $("#step1_div").slideUp();
        $("#step2_div").slideDown(function() {
			$("#change_addresses_btn").hide("slow");
            $("#remove_source").hide("slow");
            $("#remove_destination").hide("slow");
			//$("li a.help-button").hide();
		});

    }

    if (source_added === "true" || destination_added === "true") {
        $("#line_options_div").fadeOut(700); 		// hide the line options div
    }
    if (flag33 == 1)
        line.setMap(null);	// remove the line from the map	

    google.maps.event.clearListeners(map, 'rightclick');
    google.maps.event.clearListeners(bound_polygon, 'rightclick');
}

/**
 *
 * @param val
 */
function routes(val) {

    map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
    map.setZoom(15);
    var z = 0;
    clearInterval(myVar);
    flag44 = 1;
    if (val == "default") {
        $("#line_options_div").fadeOut(700); // hide the line options div
    }
    else {
        $("#line_options_div").fadeIn(700); // hide the line options div
    }
    for (var i = 0; i < showBus.length; i++) {
        if (showBus[i]["id"] == source_id || showBus[i]["id"] == destination_id) {
            continue;
        }
        else {
            showBus[i].setVisible(false);
        }
    }
    for (var i = 0; i < showInvBus.length; i++) {
        showInvBus[i].setVisible(false);
    }
    showBus = [];
    showInvBus = [];
    if (flag33 == 1) {
        line.setMap(null);
    }
    InfoWindow.close();
    for (var i = 0; i < route.length; i++) {
        if (i == source_id || i == destination_id)
            continue;
        else
            route[i].setVisible(false);
    }
    downloadUrl("php/routes.php?val=" + val, function (data) {
        //--------------------------------------------------
        var data = new XMLHttpRequest();
        data.open("GET", "php/routes.php?val=" + val, false);
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
            var marker = createBusStop(id, name, point, direction, number, code, val, 0);
            google.maps.event.trigger(marker, "click");
        }
        map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
        setTimeout(function () {
            map.setZoom(14);
            map.panBy(-200, 0);
        }, 500);
        if (val != "routes") {
            lineCoordinates = [];
            for (var i = 0; i < showBus.length; i++) {
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
        for (var i = 0; i < showBus.length; i++) {
            z = z + 1;
            ;
        }
        showBus[z - 1].setIcon("img/pin-red.png");
        animateCircle();
    });

    function downloadUrl(url, callback) {
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                request.onreadystatechange = doNothing;
                callback(request, request.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    }

    function doNothing() {
    }
}
/**
 * Change the direction of a bus line
 * @param val = the bus line's id
 */
function change_route_direction(val) {
    var z = 0;
    for (var i = 0; i < showBus.length; i++) {
        showBus[i].setVisible(false);
        InfoWindow.close();
    }
    for (var i = 0; i < showInvBus.length; i++) {
        showInvBus[i].setVisible(false);
    }
    clearInterval(myVar);
    line.setMap(null);
    InfoWindow.close();
    lineCoordinates = [];

    if (flag44 == 1) {
        downloadUrl("php/inv_routes.php?val=" + val, function (data) {
            //--------------------------------------------------
            var data = new XMLHttpRequest();
            data.open("GET", "php/inv_routes.php?val=" + val, false);
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
                var marker = createBusStop(id, name, point, direction, number, code, val, 1);
                google.maps.event.trigger(marker, "click");
            }
            map.setCenter(new google.maps.LatLng(39.369288, 22.943531));
            setTimeout(function () {
                map.setZoom(14);
                map.panBy(-200, 0);
            }, 500);
            if (val != "routes") {
                for (var i = 0; i < showInvBus.length; i++) {
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
            for (var j = 0; j < showInvBus.length; j++) {
                z = z + 1;
            }
            showInvBus[z - 1].setIcon("img/pin-red.png");
            animateCircle();
        });
    }

    else if (flag44 == 0) {
        for (var i = 0; i < showBus.length; i++) {
            showBus[i].setVisible(true);
            InfoWindow.close();
        }
        for (var i = 0; i < showInvBus.length; i++) {
            showInvBus[i].setVisible(false);
        }
        if (val != "routes") {
            for (var i = 0; i < showBus.length; i++) {
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
        for (var i = 0; i < showBus.length; i++) {
            showBus[i].setVisible(false);
            InfoWindow.close();
        }
        for (var i = 0; i < showInvBus.length; i++) {
            showInvBus[i].setVisible(true);
        }
        if (val != "routes") {
            for (var i = 0; i < showInvBus.length; i++) {
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

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                request.onreadystatechange = doNothing;
                callback(request, request.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    }

    function doNothing() {
    }
}

function animateCircle() {
    var count = 0;
    myVar = window.setInterval(function () {
        count = (count + 8) % 1600;

        var icons = line.get('icons');
        icons[0].offset = (count / 16) + '%';
        line.set('icons', icons);
    }, 160);
}
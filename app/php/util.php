<?php
function action($action) {
	return isset($_GET['action']) && $_GET['action'] === $action;
}
function send($arr) {
	die(json_encode($arr));
}
function send_ok() {
	send(['state' => 'ok']);
}
function startsWith($haystack, $needle) {
	return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}
function endsWith($haystack, $needle) {
	return  $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && 
			strpos($haystack, $needle, $temp) !== false);
}
function email_to_pseudo($email) {
	return explode('.', explode('@', $email)[0])[0];
}
function time_to_dist($timestamp) {
	$distance = $timestamp - time();
	$distance_abs = abs($distance);
	if ($distance_abs <= 60) {
		$time = $distance_abs.' seconds';
	} else if ($distance_abs <= 60 * 60) {
		$time = round($distance_abs / 60).' minutes';
	} else if ($distance_abs <= 60 * 60 * 24) {
		$time = round($distance_abs / (60 * 60)).' hours';
	} else if ($distance_abs <= 60 * 60 * 24 * 30) {
		$time = round($distance_abs / (60 * 60 * 24)).' days';
	} else {
		$time = round($distance_abs / (60 * 60 * 24 * 30)).' months';
	}
	if ($distance > 0) {
		return 'in '.$time;
	} else {
		return $time.' ago';
	}
}
?>
<?php
/**
 * File dedicated to Ajax calls & settings.
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

// Search
add_action('ab_ajax_search_api', 'search_api');
add_action('ab_ajax_nopriv_search_api', 'search_api');


/* Used to retrieve posts by search input */
function search_api() {
	wp_verify_nonce($_GET['token'], 'secureAb2015');

	$query = $_GET['s'];

	$args = array(
		'post_type' => 'post',
		'post_status' => 'publish',
		's' => $query
	);

	wp_send_json($data);

	die();
}

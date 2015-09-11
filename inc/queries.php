<?php
/**
 * File that contains the wp_query
 * arguments & calls, through Timber
 * Content:
 * 	1. Queries, containing the queries' wrapper functions
 * 	2. Arguments, containing the query arguments
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

////////////////
// 1. Queries //
////////////////

/* Retrieve last x articles in the homepage, possibly random */
function get_simple_posts($limit=4, $isRandom=false) {
  return Timber::get_posts(simple_posts_query($limit, $isRandom));
}

////////////////////
//  2. Arguments  //
////////////////////

/* Fetch a serie's associated posts */
function simple_posts_query($limit=10, $isRandom=false) {
  $args = array(
    'post_type' => 'post',
    'posts_per_page' => $limit,
  );

  if ($isRandom) {
    $args['orderby'] = 'rand';
  }

  return $args;
}

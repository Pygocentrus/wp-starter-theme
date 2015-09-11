<?php
/**
 * SEO helpers used in the `header.twig` template. They allow the current
 * page to re-write the title/description and social tags.
 * They manage those meta tags contents according to the current page's settings
 * 	- If the page haven't overriden the SEO tags in the BO, we keep the default ones
 * 	- Otherwise we re-write the tags
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

/* Retrieve the OT field suffix according to the current language */
function suffix_lang() {
  return get_language() == 'fr' ? '_fr' : '_en';
}

/* Retrieve a theme option meta tag */
function get_meta_title($title='', $global_title='') {
  if (!empty($title)) {
    return $title;
  } else if (!empty($global_title)) {
    return $global_title;
  } else {
    // return ot_get_option('meta_title' . suffix_lang());
    return '';
  }
}

/* Retrieve a theme option meta tag */
function get_meta_description($description='') {
  // return !empty($description)
  //   ? $description
  //   : ot_get_option('meta_description' . suffix_lang());
  return !empty($description)
    ? $description
    : '';
}

/* Retrieve site URL */
function get_meta_url($url='') {
  return !empty($url) ? $url : site_url();
}

/* Retrieve global social cover */
function get_meta_social_cover($cover='') {
  // return !empty($cover) ? $cover : ot_get_option('meta_social_cover');
  return !empty($cover) ? $cover : '';
}

/* Retrieve twitter author */
function get_meta_twitter_account() {
  // return ot_get_option('meta_twitter_account');
  return '';
}

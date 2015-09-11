<?php
/**
 * Globaly available utils for the theme, in order to stay DRY
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

/* Whether the current user is an admin */
function is_current_user_admin() {
  // return current_user_can('administrator');
  return current_user_can('manage_options');
}

/* Whether the current user is NOT an admin */
function is_current_user_not_admin() {
  return !is_current_user_admin();
}

/* Get the current language dual-char code */
function get_language() {
  return get_locale() == 'fr_FR' ? 'fr' : 'en';
}

/* Get the current language dual-char code */
function get_language_prefix() {
  return get_locale() == 'fr_FR' ? '' : '/en';
}

/* Get the opposite language dual-char code */
function get_inverse_language() {
  return get_locale() == 'fr_FR' ? 'en' : '';
}

/* Orders an array by one of its keys */
function sort_array_by($key, $elements, $order_by=SORT_ASC) {
  $sortArray = array();

  foreach ($elements as $element) {
    foreach ($element as $k=>$v) {
      if (!isset($sortArray[$k])) {
        $sortArray[$k] = array();
      }
      $sortArray[$k][] = $v;
    }
  }

  if (!empty($sortArray)) {
    array_multisort($sortArray[$key], $order_by, $elements);
  }
}

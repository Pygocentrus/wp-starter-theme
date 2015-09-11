<?php
/**
 * Registers Twig helpers, available in any template view,
 * so as to format data output or fetch additionnal content.
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

/*
 * Convert post' image ID to ressource URL,
 * using the 'large' format instead of the raw one
 */
function image_url($id, $size = 'large') {
  $attachment = wp_get_attachment_image_src($id, $size);

  if (!empty($attachment)) {
    return $attachment[0];
  } else {
    return wp_get_attachment_url($id);
  }
}

/* Get the post thumbail, progressively, trying bigger and bigger sizes */
function thumb_url($id, $size = 'large') {
  $thumb = wp_get_attachment_image_src( get_post_thumbnail_id($id), array(530, 460));

  if (!empty($thumb)) {
    return $thumb[0];
  } else {
    $thumb = wp_get_attachment_image_src( get_post_thumbnail_id($id), $size);

    if (!empty($thumb)) {
      return $thumb[0];
    }

    return wp_get_attachment_url($id);
  }
}

/* Truncate item length */
function get_excerpt($text, $size) {
  if (strlen($text) > $size) {
    $text = substr($text, 0, $size);
    $text = substr($text,0,strrpos($text," "));
    $etc = " ...";
    $text = $text.$etc;
  }
  return $text;
}

/* Wheck whether a page corresponds to the current URL */
function is_current_page($pageName) {
  $url = $_SERVER['REQUEST_URI'];
  return preg_match('/\/'.$pageName.'\/?/', $url);
}

/* Escape a title's line breaks */
function remove_line_breaks($element) {
  $el = preg_replace('/\<br \/\>/', ' ', $element);
  $el = preg_replace('/\<br\>/', ' ', $el);
  return $el;
}

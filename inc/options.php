<?php
/**
 * Contains general theme hooks options:
 * 	- Remove emojis junk scripts
 * 	- Add page slug to body tag
 * 	- Redirect login success
 * 	- Change login page style
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

// Remove WPML default stylesheet & script
// define('ICL_DONT_LOAD_LANGUAGE_SELECTOR_CSS', true);
// define('ICL_DONT_LOAD_LANGUAGES_JS', true);

// Generate hourly nonces for secure Ajax calls
add_filter('nonce_life', 'nonce_hourly');

// Remove WPML generator meta tag
if (!empty( $GLOBALS['sitepress'] )) {
  add_action('wp_head', function() {
    remove_action(
      current_filter(),
      array ( $GLOBALS['sitepress'], 'meta_generator_tag' )
    );
  }, 0);
}

// Add page slug to body class
add_filter('body_class', 'add_slug_to_body_class');

// Remove injected emojis scripts & styles
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_styles', 'print_emoji_styles');

// Redirect b-o home to articles after login
add_filter('login_redirect', 'login_redirect', 10, 3);

// Login logo link
add_filter('login_headerurl', 'login_logo_url');

// Login logo title
add_filter('login_headertitle', 'login_logo_url_title');

// Login custom logo image
// add_action('login_enqueue_scripts', 'login_logo');

// Remove wpml generator meta
remove_action('wp_head', 'wp_generator');

// Remove Windows Live Writer link in header
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');

function nonce_hourly() {
  return 3600;
}

function login_logo_url() {
    return home_url();
}

function login_logo_url_title() {
    return 'My Awesome website';
}

function login_logo() { ?>
  <style type="text/css">
    .login h1 a {
      /*background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.png);*/
    }
  </style>
<?php }

function login_redirect( $redirect_to, $request, $user ){
  return get_site_url() . '/wp-admin/edit.php';
}

function add_slug_to_body_class($classes) {
  global $post;
  if (is_home()) {
    $key = array_search('blog', $classes);
    if ($key > -1) {
      unset($classes[$key]);
    }
  } elseif (is_page()) {
    $classes[] = sanitize_html_class($post->post_name);
  } elseif (is_singular()) {
    $classes[] = sanitize_html_class($post->post_name);
  }

  return $classes;
}

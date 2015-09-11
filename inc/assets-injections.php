<?php
/**
 * Register, enqueue and inject scripts according to the ENV.
 * 	- If we're under development, we use un-minified scripts & css.
 * 	- Otherwise we use production-ready files built by Gulp.
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

// Add Custom Scripts to wp_head
add_action('init', 'ab_scripts');

// Add Conditional Page Scripts
add_action('wp_print_scripts', 'ab_conditional_scripts');

// Add Theme Stylesheet
add_action('wp_enqueue_scripts', 'ab_styles');


function ab_scripts() {
  global $dev_scripts;
  global $prod_scripts;

  if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {
    if (DEV) {

      foreach ($dev_scripts as $name => $url) {
        // Un-register script
        wp_deregister_script($name);
        // Register script
        wp_register_script($name, $url, array(), null, true);
        // Enqueue Scripts
        wp_enqueue_script($name);

        if($name == 'app') {
          $dynamic_vars = array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonceToken' => wp_create_nonce('secureAb2015')
          );
          wp_localize_script($name, 'wpVars', $dynamic_vars);
        }
      }

    // If production
    } else {

      foreach ($prod_scripts as $name => $url) {
        // Un-register script
        wp_deregister_script($name);
        // Register script
        wp_register_script($name, $url, array(), false, true);
        // Enqueue Scripts
        wp_enqueue_script($name);

        if($name == 'app') {
          $dynamic_vars = array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonceToken' => wp_create_nonce('secureAb2015')
          );
          wp_localize_script($name, 'wpVars', $dynamic_vars);
        }
      }
    }
  }
}

function ab_conditional_scripts() {
  if (is_page('pagenamehere')) {
    // Conditional script(s)
    wp_register_script('scriptname', get_template_directory_uri() . '/js/scriptname.js', array('jquery'), '1.0.0');
    wp_enqueue_script('scriptname');
  }
}

function ab_styles() {
  global $dev_styles;
  global $prod_styles;

  if (DEV) {

    foreach ($dev_styles as $name => $url) {
      // Un-register style
      // wp_deregister_style($name);
      // Register style
      wp_register_style($name, $url, array(), null);
      // Enqueue style
      wp_enqueue_style($name);
    }

  // If production
  } else {

    foreach ($prod_styles as $name => $url) {
      // Un-register style
      // wp_deregister_style($name);
      // Register style
      wp_register_style($name, $url, array(), false);
      // Enqueue style
      wp_enqueue_style($name);
    }

  }
}

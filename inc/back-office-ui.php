<?php
/**
 * Clears and customize BO
 * 	- Remove unused links, menus & submenus according to user permissions
 * 	- Disable updates for redactors
 * 	- Customize post listing columns, their order and their behavior
 * 	- Change appearance
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

function remove_public_menus() {
  // Dashboard
  remove_menu_page('index.php');
  // Comments
  remove_menu_page('edit-comments.php');
}

function remove_redactor_menus() {
  // Plugins
  remove_menu_page('plugins.php');
  // Pages
  remove_menu_page('edit.php?post_type=page');
  // Tools & browser extension
  remove_menu_page('tools.php');
  // Appearance menu
  remove_menu_page('themes.php');

  // Remove user submenus
  remove_submenu_page('users.php', 'user-new.php');   // User +new
  remove_submenu_page('users.php', 'profile.php');    // User current profile

  // General options submenus
  remove_submenu_page('options-general.php', 'options-discussion.php');   // Discussion options
  remove_submenu_page('options-general.php', 'options-media.php');        // Media options
  remove_submenu_page('options-general.php', 'options-permalink.php');    // Permalink options
}

function remove_admin_bar_links() {
  global $wp_admin_bar;
  $wp_admin_bar->remove_menu('wp-logo');          // Remove the WordPress logo
  $wp_admin_bar->remove_menu('about');            // Remove the about WordPress link
  $wp_admin_bar->remove_menu('wporg');            // Remove the WordPress.org link
  $wp_admin_bar->remove_menu('documentation');    // Remove the WordPress documentation link
  $wp_admin_bar->remove_menu('support-forums');   // Remove the support forums link
  $wp_admin_bar->remove_menu('feedback');         // Remove the feedback link
  $wp_admin_bar->remove_menu('comments');         // Remove the comments link
  $wp_admin_bar->remove_menu('new-content');      // Remove the content link
  $wp_admin_bar->remove_menu('w3tc');             // Remove the performance link
  if (is_current_user_not_admin()) {
    $wp_admin_bar->remove_menu('updates');        // Remove the updates link
    $wp_admin_bar->remove_menu('WPML_ALS');       // Remove the language link
    $wp_admin_bar->remove_menu('WPML_ALS_FR');    // Remove the language link
  }
}

function remove_credits() { return ""; }

function remove_version() { remove_filter('update_footer', 'core_update_footer'); }

function remove_admin_bar() { return false; }

function disable_post_lock() {
  if (post_type_supports(get_current_screen()->post_type, 'disabled_post_lock')) {
    add_filter('wp_check_post_lock_window', '__return_false');
  }
}

function remove_help($old_help, $screen_id, $screen) {
  $screen->remove_help_tabs();
  return $old_help;
}

function remove_core_updates() {
  global $wp_version;
  return (object) array('last_checked'=> time(), 'version_checked' => $wp_version,);
}

// Remove unecessary Appearance sub-menus
// as well as Duplicator and WPCF plugins's menus
function remove_appearance_menu_elements() {
  remove_submenu_page('themes.php', 'theme-editor.php' );

  global $submenu;

  // For Theme submenus deletion
  unset($submenu['themes.php'][6]);   // Personaliser
  unset($submenu['themes.php'][15]);  // En-tête
  unset($submenu['themes.php'][20]);  // Arrière-plan
  unset($submenu['themes.php'][22]);  // En-tête 2
  unset($submenu['themes.php'][23]);  // Arrière-plan 2
}

function change_icon_posts() {
  global $menu;
  foreach ( $menu as $key => $val ) {
    if ( 'Articles' == $val[0] ) {
      $menu[$key][6] = 'dashicons-welcome-write-blog';
    }
  }
}

// Only for non-admin users
if (is_current_user_not_admin()) {
  // Clean UI for non-admin users
  add_action('admin_menu', 'remove_redactor_menus');
  // Remove WP version
  add_action('admin_menu', 'remove_version');
  // Prevent non admins to update plugins
  remove_action('load-update-core.php','wp_update_plugins');
  // Complementary prevent plugin updates notifications
  add_filter('pre_site_transient_update_plugins','__return_null');
  // Prevent core updates
  add_filter('pre_site_transient_update_core','remove_core_updates');
  // Prevent plugins updates
  add_filter('pre_site_transient_update_plugins','remove_core_updates');
  // Prevent theme updates
  add_filter('pre_site_transient_update_themes','remove_core_updates');
  // Remove core updates
  add_action('init', create_function('$a',"remove_action( 'init', 'wp_version_check' );"),2);
}

// Remove useless menus
add_action('admin_menu', 'remove_public_menus');

// Remove useless top admin bar links
add_action('admin_init', 'remove_appearance_menu_elements', 102);

// Remove default admin navbar in the website
add_filter('show_admin_bar', 'remove_admin_bar');

// Remove top BO links
add_action('wp_before_admin_bar_render', 'remove_admin_bar_links');

// Remove WP bottom credits
add_filter('admin_footer_text', 'remove_credits');

// Remove contextual help on posts' edit page
add_filter('contextual_help', 'remove_help', 999, 3);

// Delete short link on posts' edit page
add_filter('pre_get_shortlink', '__return_empty_string');

// Remove the lock feature to prevent multi editing
add_action('load-edit.php', 'disable_post_lock');

// Change default posts' icon
add_action('admin_menu', 'change_icon_posts');

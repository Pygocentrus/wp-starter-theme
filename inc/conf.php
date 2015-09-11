<?php
/**
 * Theme options & variables.
 *
 * /!\ Be careful : /!\
 * This file gets compiled for production during the `$ gulp build` task,
 * so as to use the compiled assets in the following production assets,
 * as well as the `DEV` option. If you make some important changes,
 * please add them in the handlebars template here: `/assets/templates/conf.php.hbs`
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

// DEV or PROD version
define('DEV', true);

// Timezone
date_default_timezone_set('Europe/Paris');

// Max input POST vars
ini_set('max_input_vars', 10000);

// PHP debug
define('WP_DEBUG', DEV);
define('WP_DEBUG_DISPLAY', DEV);
@ini_set('display_errors', DEV);

// Cache management
define('WP_CACHE', !DEV);

// Scripts to be enqueued
$dev_scripts = array(
  "vendors" => get_template_directory_uri() . '/assets/scripts/vendors.js',
  "app" => get_template_directory_uri() . '/assets/scripts/app.js'
);

$prod_scripts = array(
  "vendors" => get_template_directory_uri() . '/dist/scripts/vendors.min.js',
  "app" => get_template_directory_uri() . '/dist/scripts/app.min.js'
);

// Styles to be enqueued
$dev_styles = array(
  "app" => get_template_directory_uri() . '/assets/styles/app.css'
);

$prod_styles = array(
  "app" => get_template_directory_uri() . '/dist/styles/app.min.css'
);

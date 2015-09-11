<?php
/**
 * Launch the AB theme app, based on Timber's starting theme.
 * It also registers Twig's helpers, written in `twig_helpers.php`,
 * as well as context vars, globaly available.
 *
 * @see https://github.com/upstatement/timber-starter-theme
 * @see https://github.com/jarednova/timber
 *
 * @author: Pierre Guilhou <pierre.guilhou@hetic.net>
 */

class Awesome extends TimberSite {

  function __construct() {
    add_theme_support('post-formats');
    add_theme_support('post-thumbnails');
    add_theme_support('menus');

    // Custom properties
    add_filter('timber_context', array($this, 'add_to_context'));

    // Custom Twig helpers
    add_filter('get_twig', array($this, 'add_to_twig'));

    parent::__construct();
  }

  function add_to_context($context) {
    $context['site'] = $this;
    $context['site_url'] = site_url();
    return $context;
  }

  function add_to_twig($twig) {
    $twig->addExtension(new Twig_Extension_StringLoader());

    $twig->addFilter('excerpt', new Twig_Filter_Function('get_excerpt'));

    return $twig;
  }

}

new Awesome();

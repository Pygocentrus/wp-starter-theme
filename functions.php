<?php

/**
 * @author: Pierre Guilhou <pierre.guilhou@hetic.net>
 */

/* Global configuration, constants & ENV */
require_once "inc/conf.php";

/* Utils tools & functions */
require_once "inc/utils.php";

/* CPT definitions */
require_once "inc/custom-post-types.php";

/* Custom BO UI */
require_once "inc/back-office-ui.php";

/* JS & CSS injections */
require_once "inc/assets-injections.php";

/* Ajax requests handling */
require_once "inc/ajax.php";

/* Languages hooks & settings */
require_once "inc/languages.php";

/* Theme options */
require_once "inc/options.php";

/* Twig helpers functions */
require_once "inc/twig_helpers.php";

/* Global theme hooks & settings */
require_once "inc/theme.php";

/* Custom queries definitions */
require_once "inc/queries.php";

/* SEO helpers to dynamically generate header's meta tags */
require_once "inc/seo.php";

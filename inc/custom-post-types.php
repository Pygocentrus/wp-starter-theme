<?php
/**
 * Registers ab's custom post types, plugin-free.
 * 	- Univers
 *
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */

// Register Custom Post Types
add_action('init', 'ab_univers_cpt', 0);

function ab_univers_cpt() {

	$labels = array(
		'name'                => _x('Univers', 'Post Type General Name', 'ab'),
		'singular_name'       => _x('Univers', 'Post Type Singular Name', 'ab'),
		'menu_name'           => __('Univers', 'ab'),
		'name_admin_bar'      => __('', 'ab'),
		'parent_item_colon'   => __('', 'ab'),
		'all_items'           => __('Tous les univers', 'ab'),
		'add_new_item'        => __('Ajouter un univers', 'ab'),
		'add_new'             => __('Ajouter', 'ab'),
		'new_item'            => __('Nouveau univers', 'ab'),
		'edit_item'           => __('Modifier le univers', 'ab'),
		'update_item'         => __('Mettre à jour', 'ab'),
		'view_item'           => __('Afficher le univers', 'ab'),
		'search_items'        => __('Rechercher un univers', 'ab'),
		'not_found'           => __('Aucun univers trouvé', 'ab'),
		'not_found_in_trash'  => __('Aucun univers trouvé dans la corbeille', 'ab'),
	);

	$args = array(
		'label'               => __('univers', 'ab'),
		'description'         => __('Univers post type for ab', 'ab'),
		'labels'              => $labels,
		'menu_icon'           => 'dashicons-archive',
		'supports'            => array('title', 'custom-fields'),
		'taxonomies'          => array('category', 'post_tag' ),
		'hierarchical'        => false,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 6,
		'show_in_admin_bar'   => false,
		'show_in_nav_menus'   => false,
		'can_export'          => true,
		'has_archive'         => true,
		'exclude_from_search' => false,
		'publicly_queryable'  => true,
		'capability_type'     => 'page',
		'supports' => array(
			'title',
			'thumbnail'
		)
	);

	// register_post_type('universe', $args);

}

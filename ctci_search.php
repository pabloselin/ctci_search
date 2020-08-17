<?php
/**
 * Plugin Name:       Buscador de documentos para CTCI
 * Plugin URI:        https://apie.cl
 * Description:       Buscador de documentos (Frontend) para CTCI basado en React y usando la REST API de WP
 * Version:           0.0.1
 * Author:            A Pie
 * Author URI:        https://apie.cl
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ctci
 */

define('CTCISEARCH_VERSION', '0.0.1');

function ctcisearch_enqueue_scripts() {
	global $post;

	if(is_home()) {
		wp_enqueue_script( 'ctci_search', plugin_dir_url( __FILE__ ) . '/build/index.js', ['wp-element', 'wp-api-fetch'], time(), true);
		wp_localize_script( 'ctci_search', 'searchendpoints', ctcisearch_endpoints($postid) );
	}
}

add_action( 'wp_enqueue_scripts', 'ctcisearch_enqueue_scripts');

function ctcisearch_endpoints() {


    $taxonomies = get_object_taxonomies( 'ctci_doc' );

    $taxendpoints = [];

    foreach($taxonomies as $taxonomy) {
        $args = array(
                    'taxonomy' => $taxonomy
                );
        $taxendpoints[] = array(
                                        'labels'    => get_taxonomy_labels( get_taxonomy($taxonomy )),
                                        'endpoint' => get_bloginfo('url') . '/wp-json/wp/v2/' . $taxonomy,
                                        'terms' => get_terms($args)
                                    );
    }

	$endpoints = array(
		'default' => get_bloginfo('url') . '/wp-json/wp/v2/ctci_doc?_embed&search=',
        'taxonomies' => get_bloginfo('url') . '/wp-json/wp/v2/taxonomies',
        'taxonomy_base' => get_bloginfo('url') . '/wp-json/wp/v2/ctci_doc?',
        'taxonomies_endpoints' => $taxendpoints
	);

	return $endpoints;
}

add_action('rest_api_init', 'ctcisearch_register_rest_images' );

// From: https://medium.com/@dalenguyen/how-to-get-featured-image-from-wordpress-rest-api-5e023b9896c6

function ctcisearch_register_rest_images(){
    
    register_rest_field( array('ctci_doc'),
        'fimg_url',
        array(
            'get_callback'    => 'ctcisearch_get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function ctcisearch_get_rest_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'app-thumb' );
        return $img[0];
    }
    return false;
}
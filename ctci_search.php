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

define('CTCISEARCH_VERSION', '0.1');

function ctcisearch_enqueue_scripts() {
	//global $post;	
	wp_enqueue_script( 'ctci_search', plugin_dir_url( __FILE__ ) . 'build/index.js', ['wp-element', 'wp-api-fetch'], time(), true);
	wp_localize_script( 'ctci_search', 'searchendpoints', ctcisearch_endpoints() );
}

add_action( 'wp_enqueue_scripts', 'ctcisearch_enqueue_scripts');

function ctcisearch_endpoints() {


    $taxonomies = array('docarea', 'docpilar', 'doctype');

    $taxendpoints = [];

    foreach($taxonomies as $taxonomy) {
        $args = array(
            'taxonomy' => $taxonomy
        );
        $taxendpoints[] = array(
            'labels'        => get_taxonomy_labels( get_taxonomy($taxonomy )),
            'endpoint'      => get_bloginfo('url') . '/wp-json/wp/v2/' . $taxonomy,
            'terms'         => get_terms($args),
            'name'          => $taxonomy 
        );
    }

    $endpoints = array(
      'default'                   => get_bloginfo('url') . '/wp-json/wp/v2/ctci_doc?_embed&search=',
      'custom'                    => get_bloginfo('url') . '/wp-json/ctcisearch/v1/customsearch/',
      'withyears'                 => get_bloginfo('url') . '/wp-json/ctcisearch/v1/searchwithyears/',
      'taxonomies'                => get_bloginfo('url') . '/wp-json/wp/v2/taxonomies',
      'taxonomy_base'             => get_bloginfo('url') . '/wp-json/wp/v2/ctci_doc?',
      'taxonomies_endpoints'      => $taxendpoints,
      'sitename'                  => get_bloginfo('name'),
      'siteurl'                   => get_bloginfo('url'),
      'years'                     => ctcisearch_minmaxyears()
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

    register_rest_field( array('ctci_doc'),
        'termlist',
        array(
            'get_callback'    => 'ctcisearch_get_rest_termslist',
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

function ctcisearch_get_rest_termslist( $object, $field_name, $request ) {
    $taxonomies = get_object_taxonomies( 'ctci_doc' );
    $taxlist = [];
    foreach($taxonomies as $taxonomy) {
        $taxlist[$taxonomy] = get_the_terms( $object['id'], $taxonomy );
    }

    return $taxlist;
}

function ctcisearch_custom_endpoints() {

    register_rest_route('ctcisearch/v1/', '/customsearch', array(
        'methods' => 'GET',
        'callback' => 'ctcisearch_custom',
        'args' => array(
            'searchquery' => array(
                'validate_callback' => function($param, $request, $key) {
                    return sanitize_text_field( $param );
                }
                )
            )
        )
    );
}

add_action('rest_api_init', 'ctcisearch_custom_endpoints');


function ctcisearch_custom( WP_REST_Request $request) {
    //return $request['searchquery'];
    if($request['startyear'] && $request['endyear'] && $request['s']) {
        $items = ctcisearch_multiquery($request['s'], $request['startyear'], $request['endyear']);
    } else if($request['startyear'] && $request['endyear']) {
        $items = ctcisearch_yearquery( $request['startyear'], $request['endyear']);    
    } else if($request['startyear'] && $request['s']) {
        $items = ctcisearch_multiquery($request['s'], $request['startyear'], false);
    } else if($request['startyear']) {
        $items = ctcisearch_yearquery( $request['startyear'], false);
    }
     else {
        $items = ctcisearch_searchquery($request['s']);
    }

    if($items) {
        return ctcisearch_prepareitems($items);    
    } else {
        return false;
    }
    
}

function ctcisearch_searchquery($search) {

    $args = array(
        'post_type'     => 'ctci_doc',
        's'             => $search,
        'numberposts'   => -1,
        'orderby'    => 'meta_value',
        'meta_key'   => '_ctci_doc_year',
        'order'      => 'ASC'
    );

    $items = get_posts($args);

    return $items;
}

function ctcisearch_multiquery($search, $start_year, $end_year) {

    $args = array(
        'post_type'  => 'ctci_doc',
        'numberposts'=> -1,
        's'          => $search,
        'orderby'    => 'meta_value',
        'meta_key'   => '_ctci_doc_year',
        'order'      => 'ASC'
    );

    if($end_year != false) {
        $args['meta_query'] = array(
            array(
                'key'       => '_ctci_doc_year',
                'value'     => array($start_year, $end_year),
                'compare'   => 'BETWEEN',
                'type'      => 'NUMERIC'
            )
        );
    } else {
        $args['meta_query'] = array(
            array(
                'key'       => '_ctci_doc_year',
                'value'     => $start_year,
                'compare'   => '>=',
                'type'      => 'NUMERIC'
            )
        );
    };

    $items = get_posts($args);

    return $items;
}

function ctcisearch_yearquery($start_year, $end_year) {
    
    $args = array(
        'post_type'     => 'ctci_doc',
        'orderby'       => 'meta_value',
        'meta_key'      => '_ctci_doc_year',
        'order'         => 'ASC',
        'numberposts'   => -1
    );

    if($end_year != false) {
        $args['meta_query'] = array(
                array(
                    'key'       => '_ctci_doc_year',
                    'value'     => array($start_year, $end_year),
                    'compare'   => 'BETWEEN',
                    'type'      => 'NUMERIC'
                )
            );
    } else {
        $args['meta_query'] = array(
                array(
                    'key'       => '_ctci_doc_year',
                    'value'     => $start_year,
                    'compare'   => '>=',
                    'type'      => 'NUMERIC'
                )
            );        
    }

    $items = get_posts($args);    
    
    return $items;
}

function ctcisearch_prepareitems( $items ) {
    if(!$items)
        return;

    $prepared = [];
    
    foreach($items as $item) {
        $prepared[] = ctcisearch_preparedocforapi($item);
    }

    return $prepared;
}

function ctcisearch_preparedocforapi( $doc ) {
    $docid  = $doc->ID;
    $pdfID  = ctci_get_attached_doc_id($docid);
    $img    = wp_get_attachment_image_src( $pdfID, 'medium' );

    $prepared_doc = array(
        'title' => $doc->post_title,
        'id'    => $docid,
        'link'  => get_permalink($docid),
        'date'  => array(
            'day'   => get_post_meta( $docid, '_ctci_doc_day', true),
            'month' => get_post_meta( $docid, '_ctci_doc_month', true),        
            'year'  => get_post_meta( $docid, '_ctci_doc_year', true ),
        ),
        'terms' => array(
            'doctype'   => get_the_terms( $docid, 'doctype' ),
            'docauthor' => get_the_terms( $docid, 'docauthor'),
            'docpilar'  => get_the_terms( $docid, 'docpilar'),
            'docarea'   => get_the_terms( $docid, 'docarea')
        ),
        'image' => $img[0],
        'excerpt' => $doc->post_excerpt
    );

    return $prepared_doc;
}


// function bit_get_mediatype( $playid, $type ) {
//     //get all media for a type associated to play
//     global $wpdb;
//     $media_tablename = $wpdb->prefix . BIT_MEDIATABLENAME;

//     $materialtype = bit_convert_typename($type);
//     $sql = $wpdb->prepare("
//                         SELECT *
//                         FROM {$media_tablename}
//                         WHERE tipo_material = %s 
//                         AND play_asoc = %d",
//                         $materialtype,
//                         $playid
//                     );
//     $results = $wpdb->get_results($sql);

//     return $results;
// }

function ctcisearch_minmaxyears() {
    global $wpdb;
    $tablename = $wpdb->prefix . 'postmeta';

    $query = $wpdb->prepare("SELECT meta_value FROM {$tablename} WHERE meta_key = %s", '_ctci_doc_year', ARRAY_N);
    $years = $wpdb->get_results($query);
    $yearvals = [];
    foreach($years as $year) {
        $yearvals[] = intval($year->meta_value);
    }

    $yearvals = array_unique($yearvals);
    sort($yearvals);

    $allyears = [];

    for($i = $yearvals[0]; $i <= $yearvals[array_key_last($yearvals)]; $i++) {
        $allyears[] = $i;
    }

    return $allyears;
}
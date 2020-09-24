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


    $taxonomies         = array('docarea', 'docpilar', 'doctype');
    $extra_taxonomies   = array('doctema', 'post_tag');
    $picked_terms       = array(['doctype', 'estrategias'], ['doctype', 'orientaciones-por-desafios'], ['doctype', 'documentos-tecnicos']);
    $home_terms         = [];

    foreach($picked_terms as $picked_term) {
        $home_terms[] = ctcisearch_gettermswithchildren($picked_term[1], $picked_term[0]);
    }

    $taxendpoints = [];
    $taxlabels = [];

    foreach($taxonomies as $taxonomy) {
        $args = array(
            'taxonomy' => $taxonomy
        );

        $taxobjlabels = get_taxonomy_labels( get_taxonomy($taxonomy ));

        $taxendpoints[] = array(
            'labels'        => $taxobjlabels,
            'endpoint'      => get_bloginfo('url') . '/wp-json/wp/v2/' . $taxonomy,
            'terms'         => get_terms($args),
            'name'          => $taxonomy 
        );

        $taxlabels[$taxonomy] = $taxobjlabels;
    }

    $endpoints = array(
      'default'                   => get_bloginfo('url') . '/wp-json/wp/v2/ctci_doc?_embed&search=',
      'custom'                    => get_bloginfo('url') . '/wp-json/ctcisearch/v1/customsearch/',
      'taxonomies'                => get_bloginfo('url') . '/wp-json/wp/v2/taxonomies',
      'taxonomy_base'             => get_bloginfo('url') . '/wp-json/wp/v2/ctci_doc?',
      'taxonomy_custom'           => get_bloginfo('url') . '/wp-json/ctcisearch/v1/taxonomysearch',
      'taxonomies_endpoints'      => $taxendpoints,
      'sitename'                  => get_bloginfo('name'),
      'siteurl'                   => get_bloginfo('url'),
      'years'                     => ctcisearch_minmaxyears(),
      'taxonomy_labels'           => $taxlabels,
      'selected_terms'            => $home_terms,
      'terms_home'                => ctcisearch_customterms_endpoint()
  );

    return $endpoints;
}


function ctcisearch_register_terms_menus() {
    register_nav_menus(
        array(
            'terms_home' => 'Términos inicio'
        )
    );
}

add_action('after_setup_theme', 'ctcisearch_register_terms_menus');

function ctcisearch_customterms_endpoint() {
    $locations = get_nav_menu_locations();
    $menu = get_term( $locations['terms_home'], 'nav_menu');
    $menuobj = wp_get_nav_menu_object( $menu->name );
    $menuitems = wp_get_nav_menu_items( $menu->name );
    $terms = [];
    //return $menuitems;

    //var_dump($menuitems);
    
    foreach($menuitems as $menuitem) {
        if($menuitem->menu_item_parent == '0') {
            
            $terminfo = get_term( $menuitem->object_id, $menuitem->object);

            $terms[] = array(
                        'menu_id'   => $menuitem->ID,
                        'name'      => $menuitem->title,
                        'term_id'   => $menuitem->object_id,
                        'taxonomy'  => $menuitem->object,
                        'slug'      => $terminfo->slug
            );

        }
        
    }

    foreach($terms as $key=>$term) {

        foreach($menuitems as $menuitem) {
            if(intval($menuitem->menu_item_parent) == $term['menu_id']) {

                $terminfo = get_term( $menuitem->object_id, $menuitem->object);

                $terms[$key]['children'][] = array(
                    'menu_id'   => $menuitem->ID,
                    'name'      => $menuitem->title,
                    'term_id'   => $menuitem->object_id,
                    'taxonomy'  => $menuitem->object,
                    'slug'      => $terminfo->slug
                );
            }
        }

    }

    return $terms;
}

function ctcisearch_get_rest_termslist( $object, $field_name, $request ) {
    $taxonomies = get_object_taxonomies( 'ctci_doc' );
    $taxlist = [];
    foreach($taxonomies as $taxonomy) {
        $taxlist[$taxonomy] = get_the_terms( $object['id'], $taxonomy );
    }

    return $taxlist;
}

function ctcisearch_buildtaxendpoints($taxonomies_list) {
    $taxendpoints = [];

    foreach($taxonomies_list as $taxonomy) {
        $args = array(
            'taxonomy' => $taxonomy
        );

        $taxobjlabels = get_taxonomy_labels( get_taxonomy($taxonomy ));

        $taxendpoints[] = array(
            'labels'        => $taxobjlabels,
            'endpoint'      => get_bloginfo('url') . '/wp-json/wp/v2/' . $taxonomy,
            'terms'         => get_terms($args),
            'name'          => $taxonomy 
        );
    }

    return $taxendpoints;
}

function ctcisearch_gettermswithchildren($term, $taxonomy) {
    $termobj = get_term_by('slug', $term, $taxonomy, 'ARRAY_A');
    $termchildren = get_term_children( $termobj['term_id'], $taxonomy );
    
    if($termchildren) {
        $termdata = $termobj;
        foreach($termchildren as $termchild) {
            $subchild = get_term_children($termchild, $taxonomy);
            if(!empty($subchild)) {
                $termdata['children'][] = get_term($termchild, $taxonomy, 'ARRAY_A');
            }
        }
    } else {
        $termdata = $termobj;
    }

    return $termdata;
}

function ctcisearch_buildtaxlabels($taxonomies_list) {
    $taxlabels = [];

    foreach($taxonomies_list as $taxonomy) {
        $taxobjlabels = get_taxonomy_labels( get_taxonomy($taxonomy) );
        $taxlabels[$taxonomy] = $taxobjlabels;
    }

    return $taxlabels;
}

function ctcisearch_custom_endpoints() {

    register_rest_route('ctcisearch/v1/', '/customsearch', array(
        'methods' => 'GET',
        'callback' => 'ctcisearch_custom',
        'args' => array(
            's' => array(
                'validate_callback' => function($param, $request, $key) {
                    return sanitize_text_field( $param );
                }
            ),
            'startyear' => array(
                'validate_callback' => function($param, $request, $key) {
                    return sanitize_text_field( $param );
                }
            ),
            'endyear' => array(
                'validate_callback' => function($param, $request, $key) {
                    return sanitize_text_field( $param );
                }
            )
        )
    )
);

    register_rest_route('ctcisearch/v1/', '/taxonomysearch', array(
        'methods' => 'GET',
        'callback' => 'ctcisearch_taxonomysearch',
        'args' => array(
            'taxonomy' => array(
                'validate_callback' => function($param, $request, $key) {
                    return sanitize_text_field( $param );
                }
            ),
            'term' => array(
                'validate_callback' => function($param, $request, $key) {
                    return sanitize_text_field( $param );
                }
            )
        )
    )
);
}

add_action('rest_api_init', 'ctcisearch_custom_endpoints');

function ctcisearch_taxonomysearch( WP_REST_Request $request) {
    $args = array(
        'post_type'     => 'ctci_doc',
        'numberposts'   => -1,
        'orderby'       => 'meta_value',
        'meta_key'      => '_ctci_doc_year',
        'order'         => 'ASC'
    );

    $args['tax_query'] = array(
        array(
            'taxonomy' => $request['taxonomy'],
            'field'    => 'term_id',
            'terms'     => $request['term']
        )
    );

    $items = get_posts($args);

    if($items) {
        return ctcisearch_prepareitems($items);
    } else {
        return false;
    }
}


function ctcisearch_custom( WP_REST_Request $request) {
    //return $request['searchquery'];
    // if($request['start_year'] && $request['end_year'] && $request['content']) {
    //     $items = ctcisearch_multiquery($request['content'], $request['start_year'], $request['end_year']);
    // } else if($request['start_year'] && $request['end_year']) {
    //     $items = ctcisearch_yearquery( $request['start_year'], $request['end_year']);    
    // } else if($request['start_year'] && $request['content']) {
    //     $items = ctcisearch_multiquery($request['content'], $request['start_year'], false);
    // } else if($request['start_year']) {
    //     $items = ctcisearch_yearquery( $request['start_year'], false);
    // }
    // else {
    //     $items = ctcisearch_searchquery($request['content']);
    // }

    $items = ctcisearch_multiquery($request);
    $title = ctcisearch_buildtitle(count($items), $request);
    if($items) {
        $response = array(
            'title' => $title,
            'items' => ctcisearch_prepareitems($items)
        );
        
    } else {
        $response = array(
            'title' => $title,
            'items' => []
        );
    }
    
    return $response;    
}

function ctcisearch_buildtitle($noitems, $query) {
    
    $termparams = ['doctype', 'docarea', 'docauthor', 'doctema', 'docpilar', 'post_tag'];

    $title = array(
        'count' => $noitems, 
        'searchcontent' => $query['content'], 
        'start_year' => $query['start_year'], 
        'end_year' => $query['end_year']
    );

    foreach($termparams as $termparam) {
        if(isset($query[$termparam])) {
            $term = get_term_field( 'name', $query[$termparam], $termparam );
            $title['terms'][$termparam] = $term;
        }
    }


    return $title;
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

function ctcisearch_multiquery($request) {

    $params = ['content', 'start_year', 'end_year'];
    $termparams = ['doctype', 'docarea', 'docauthor', 'doctema', 'docpilar', 'post_tag'];


    $args = array(
        'post_type'  => 'ctci_doc',
        'numberposts'=> -1,
        's'          => $request['content'],
        'orderby'    => 'meta_value',
        'meta_key'   => '_ctci_doc_year',
        'order'      => 'ASC'
    );

    
    if($request['end_year']) {
        $args['meta_query'] = array(
            array(
                'key'       => '_ctci_doc_year',
                'value'     => array($request['start_year'], $request['end_year']),
                'compare'   => 'BETWEEN',
                'type'      => 'NUMERIC'
            )
        );
    } elseif($request['start_year']) {
        $args['meta_query'] = array(
            array(
                'key'       => '_ctci_doc_year',
                'value'     => $request['start_year'],
                'compare'   => '>=',
                'type'      => 'NUMERIC'
            )
        );
    };

    $args['tax_query'] = array('relation' => 'AND');

    foreach($termparams as $termparam) {
        if($request[$termparam]) {
            $args['tax_query'][] = array(
                                    'taxonomy' => $termparam, 
                                    'field'    => 'term_id',
                                    'terms'    => $request[$termparam]
                                );
        }
    }

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
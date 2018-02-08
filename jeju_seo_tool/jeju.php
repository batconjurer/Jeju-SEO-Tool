<?php
/*
Plugin Name: Jeju SEO Writing Plugin
Plugin URI: www.jacobwadeturner.weebly.com
Description: Plugin to help integrate SEO keywords into blog post text.
Version: 1.1
Author: Jacob Turner
License: GPL 3.0
License URI: https://www.gnu.org/licenses/gpl-3.0.en.html

/*
Jeju SEO Writing Plugin is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.
 
Jeju SEO Writing Plugin is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with Jeju SEO Writing Plugin. If not, see https://www.gnu.org/licenses/gpl-3.0.en.html.
*/


/* Adding Keyphrases forms and buttons */
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

add_action('edit_form_after_title','add_kwd_form');

add_action('edit_form_after_editor', 'add_keywords_table');

add_action('admin_head','setup_kwd_button_plugin');


function add_kwd_form(){
	global $typenow;
	if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ){
		return;
	}
		
	if ( get_user_option('rich_editing') !== 'true'){
		return;
	}

	if( !in_array($typenow, array( 'post', 'page' )) ){
        return;
	}
	
	echo '<textarea id="keywords-form" style="width:500px;height:150px;" required 
placeholder="Please enter a list of search terms separated by commas or on separate lines.">
</textarea> <p id="error-message"></p>';
}

function add_keywords_table() {
	global $typenow;
	if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ){
		return;
	}
		
	if ( get_user_option('rich_editing') !== 'true'){
		return;
	}

	if( !in_array($typenow, array( 'post', 'page' )) ){
        return;
	}
	$tableString = '<table id="container" ><tr valign="top" >';
	
	for ( $i = 0; $i < 2; $i++ ) {
		$tableString .= '<td><table id="the-table-'.$i.'" style="border:  1px solid black"> </table></td>';
	}
	
	echo $tableString.'</tr></table>';
}

function setup_kwd_button_plugin(){
	global $typenow;
	if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ){
		return;
	}
		
	if ( get_user_option('rich_editing') !== 'true'){
		return;
	}

	if( !in_array($typenow, array( 'post', 'page' )) ){
        return;
	}
		
	add_filter('mce_buttons', 'add_toggle_button');
	add_filter('mce_buttons', 'add_kwd_button');
	add_filter('mce_external_plugins', 'add_toggle_plugin');
	add_filter('mce_external_plugins', 'add_kwd_plugin');
		
}

function add_toggle_button($buttons) {
	array_push($buttons, '|', 'toggle_jeju_button');
	return $buttons;
}

function add_toggle_plugin($plugin_array){
	$plugin_array['toggle_jeju_button'] = plugins_url('/js/kwds_form.js',__FILE__);
	return $plugin_array;
}

function add_kwd_button($buttons) {
	array_push($buttons,'|', 'keyword_button');
	return $buttons;
}

function add_kwd_plugin($plugin_array){
	$plugin_array['keyword_button'] = plugins_url('/js/kwds_form.js',__FILE__);
	return $plugin_array;
}


/* Adding Table Buttons and Functionality */
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/	


function add_table_buttons_scripts(){
	global $typenow;	

	if( !in_array($typenow, array( 'post', 'page' )) ){
        return;
	}
	echo '<script language="javascript" src="'.plugins_url('/js/table_buttons.js',__FILE__).'">';
	echo '</script>';
	//wp_register_script('table_buttons',plugins_url('/js/table_buttons.js',__FILE__), array('jQuery'));
	//wp_enqueue_script('table_buttons');
}

add_action('admin_enqueue_scripts', 'add_table_buttons_scripts');

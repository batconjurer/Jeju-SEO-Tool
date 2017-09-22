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

class jeju_seo_tool_class {

	function __construct(){

		if ( is_admin() ) {
			add_action('init', array( $this, 'setup_jeju_plugin'));
		}

	}

	function setup_jeju_plugin(){
		if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ){
			return;
		}
		
		if ( !get_user_option('rich_editing') !== 'true'){
			return;
		}
		
		add_filter('jeju_buttons', array($this,'add_jeju_buttons'));
		add_filter('jeju_external_plugin', array($this,'add_jeju_plugin'));
		
	}
	
	function add_jeju_plugin($plugin_array){
		$plugin_array['keyword_class'] = plugin_dir_url(__FILE__).'/js/jeju.js';
		return $plugin_array;
	}

	function add_jeju_buttons($buttons) {
		array_push($buttons, '|', 'keyword_class');
		return $buttons;
	}
/*
function add_keywords_form() {
	echo '<textarea id="keywords-form" style="width:500px;height:150px;" required 
placeholder="Please enter a list of search terms separated by commas or on separate lines.">
</textarea> <button id="kwds-submit-button"> Submit </button> <p id="key-vals"></p>';
}

add_action('edit_form_after_title','add_keywords_form');



function add_keywords_table() {
	echo '<table id="the-table"> </table>';
}

add_action('edit_form_after_editor', 'add_keywords_table');

function include_keywords_form_js_file(){
	wp_enqueue_script('keywords_form', plugin_dir_url(__FILE__).'/js/jeju.js', array('jquery'));
}

add_action('wp_enqueue_media','include_keywords_form_js_file');
*/
}

$jeju_seo_tool= new jeju_seo_tool_class;


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

function add_keywords_box() {
	echo "<textarea id='keywords-form' style='width:500px;height:150px;' required
 placeholder='Please enter a list of search terms separated by commas or on
 separate lines.'></textarea> <button id='submitButton'> Submit </button>";
}

add_action('edit_form_after_title','add_keywords_box');

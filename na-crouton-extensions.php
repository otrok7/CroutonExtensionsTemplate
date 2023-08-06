<?php
/**
Plugin Name: NA Crouton Extensions
Plugin URI: none
Description: Extentions to Crouton for German site
Version: 0.1.0
*/
class na_handebars {
    function __construct(){
        add_action("wp_enqueue_scripts", array(&$this, "enqueue_frontend_files"));	
        add_action("wp_body_open", array(&$this, "configureJS"));	
    }
    function enqueue_frontend_files() {
        if ($this->hasShortcode()) {
            $jsfilename = (isset($_GET['croutonjsdebug']) ? "crouton.nojquery.js" : "crouton.nojquery.min.js");
            wp_enqueue_script("croutonjs", plugin_dir_url(__FILE__) . "../crouton/croutonjs/dist/$jsfilename", array('jquery'), filemtime(plugin_dir_path(__FILE__) . "../crouton/croutonjs/dist/$jsfilename"), true);
            wp_enqueue_script("crouton-extensions", plugin_dir_url(__FILE__) . "na-crouton-extensions.js", array('croutonjs'), filemtime(plugin_dir_path(__FILE__) . "na-crouton-extensionst.js"), true);
        }
    }
    var $has_shortcode;
    var $shortcode_tested = false;
    function hasShortcode()
    {
        if ($this->shortcode_tested) return $this->has_shortcode;
        $this->shortcode_tested = true;
        $this->has_shortcode = false;
        $post_to_check = get_post(get_the_ID());
        $post_content = $post_to_check->post_content ?? '';
        // check the post content for the short code
        if (stripos($post_content, '[bmlt_tabs') !== false) {
            $this->has_shortcode = true;
        }
        if (stripos($post_content, '[bmlt_handl') !== false) {
            $this->has_shortcode = true;
        }
        return $this->has_shortcode;
    }
    function configureJS() {
        if ($this->hasShortcode()) {
            $ret = '<script type="text/javascript">';
            $ret .= "var c_g_CroutonExtension_flags = '".plugin_dir_url(__FILE__)."crouton-extensions-lang/';" . (defined('_DEBUG_MODE_') ? "\n" : '');
            $ret .= '</script>';
            echo $ret;
        }
    }
}
new na_handebars();
?>
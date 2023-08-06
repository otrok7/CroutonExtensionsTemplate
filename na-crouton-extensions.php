<?php
/**
Plugin Name: NA Crouton Extensions
Plugin URI: none
Description: Template for extending crouton by adding Helpers and Partials to Handlebars
Version: 0.1.0
*/
class na_handebars {
    function __construct(){
        add_action("wp_enqueue_scripts", array(&$this, "enqueue_frontend_files"));	
    }
    function enqueue_frontend_files() {
        if ($this->hasShortcode()) {
            $jsfilename = (isset($_GET['croutonjsdebug']) ? "crouton.nojquery.js" : "crouton.nojquery.min.js");
            wp_enqueue_script("croutonjs", plugin_dir_url(__FILE__) . "../crouton/croutonjs/dist/$jsfilename", array('jquery'), filemtime(plugin_dir_path(__FILE__) . "../crouton/croutonjs/dist/$jsfilename"), true);
            wp_enqueue_script("crouton-extensions", plugin_dir_url(__FILE__) . "na-crouton-extensions.js", array('croutonjs'), filemtime(plugin_dir_path(__FILE__) . "na-crouton-extensionst.js"), true);
        }
    }
    var $has_shortcode;
    function hasShortcode()
    {
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
}
new na_handebars();
?>

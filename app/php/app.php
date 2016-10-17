<?php
class App {
	function __construct() {
		$this->templates = '';
		$this->js_files = [];
		$this->config = json_decode(file_get_contents(ROOT_PATH.'config.json'), true);
		$this->compiled_js = $this->config['compiled_js'];
		if ($this->config['configured']) {
			require_once ROOT_PATH.'app/php/db.php';
			Db::initialize();
		}
	}
	function load_var() {
		$vars = [];
		$vars_origin = Db::getAll('var');
		foreach ($vars_origin as $key => $var) {
			$vars[$var['name']] = $var['value'];
		}
		return $vars;
	}
	function find_file($file_origin) {
		$path = implode('/', explode('/', $file_origin, -1));
		$path_part = explode('/', $file_origin);
		$filename = end($path_part);
		foreach (glob($path.'/*') as $key => $file) {
			if(substr($file, 0, strlen($file_origin)) === $file_origin) {
				return $file;
			}
		}
		return false;
	}
	function include_folders($folders) {
		foreach ($folders as $key => $folder) {
			self::include_files(ROOT_PATH.$folder);
		}
	}
	function include_files($file) {
		$res = '';
		if (is_dir($file)) {
			foreach (glob($file.'/*') as $key => $sub) {
				$res .= self::include_files($sub);
			}
		} else {
			$file = explode(ROOT_PATH, $file)[1];
			if (endsWith($file, '_compiled.js')) {
				if($this->compiled_js) {
					$this->files[] = ['type' => 'js', 'url' => $file];
				}
			} else if (endsWith($file, '.js') && !$this->compiled_js) {
				$this->files[] = ['type' => 'js', 'url' => $file];
			} else if (endsWith($file, '.css')) {
				$this->files[] = ['type' => 'css', 'url' => $file];
			} else if (endsWith($file, '.html')) {
				$res .= file_get_contents(ROOT_PATH.$file);
			}
			$res .= "\n";
			$this->templates .= $res;
		}
	}
	function get_img_uploaded() {
		$images = [];
		foreach (glob(ROOT_PATH.'app/img/uploaded/*') as $key => $file) {
			preg_match('#/img/uploaded/(.*?)_v=#', $file, $matches);
			$images[$matches[1]] = '/app/img/'.explode('/app/img/', $file)[1];
		}
		return $images;
	}
}
?>
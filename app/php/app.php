<?php

class App
{
	function __construct()
	{
		$this->config = json_decode(file_get_contents(ROOT_PATH.'app/config.json'), true);

		if ($this->config['configured'])
		{
			require_once ROOT_PATH.'app/php/db.php';
			Db::initialize();
		}
	}

	function load_var()
	{
		$vars = [];
		$vars_origin = Db::getAll('var');
		foreach ($vars_origin as $key => $var)
		{
			$vars[$var['name']] = $var['value'];
		}
		return $vars;
	}

	function gvar_to_js($gvar)
	{
		$gvar_js = '<script>gvar ={';
		foreach ($gvar as $key => $var)
		{
			$gvar_js .= $key.': '.var_export($var, true).',';
		}
		$gvar_js .= '}</script>';
		echo $gvar_js;
	}

	function find_file($file_origin)
	{
		$path = implode('/', explode('/', $file_origin, -1));
		$path_part = explode('/', $file_origin);
		$filename = end($path_part);
		foreach (glob($path.'/*') as $key => $file)
		{
		    if(substr($file, 0, strlen($file_origin)) === $file_origin)
		    {
		        return $file;
		    }
		}
	}

	function include_folders($folders)
	{
		foreach ($folders as $key => $folder)
		{
			self::include_files($folder);
		}
	}

	function include_files($file)
	{
		$res = '';
		
		if (is_dir($file))
		{
			foreach (glob($file.'/*') as $key => $sub)
			{
				$res .= self::include_files($sub);
			}
		}
		else
		{
			if (endsWith($file, '.js'))
			{
				$res .= '<script src="'.$file.'"></script>';
			}
			else if (endsWith($file, '.css'))
			{
				$res .= '<link rel="stylesheet" href="'.$file.'">';
			}
			else if (endsWith($file, '.html'))
			{
				$res .= file_get_contents($file);
			}
			$res .= "\n";
		}
		echo $res;
	}
}

?>
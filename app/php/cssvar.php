<?php

class Cssvar
{
	var $global_var = [];
	var $local_var = [];
	var $total_var = [];

	function load_global_var($filename)
	{
		$file = file_get_contents($filename);
		foreach (explode("\n", $file) as $key => $line)
		{
			if (strpos($line, ':') !== false)
			{
				$res = self::get_val_var($line);
				$this->global_var[$res[0]] = $res[1];
			}
		}
	}

	function load_local_var($css)
	{
		$start_css_var = strpos($css, '$cssvar{') + 9;
		$end_css_var = strpos($css, '}');
		$len_css_var = $end_css_var - $start_css_var;
		$css_vars_str  = substr($css, $start_css_var , $len_css_var);
		$css_vars = explode(";", $css_vars_str);
		foreach ($css_vars as $key => $cssvar)
		{
			if (strpos($cssvar, ':') !== false)
			{
				$res = self::get_val_var($cssvar);
				$this->local_var[$res[0]] = $res[1];
			}
		}
	}

	function get_val_var($line)
	{
		$line = trim($line);
		$two_part = explode(":", $line);
		$res = [
			trim($two_part[0]),
			trim(trim($two_part[1]), ';')
		];
		return $res;
	}

	function replace_val($css_line, $var, $val)
	{
		$cursor = strpos($css_line, $var);
		while ($css_line[$cursor] != ' ')
		{
			$cursor -= 1;
		}
		$before = substr($css_line, 0, $cursor + 1);
		$after = explode($var, $css_line)[1];
		$css_line = $before.$val.$var.$after;
		return $css_line;
	}

	function replace_each_var($css_line)
	{
		foreach ($this->total_var as $var => $val)
		{
			$var = '/*'.$var.'*/';

			if (strpos($css_line, $var) !== false)
			{
				$css_line = self::replace_val($css_line, $var, $val);
			}
		}
		return $css_line;
	}

	function translate_css($css)
	{
		$css_lines = explode("\n", $css);
		$css = '';
		foreach ($css_lines as $key => $css_line)
		{
			if (strpos($css_line, '/*') !== false)
			{
				$css_line = self::replace_each_var($css_line);
			}
			$css .= $css_line."\n";		
		}
		$css = trim($css, "\n");
		return $css;
	}

	function process_file($filename)
	{
		$this->total_var = [];
		$this->local_var = [];
		$css = file_get_contents($filename);
		if (strpos($css, '$cssvar') !== false)
		{
			self::load_local_var($css);
		}
		$this->total_var = $this->local_var + $this->global_var;
		$css = self::translate_css($css);
		file_put_contents($filename, $css);
	}

	function process_folder($path)
	{
		foreach (glob($path.'/*') as $key => $file)
		{
			if (is_dir($file))
			{
				self::process_folder($file);
			}
			else if (endsWith($file, '.css'))
			{
				self::process_file($file);
			}
		}
	}

	function process_folders($folders)
	{
		foreach ($folders as $key => $folder)
		{
			self::process_folder($folder);
		}
	}
}

?>
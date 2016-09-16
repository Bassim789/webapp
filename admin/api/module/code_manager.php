<?php

class Code_manager
{
	function __construct(
		$token = '',
		$url = '',
		$root_path = '/',
		$site_version = 'UNIQUE',
		$site_dev_domain = '/',
		$site_prod_domain = '/'
	){
		$this->token = $token;
		$this->url = $url;
		$this->root_path = $root_path;
		$this->site_version = $site_version;
		$this->site_dev_domain = $site_dev_domain;
		$this->site_prod_domain = $site_prod_domain;
	}

	function process($action)
	{
		$res = array(
	    	'res' => 'FAIL',
	        'error' => 'wrong action'
	    );

		if (isset($action))
		{
			if ($action == 'show_database')
			{
				$res = array(
			    	'res' => 'OK',
			        'databases' => self::get_db_structure()
			    );
			}
			else if ($action == 'diff_dev_prod_database')
			{
				$res = array(
			    	'res' => 'OK',
			        'databases' => self::get_db_diff_dev_prod()
			    );
			}
			else if ($action == 'api_get_files')
			{
				$res = self::api_get_files();
			}
			else if ($action == 'api_get_db')
			{
				$res = self::get_db_structure($asso_key = true);
			}
			else if ($action == 'get_ftp_view')
			{
				$res = self::get_ftp_view();
			}
			else if ($action == 'get_ftp_diff_dev_prod')
			{
				$res = self::get_ftp_diff_dev_prod();
			}
			else if ($action == 'get_search_in_files')
			{
				$res = self::get_search_in_files();
			}
		}
		
		die(json_encode($res));
	}

	function get_db_structure($asso_key = false)
	{
		$index = -1;
		$last_db_name = '';
		$databases = [];

		$table_infos = DB::query(
			"SELECT * 
			FROM information_schema.tables 
			WHERE TABLE_TYPE = 'BASE TABLE'"
		);

		foreach ($table_infos as $key => $row)
		{
			if ($row['TABLE_SCHEMA'] != $last_db_name)
			{
				$index += 1;
				$last_db_name = $row['TABLE_SCHEMA'];
				
				$databases[$index] = [
					'db_name' => $row['TABLE_SCHEMA'],
					'tables' => []
				];
			}

			$cols = [];

			$col_infos = DB::query(
				"SELECT *
				FROM information_schema.COLUMNS
				WHERE TABLE_SCHEMA = '".$row['TABLE_SCHEMA']."'
				AND TABLE_NAME = '".$row['TABLE_NAME']."'"
			);
			foreach ($col_infos as $key => $col)
			{
				if ($col['CHARACTER_MAXIMUM_LENGTH'] == NULL)
				{
					$col_type = $col['COLUMN_TYPE'];
				}
				else
				{
					$col_type = $col['DATA_TYPE'].'('.$col['CHARACTER_MAXIMUM_LENGTH'].')';
				}

				$col_data = [
					'col' => $col,
					'col_name' => $col['COLUMN_NAME'],
					'col_type' => $col_type,
					'col_key' => self::nice_key($col['COLUMN_KEY']),
					'col_default' => $col['COLUMN_DEFAULT'],
					'col_encoding' => $col['COLLATION_NAME']
				];

				if ($asso_key)
				{
					$cols[$col['COLUMN_NAME']] = $col_data;
				}
				else
				{
					$cols[] = $col_data;
				}
			}

			$table = [
				'table_name' => $row['TABLE_NAME'],
				'nb_row' => number_format($row['TABLE_ROWS'], 0, ".", "'"),
				'nb_col' => count($cols),
				'cols' => $cols,
				'all' => $row
			];

			if ($asso_key)
			{
				$databases[$index]['tables'][$row['TABLE_NAME']] = $table;
			}
			else
			{
				$databases[$index]['tables'][] = $table;
			}

			$databases[$index]['nb_table'] = count($databases[$index]['tables']);
		}
		return $databases;
	}

	function nice_key($key)
	{
		if ($key == 'MUL')
		{
			return 'INDEX';
		}
		else if ($key == 'PRI')
		{
			return 'PRIMARY';
		}
		return '';
	}

	function get_db_diff_dev_prod()
	{
		return $databases_diff = self::comparison_db(
			self::get_db_structure($asso_key = true),
			self::api_diff('api_get_db')
		);
	}

	function api_diff($action)
	{
		$param = array(
			'token' => $this->token,
			'action' => $action,
			'exclud_folders' => $_POST['exclud_folders'],
			'folder' => $_POST['folder']
		);

		if ($this->site_version == 'DEV'){ $url = $this->site_prod_domain; }
		else if ($this->site_version == 'PROD'){ $url = $this->site_dev_domain; }
		$url .= $this->url;

		$urlWithPara = $url.'?'.http_build_query($param);

		$curl = curl_init();
		curl_setopt_array($curl, array(
		    CURLOPT_RETURNTRANSFER => 1,
		    CURLOPT_URL => $urlWithPara,
		    CURLOPT_HEADER => 0,
		    CURLOPT_SSL_VERIFYHOST => 0,
		    CURLOPT_SSL_VERIFYPEER => false,
		    CURLOPT_HEADER => false,
		    CURLOPT_FOLLOWLOCATION => 1
		));

		$json_response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

		if ($status != 202 && $status != 201 && $status != 200)
		{
		    $res = "Error: call to URL: $url <br>
		    	 failed with status: $status <br>
		    	 response: $json_response <br>
		    	 curl_error: " . curl_error($curl) . "<br>
		    	 curl_errno: " . curl_errno($curl) . "<br>";
		}
		else
		{
			$res = json_decode($json_response, true);
		}

		return $res;
	}

	function asso_to_array($assos, $key_diff = false)
	{
		$array = [];
		foreach ($assos as $key => $value)
		{
			if ($key_diff && $key_diff == $key)
			{
				$value['first_col_diff'] = true;
			}

			$array[] = $value;
		}
		return $array;
	}

	function get_ftp_view()
	{
		$rows = [
			'sub' => [],
			'dir' => [],
			'file' => []
		];

		$path = rtrim($this->root_path.$_POST['folder'], '/');

		if($path != $this->root_path)
		{
			$rows['sub'][] = [
				'back_folder' => implode('/', explode('/', $_POST['folder'], -1))
			];
		}

		foreach (glob($path.'/*') as $key => $file)
		{
			$file_clean = explode($path.'/', $file)[1];

			if (is_dir($file))
			{
				$rows['dir'][] = [
					'file_clean' => $file_clean
				];
			}
			else
			{
				$rows['file'][] = [
					'file_clean' => $file_clean
				];
			}
		}

		return $rows;
	}


	function comparison_db($databases_this, $databases_other)
	{
		if ($this->site_version == 'PROD')
		{
			$temp = $databases_this;
			$databases_this = $databases_other;
			$databases_other = $temp;
		}

		$databases_diff = [];
		$index = -1;

		foreach ($databases_this as $key_db => $database_this)
		{
			$index += 1;
			$databases_diff[$index] = [
				'db_name' => $database_this['db_name'],
				'tables_only_dev' => [],
				'tables_diff_in' => [],
				'is_diff' => false
			];

			foreach ($database_this['tables'] as $key_table => $table_this)
			{
				if (!isset($databases_other[$key_db]['tables'][$key_table]))
				{
					$databases_diff[$index]['tables_only_dev'][] = [
						'state' => 'only_in_this_db',
						'table_name' => $table_this['table_name'],
						'nb_row' => $table_this['nb_row'],
						'nb_col' => $table_this['nb_col'],
						'cols' => self::asso_to_array($table_this['cols'])
					];

					$databases_diff[$index]['is_diff'] = true;
				}
				else
				{
					$table_other = $databases_other[$index]['tables'][$key_table];

					foreach ($table_this['cols'] as $key_col => $col_this)
					{
						$col_other = $table_other['cols'][$key_col];

						if (!isset($col_other) ||
							$col_other['col_type'] != $col_this['col_type'] ||
							$col_other['col_key'] != $col_this['col_key'] ||
							$col_other['col_default'] != $col_this['col_default'] ||
							$col_other['col_encoding'] != $col_this['col_encoding'] ||
							$table_other['nb_col'] != $table_this['nb_col']
						){
							$databases_diff[$index]['tables_diff_in'][] = [
								'state' => 'diff_in',
								'table_name' => $table_this['table_name'].' | DEV',
								'nb_row' => $table_this['nb_row'],
								'nb_col' => $table_this['nb_col'],
								'cols' => self::asso_to_array($table_this['cols'], $key_col)
							];

							$databases_diff[$index]['tables_diff_in'][] = [
								'state' => 'diff_in',
								'table_name' => $table_other['table_name'].' | PROD',
								'nb_row' => $table_other['nb_row'],
								'nb_col' => $table_other['nb_col'],
								'cols' => self::asso_to_array($table_other['cols'], $key_col)
							];

							$databases_diff[$index]['is_diff'] = true;
							break;
						}
					}
				}
			}

			$databases_diff[$index]['nb_tables_only_dev'] = count($databases_diff[$index]['tables_only_dev']);
			$databases_diff[$index]['nb_tables_diff_in'] = count($databases_diff[$index]['tables_diff_in']) / 2;
		}

		$index = -1;
		foreach ($databases_other as $key_db => $database_other)
		{
			$index += 1;

			if (!isset($databases_diff[$index]))
			{
				$databases_diff[$index] = [
					'db_name' => $database_this['db_name'],
					'tables_only_prod' => [],
					'is_diff' => false
				];
			}

			$databases_diff[$index]['tables_only_prod'] = [];

			foreach ($database_other['tables'] as $key_table => $table_other)
			{
				if (!isset($databases_this[$key_db]['tables'][$key_table]))
				{
					$databases_diff[$index]['tables_only_prod'][] = [
						'state' => 'only_in_prod_db',
						'table_name' => $table_other['table_name'],
						'nb_row' => $table_other['nb_row'],
						'nb_col' => $table_other['nb_col'],
						'cols' => self::asso_to_array($table_other['cols'])
					];

					$databases_diff[$index]['is_diff'] = true;
					// table not in other
				}
			}

			$databases_diff[$index]['nb_tables_only_prod'] = count($databases_diff[$index]['tables_only_prod']);
		}




		foreach ($databases_diff as $key_db => $database_diff)
		{
			if (!$database_diff['is_diff'])
			{
				unset($databases_diff[$key_db]);
			}
		}



		return $databases_diff;
	}


	function search_in_files($path)
	{
		foreach (glob($path.'/*') as $key => $file)
		{
			if (is_dir($file))
			{
				if (!in_array($file, $this->exclude_folder))
				{
					self::search_in_files($file);
				}
			}
			else
			{
				if(strpos(file_get_contents($file), $this->to_find) !== false)
				{
					$file_clean = explode($this->path.'/', $file)[1];
					$this->res .= $file_clean.'<br>';
					$this->nb_file += 1;
				}
			}
		}
	}

	function get_search_in_files()
	{	
		$this->nb_file = 0;
		$this->res = '';
		$this->to_find = $_POST['to_find'];
		$this->path = rtrim($this->root_path.$_POST['folder'], '/');
		$this->exclude_folder = $_POST['exclud_folders'];

		self::add_path_to_exclude();
		self::search_in_files($this->path);
		return $this->nb_file.' files:<br><br>'.$this->res;
	}

	function get_ftp_diff_dev_prod()
	{
		//return self::api_diff('api_get_files');

		return self::comparison_ftp(
			self::api_get_files(),
			self::api_diff('api_get_files')
		);
	}

	function comparison_ftp($files, $other_files)
	{
		if ($this->site_version == 'PROD')
		{
			$temp = $files;
			$files = $other_files;
			$other_files = $temp;
		}

		$res = '';
		$only_this = [];
		$only_other = [];
		$same = [];
		$diff = [];

		foreach ($files as $filename => $size)
		{
			if (array_key_exists($filename, $other_files))
			{
				if ($size == $other_files[$filename])
				{
					array_push($same, $filename);
				}
				else
				{
					array_push($diff, $filename);
				}
			}
			else
			{
				array_push($only_this, $filename);
			}
		}

		foreach ($other_files as $filename => $size)
		{
			if (!array_key_exists($filename, $files))
			{
				array_push($only_other, $filename);
			}
		}

		$space = '&nbsp;&nbsp;&nbsp;&nbsp;';

		$res .= count($same).' fichiers identiques<br><br>';
		$res .= count($only_this).' fichiers seulement en dev:<br><br>';
		
		foreach ($only_this as $key => $value)
		{
			$res .= $space.$value.'<br>';
		}

		$res .= '<br><br>';
		$res .= count($only_other).' fichiers seulement en prod:<br><br>';
		
		foreach ($only_other as $key => $value)
		{
			$res .= $space.$value.'<br>';
		}
		
		$res .= '<br><br>';
		$res .= count($diff).' fichiers au contenu différent:<br><br>';

		foreach ($diff as $key => $value)
		{
			$res .= $space.$value.'<br>';
		}

		return $res;
	}


	function api_get_files()
	{
		$this->res = [];
		$this->path = rtrim($this->root_path.$_POST['folder'], '/');
		$this->exclude_folder = $_POST['exclud_folders'];
		
		self::add_path_to_exclude();
		self::search($this->path);
		return $this->res;
	}

	function search($path)
	{
		foreach (glob($path.'/*') as $key => $file)
		{
			if (is_dir($file))
			{
				if (!in_array($file, $this->exclude_folder))
				{
					self::search($file);
				}
			}
			else
			{
				$file_clean = explode($this->path.'/', $file)[1];
				$this->res[$file_clean] = filesize($file);
			}
		}
	}

	function add_path_to_exclude()
	{
		foreach ($this->exclude_folder as $key => $value)
		{
			 $this->exclude_folder[$key] = $this->root_path.$value;
		}
	}
}

?>
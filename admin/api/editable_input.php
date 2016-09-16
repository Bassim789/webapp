 <?php
include_once 'config/admin.php';

if (action('edit'))
{
	// WHITE LIST TABLE AND COL
	$editable = [
		'var' => ['value']
	];

	if (!array_key_exists($_POST['table'], $editable))
	{
		send(['msg' => 'wrong table']);
	}

	if (!in_array($_POST['col'], $editable[$_POST['table']]))
	{
		send(['msg' => 'wrong col']);
	}

	$new_value = $_POST['new_value'];
	if ($_POST['type'] == 'price')
	{
		$new_value = floatval($new_value) * 100;
	}

	$data = [
		$_POST['col'] => $new_value
	];
	Db::update($_POST['table'], $data, 'id', $_POST['id_row']);
	send(['msg' => 'ok']);
}

?>
<?php
include_once 'config/admin.php';

if (action('get'))
{
	$admins = Db::getAll('admin', 'ORDER BY last_connexion DESC');
	foreach ($admins as $key => $admin)
	{
		unset($admins[$key]['hash']);
		$admins[$key]['name'] = email_to_pseudo($admin['email']);

		if ($admin['last_connexion'] == 0)
		{
			$admins[$key]['last_connexion'] = 'no connexion';
		}
		else
		{
			$admins[$key]['last_connexion'] = time_to_dist($admin['last_connexion']);
		}

		if ($admin['id'] == $_SESSION['admin_id'])
		{
			$my_pseudo = $admins[$key]['name'];
		}
	}

	send([
		'admins' => $admins,
		'my_pseudo' => $my_pseudo
	]);
}

else if (action('get_var'))
{
	$var = Db::getAll('var');

	send([
		'var' => $var
	]);
}

else if (action('change_password'))
{
	$state = 'error';
	$msg = 'Wrong old password';

	$admin = Db::get('admin', 'id', $_SESSION['admin_id']);

	if(password_verify($_POST["old_password"], $admin['hash']))
	{
		$msg = 'Too short new password';

		if (strlen($_POST["new_password"]) > 5)
		{
			Db::update(
				'admin',
				array('hash' => password_hash($_POST["new_password"], PASSWORD_BCRYPT, ['cost' => 12])),
				'id', $admin['id']
			);
			$state = 'success';
			$msg = 'Password changed';
		}
	}

	send([
		'state' => $state,
		'msg' => $msg
	]);
}

else if (action('add_new_admin'))
{
	$state = 'error';
	$msg = 'Email already exist';
	$email = trim($_POST['email']);

	$admin = Db::get('admin', 'email', $email);

	if (!$admin)
	{
		$password = substr(md5($email + microtime()), 0, 10);

		Db::insert('admin',
		[
			'email' => $email,
			'hash' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 12])
		]);

		$title = $_SERVER['HTTP_HOST'];
		$link = $link = $_SERVER['HTTP_HOST'].explode('/admin/api/', $_SERVER['REQUEST_URI'])[0].'/login_to_admin';
		$messageemail = "Hello, <br><br>
		
		You have been added as admin of $title <br><br>

		Here is the link to connect: <br><br>

		$link <br><br>

		And your new temporary password: <br><br>

		$password

		<br><br>";
		mail(
			$email,
			"New admin of ".$title,
			$messageemail,
			'Content-type: text/html; charset=utf-8'."\r\n".'From: "'.$title.'" <contact@'.$title.'>'
		);


		$state = 'success';
		$msg = 'admin added';
	}

	send([
		'state' => $state,
		'msg' => $msg
	]);
}


else if (action('logout'))
{
	unset($_SESSION['admin_id']);
	send([
		'state' => 'success',
		'msg' => 'logout'
	]);
}


?>
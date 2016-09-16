<?php
include_once 'config/public.php';

if (action('login'))
{
	$state = 'error';
	$msg = 'Wrong email';
	$admin_id = 'no id';

	$email = $_POST["email"];
	$password = $_POST["password"];

	if ($admin = Db::get('admin', 'email', $email))
	{
		$msg = 'Wrong password';

	    if(password_verify($password, $admin['hash']))
	    {
	    	$time = time();
	    	
	    	$sql = Db::$db->prepare
	        (
	            "UPDATE admin
	            SET last_connexion = :time,
	            	nb_connexion = nb_connexion + 1
	            WHERE id = :id"
	        );
			$sql->bindParam(':id', $admin['id']);
			$sql->bindParam(':time', $time);
			$sql->execute();

	        $state = 'success';
	        $msg = 'success';
	        $admin_id = $admin['id'];
	        $_SESSION['admin_id'] = $admin_id;
	        $_SESSION['last_activity'] = $time;
	    }
	}

	send([
		'state' => $state,
		'msg' => $msg,
		'admin_id' => $admin_id
	]);
}

else if (action('send_new_password'))
{
	$state = 'error';
	$msg = 'error';
	$email = $_POST["email"];

	if (!Db::get('admin', 'email', $email))
	{
		$msg = 'Invalid email';
	}
	else
	{
		$password = substr(md5($email + microtime()), 0, 10);

		Db::update(
			'admin',
			array('hash' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 12])),
			'email', $email
		);

		$messageemail = "Hello, <br><br>

		Here is your new temporary password: <br><br>

		$password

		<br><br>";
        mail(
        	$email,
        	"Webapp new password",
        	$messageemail,
        	'Content-type: text/html; charset=utf-8'."\r\n".'From: "Webapp" <contact@webapp.ch>'
        );
		$state = 'success';
		$msg = 'A new password has been sent';
	}

	send([
		'state' => $state,
		'msg' => $msg
	]);
}



?>

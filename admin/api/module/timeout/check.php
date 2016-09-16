<?php
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 30 * 60))
{
    unset($_SESSION['admin_id']);
}
?>
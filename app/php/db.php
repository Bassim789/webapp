<?php
require_once ROOT_PATH.'app/php/db_config.php';

class Db
{
    private static $host = DB_HOST;
    private static $db_name = DB_NAME;
    private static $user = DB_USERNAME;
    private static $pass = DB_PASSWORD;

    private static $init = FALSE;
    public static $db;

    public static function initialize()
    {
        if (self::$init === TRUE) return;
        try
        {
            self::$db = new PDO(
                'mysql:host='.self::$host.';dbname='.self::$db_name.';charset=utf8',
                self::$user,
                self::$pass
            );
            self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            self::$init = TRUE;
        }
        catch(Exception $e)
        {
            die('Error Db initialize(): '.$e->getMessage());
        }
    }

    public static function try_initialize($host, $db_name, $user, $pass)
    {
        if (self::$init === TRUE) return;
        try
        {
            self::$db = new PDO(
                'mysql:host='.$host.';dbname='.$db_name.';charset=utf8',
                $user,
                $pass
            );
            self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            self::$init = TRUE;
            return 'success';
        }
        catch(Exception $e)
        {
            return $e->getMessage();
        }
    }

    public static function query($query)
    {
        $sql = self::$db->prepare($query);
        $sql->execute();
        $rows = $sql->fetchAll(PDO::FETCH_ASSOC);
        if (count($rows) >= 1)
        {
            return $rows;
        }
        else
        {
            return false;
        }
    }

    public static function delete($table, $col_where, $where)
    {
        $sql = self::$db->prepare
        (
            "DELETE FROM $table
            WHERE $col_where = :col_where"
        );
        $sql->bindParam(':col_where', $where);
        $sql->execute();
    }

    public static function getAll($table, $where = '')
    {
        $sql = self::$db->prepare
        (
            "SELECT *
            FROM $table
            $where"
        );
        $sql->execute();
        $rows = $sql->fetchAll(PDO::FETCH_ASSOC);
        if (count($rows) >= 1)
        {
            return $rows;
        }
        else
        {
            return false;
        }
    }

    public static function get(
        $table,
        $col_where,
        $where, 
        $extra_where = '', 
        $extra_where_value = ''
    )
    {
        $sql = self::$db->prepare
        (
            "SELECT *
            FROM $table
            WHERE $col_where = :col_where
            $extra_where"
        );
        $sql->bindParam(':col_where', $where);

        if ($extra_where_value != '')
        {
            $array = explode(' ', $extra_where);
            $extra_col_where = end($array);
            $sql->bindParam($extra_col_where, $extra_where_value);
        }
        $sql->execute();
        $rows = $sql->fetchAll(PDO::FETCH_ASSOC);
        if (count($rows) == 1)
        {
            return $rows[0];
        }
        elseif (count($rows) > 1)
        {
            return $rows;
        }
        else
        {
            return false;
        }
    }

    public static function count($table, $where = '')
    {
        $sql = self::$db->prepare
        (
            "SELECT COUNT(*) AS count
            FROM $table
            $where"
        );
        $sql->execute();

        return $sql->fetch()['count'];
    }

    public static function check_if_increment($key, $value)
    {
        $value_compact = str_replace(' ', '', $value);
        return $value_compact == $key.'+1' || $value_compact == $key.'-1';
    }

    public static function update($table, $data, $col_where, $where)
    {
        $set = '';
        foreach ($data as $key => $value)
        {
            if (self::check_if_increment($key, $value))
            {
                $set .= $key.' = '.$value;
                continue;
            }

            $set .= $key.' = :'.$key.', ';
        }
        $set = trim($set, ', ');

        $sql = self::$db->prepare
        (
            "UPDATE $table
            SET $set
            WHERE $col_where = :col_where"
        );

        // & before value is necessary in this case, otherwise it repeat always the first value
        foreach ($data as $key => &$value)
        {
            if (self::check_if_increment($key, $value))
            {
                continue;
            }
            $sql->bindParam(':'.$key, $value);
        }

        $sql->bindParam(':col_where', $where);
        $sql->execute();
    }

    public static function insert($table, $data)
    {
        $cols = '';
        $values = '';
        foreach ($data as $key => $value)
        {
            $cols .= $key.', ';
            $values .= ':'.$key.', ';
        }
        $cols = trim($cols, ', ');
        $values = trim($values, ', ');

        $sql = self::$db->prepare
        (
            "INSERT INTO $table
            ($cols)
            VALUES
            ($values)"
        );

        // & before value is necessary in this case, otherwise it repeat always the first value
        foreach ($data as $key => &$value)
        {
            $sql->bindParam(':'.$key, $value);
        }

        $sql->execute();
        return self::$db->lastInsertId();
    }
}

?>
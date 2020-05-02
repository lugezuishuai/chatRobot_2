<?php
    header('content-type: text/html; charset="utf-8"');

    ////1.读取json文件
    // $json_string = file_get_contents('data.json');

    // $data = json_decode($json_string, true);

    // for($i = 0; $i < count($data); $i++){
    //     echo("下标：{$i},数据：{$data[$i]}");
    // }

    //2.读取数据库
    $servername = "localhost";
    $username = "root";
    $password = "123456";
    $dbname = "robot";

    //1.创建连接
    $conn = mysql_connect($servername, $username, $password);
    //2.检测连接
    if(!$conn){
        //连接失败
        die("连接数据库失败!" . mysql_error());
        exit;
    }

    //3.设置字符集
    mysql_set_charset("utf-8");

    //4.选择数据库
    mysql_select_db("robot");

    //5.准备sql语句
    $sql = "SELECT * FROM qa";

    //6.发送sql语句
    mysql_query("set names utf8;");

    //7.检测sql语句是否发送成功
    if(!($res = mysql_query($sql))){
        die('查询失败：' . mysql_error);
    } 

    //处理结果
    //mysql_fetch_assoc():返回一个关联数组，这个记录了返回的列（字段）名称
    //它记录了字段名称和对应的值，但是没有索引序号，如果不知道确定的字段名无法进行使用
    $arr = array();
    while($row = mysql_fetch_assoc($res)){
        // var_dump($row['Q']);
        // var_dump($row['A']);
        array_push($arr, $row);
    }

    echo json_encode($arr);

    mysql_close($conn);
?>
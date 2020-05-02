<?php
    header('content-type: text/html; charset="utf-8"');

    $question = $_POST['question'];
    $answer = $_POST['answer'];

    // //1.写入json文件的方法
    // $obj = json_decode("{}");
    // $obj->Q = $question;
    // $obj->A = $answer;

    // //从文件中读取数据到PHP变量
    // $json_string = file_get_contents('data.json');
    // $data_arr = json_decode($json_string, true);

    // array_push($data_arr, $obj);
    // $json_string = json_encode($data_arr);
    // file_put_contents('data.json', $json_string);


    //2.mysql数据库操作的方法
    $servername = "localhost";
    $username = "root";
    $password = "123456";
    $dbname = "robot";
    
    // 创建连接
    $conn = mysql_connect($servername, $username, $password);
    // 检测连接
    if (!$conn) {
        //连接失败
        die("连接数据库失败！" . mysql_error());
        exit;
    }

    //设置字符集
    mysql_set_charset("utf-8");

    //选择数据库
    mysql_select_db("robot");
    
    //sql语句
    $sql = "INSERT INTO qa (Q, A)
    VALUES ('$question', '$answer')";

    mysql_query("set names utf8;");
    
    if ($res = mysql_query($sql)) {
        echo "新记录插入成功</br>";
    } else {
        die('新纪录插入失败：' . mysql_error());
    }
    
    mysql_close($conn);
?>
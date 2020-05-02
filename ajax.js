function $ajax({method = 'get', url, data, success, error}){
    var xhr = null;
    try{
        xhr = new XMLHttpRequest();
    }catch(error){
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //判断如果数据存在
    if(data){
        //将对象变成查询字符串的形式
        data = queryString(data);
    }

    //是get请求并且有数据要传输
    if(method == 'get' && data){
        url += "?" + data;
    }

    xhr.open(method, url, true);

    //是get请求的话直接使用xhr.send()发送请求就行了
    //如果是post请求的话则需要往send()方法里面传输post要提交的数据
    //还需要在send()方法之前设置请求的格式

    if(method == 'get'){
        xhr.send();
    }else {
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                /*
                    success和error是回调函数，回调函数被当成参数传入主函数，当主函数的某步操作发生之后在执行相应的回调函数
                */

                success(xhr.responseText);
                // alert('3');
            }else{
                error('Error:' + xhr.status);
            }
        }
    }
}

function queryString(obj){
    var str = '';
    for(var attr in obj){
        str += attr + '=' + obj[attr] + '&';
    }

    str = str.slice(0, -1);
    return str;
}
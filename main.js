window.onload = function(){
    //隐藏菜单
    //——————————————————————————————————————————————————————————————————————————————————————————————————————
    var span = document.querySelector('.moveQA span');
    var addNewQA = document.querySelector('.addNewQA');
    span.onclick = function hide(){
        addNewQA.style.display = 'none';
        span.textContent = '显示';

        span.onclick = function show(){
            addNewQA.style.display = '';
            span.textContent = '隐藏';
            span.onclick = hide.bind(this);
        }
    }


    //ajax的post提交
    //——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
    var question = document.getElementById('question');
    var answer = document.getElementById('answer');
    var oBtn = document.getElementById('submit');
    var addContent = addNewQA.querySelector('.chatContent');

    //回车键和鼠标点击时发送QA
    oBtn.addEventListener('click', sendNewQA, false);
    document.onkeydown = function(e){
        if(e.keyCode == 13){
            sendNewQA(e);
        }
    };

    var sendContent = document.querySelector('.imgLayout .chatContent');
    var sendMess = document.querySelector('.imgLayout input');
    var sendBtn = document.querySelector('.imgLayout button');

    //回车键和鼠标点击发送用户提出的问题
    sendBtn.addEventListener('click', askQuestion, false);
    sendMess.onfocus = function(){
        document.onkeydown = function(e){
            if(e.keyCode == 13){
                askQuestion();
            }
        };
    }

    //添加新的QA事件处理函数
    function sendNewQA(e){
        var e = window.event || e;
        preDef(e);

        $ajax({
            method: 'post',
            url: 'write.php',
            data: {
                question: question.value,
                answer: answer.value
            },
            success: function(result){
                console.log(result);
            
                addContent.appendChild(reply('1', 'msg_robot'));

                question.value = '';
                answer.value = '';
            },
            error: function(msg){
                console.log(msg);
                
                addContent.appendChild(reply('2', 'msg_robot'));

                question.value = '';
                answer.value = '';
            }
        });
    }

    //发送问题事件处理函数
    function askQuestion(){
        sendContent.appendChild(reply('3', 'msg_mine', sendMess.value));
        $ajax({
            method: 'post',
            url: 'read.php',
            data: {
                question: sendMess.value
            },
            success: function(result){
                var arr = JSON.parse(result);       //使用JSON.parse()解析json数据 => 数组
                var ques = sendMess.value;      //用户提出的问题
                // for(let i = 0; i < arr.length; i++){
                //     var Q = arr[i]['Q'];
                //     var A = arr[i]['A'];
                //     console.log(Q);
                //     console.log(A);
                // }

                setTimeout(()=>{searchQues(arr, ques, sendContent);}, 1000);

                sendMess.value = '';
            },
            error: function(msg){
                console.log(msg);
            }
        })
    }
}

//筛选函数
function searchQues(arr, ques, sendContent){
    if(ques == ''){
        sendContent.appendChild(reply('4', 'msg_robot'));
    }else{
        ques = ques.trim();     //删除前后的空格
        
        //设置正则表达式过滤掉各种符号和空格
        var reg = /[\ |\s*(.*?)\s+$|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\，|\。|\“|\”|\‘|\’|\¥|\？|\（|\）|\；|\：|\、|\！|\<|\.|\>|\/|\?]/g;
        ques = ques.replace(reg, '').split('');

        //用于存放用户提问的问题和数据库里存在的问题之间的共同关键字数
        var SameLength = new Array(); 

        for(let i = 0; i < arr.length; i++){
            var Q = arr[i]['Q'].split('');
            SameLength.push(intersection(Q, ques).length);
        }

        var maxSameLength = Math.max(...SameLength);
        if(maxSameLength !== 0){
            var indexOfMax = SameLength.indexOf(maxSameLength);     //取出最高匹配度的QA所在的索引

            var bestAnswer = arr[indexOfMax]['A'];      //取出最匹配的回答
            sendContent.appendChild(reply('5', 'msg_robot', bestAnswer));
        }else{
            sendContent.appendChild(reply('6', 'msg_robot'));
        }
    }
}

//给出答复，新增一个节点提示增加QA成功与否
function reply(label, className, content){
    var div = document.createElement('div');
    div.setAttribute('class', className);
    var img = document.createElement('img');
    img.src = 'robot.jpg';
    var span = document.createElement('span');
    var p = document.createElement('p');

    switch(label){
        case '1':
            p.textContent = `您新添加的QA已经保存成功，其中问题是:${question.value},回答是:${answer.value}。`;
            span.textContent = 'robot';
            img.alt = 'robot';
            break;
        case '2':
            p.textContent = `您新添加的QA保存失败！`;
            span.textContent = 'robot';
            img.alt = 'robot';
            break;
        case '3':
            p.textContent = content;
            span.textContent = 'myself';
            img.alt = 'myself';
            break;
        case '4':
            p.textContent = '亲！您想问什么呢？我听不清。';
            span.textContent = 'robot';
            img.alt = 'robot';
            break;
        case '5':
            p.textContent = content;
            span.textContent = 'robot';
            img.alt = 'robot';
            break;
        default:
            p.textContent = '对不起亲，你现在问的问题我暂时还不会呢，如果您知道的话你可以告诉我吗？';
            span.textContent = 'robot';
            img.alt = 'robot';
            break;       
    }

    div.appendChild(img);
    div.appendChild(span);
    div.appendChild(p);

    return div;
}

//跨浏览器阻止超链接默认行为的函数
function preDef(e){
    if(e.preventDefault){
        e.preventDefault();
    }else{
        window.event.returnValue = false;       //IE浏览器阻止默认行为
    }
}

//返回两个数组的交集
function intersection(nums1, nums2) {
    return [...new Set(nums1.filter((item)=>nums2.includes(item)))];
}

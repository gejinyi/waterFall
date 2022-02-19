function ajax(options) {
    // var xhr = new XMLHttpRequest();
    var xhr = null;
    var url = options.url;
    var data = options.data;
    var dataStr = "";
    var success = options.success || function () {};
    var isAsync = options.isAsync;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        return alert('当前浏览器不支持的XMLHTTPRequest')
    }
    // xhr.withCredentials = true;
    // 判断传递过来的数据是否是对象类型的  如果是对象类型的转换成字符串  key=value&key1=value1
    if (typeof data === 'object') {
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                dataStr += prop + '=' + data[prop] + '&';
            }
        }
    } else {
        dataStr = data.toString();
    }

    // 监听readyState属性的变化   readyState属性是用来记录当前数据交互的过程状态的
    // readyState的值 0 - 4   
    // 0 代表还没有进行数据交互  还没有xhr对象
    // 1 代表还没有建立连接(open方法还没有执行) 
    //  2 代表连接已经建立了 （open方法已经执行）
    // 3 代表数据传递完成  （send方法执行完成）
    //  4代表对方已经给了响应 
    //
    xhr.onreadystatechange = function () {
        // console.log(xhr.readyState)
        if (xhr.readyState === 4) {
            // xhr.status
            if (xhr.status === 200) {
              //200~300 收到的数据是正常处理了的
                success(JSON.parse(xhr.responseText))
            }
        }
    }
    // 将请求方式全部转换成大写
    var method = options.method.toUpperCase();
    // 判断请求方式为get类型   GET类型的特点：数据拼接在地址当中
    if(method === 'GET') {
        // 建立连接
        xhr.open(method, url + '?' + dataStr, isAsync);
        // 发送数据
        xhr.send();
    } else {
        // 请求方式为非get请求的   那么需要单独传递请求参数（数据） 就需要告诉对方你的数据编码方式（通过请求头设置） 
        xhr.open(method, url, isAsync);
        // key=value&key1=value1&key2=value2.....   ContentType 代表的是编码方式  
        //     "{key: value, key1: value1}"             application/json
      //设置请求头
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(dataStr);
    }
  
}

function init () {
    ajax({
        isAsync:true,
        method:'GET',
        url:'./data.json',
        data:'',
        success:function (resp) {
            renderDom (resp)
        }
    
    
    })
}
let MinHeight = 0;
function renderDom (resp) {
    let cols = document.getElementsByClassName('col');
    let imgWidh = cols[0].offsetWidth - 40;
    let minHeight = cols[0].offsetHeight;
    let minCol = 0;
    function createDom (data) {   
        let item = document.createElement('div');
        item.className = 'item';
        let img = new Image();
        img.src = data.img;
        dataHeight = data.height * imgWidh / data.width;
       img.height = dataHeight;
        let p = document.createElement('p');
        p.innerText = data.desc;
        item.appendChild(img);
        item.appendChild(p);
        return item
    }

    function getMinHeight () {
        let cols = document.getElementsByClassName('col');

           
        for(let i = 0; i < cols.length; i++){
            console.log(cols[i].offsetHeight) 
            if (cols[i].offsetHeight < minHeight){
                minHeight = cols[i].offsetHeight;
                console.log('赋值了')
                minCol = i;
            
            }


        }
        return{
            minCol,
            minHeight
        }
    }
   resp.forEach((data,index) => {
       let dom = createDom(data);
        let result = getMinHeight ();
        cols[result.minCol].appendChild(dom);
        MinHeight = minHeight = cols[minCol].offsetHeight;

     
    })

   
}

init()
let timer = null;
window.onscroll = function () {
    var scrollYOffset = window.pageYOffset;
    var innerHeight = window.innerHeight;
    clearTimeout(timer);
    // 判断页面当中是否出现空白  如果出现空白则获取下一组数据
    if (scrollYOffset + innerHeight > MinHeight) {
        // 防抖处理
        timer = setTimeout(function () {
            init();
        }, 500);
    }
}
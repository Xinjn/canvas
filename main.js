//获取canvas节点
let canvas = document.getElementById("canvas")
//尺寸自适应屏幕
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
//设置点类型
let ctx = canvas.getContext("2d")
//设置线样式
ctx.strokeStyle = "black"
//记录上次画笔
let lastsStrokeStyle
//设置线宽度
ctx.lineWidth = 5
//设置圆角接口
ctx.lineCap = "round"

//声明开启/关闭
let painting = false

//位置数据列表
let historyDeta = [];
//保存数据
function saveData(data) {
    (historyDeta.length === 10) && (historyDeta.shift()); // 上限为储存10步，太多了怕挂掉
    historyDeta.push(data);
}

//记录上次位置数据
let last
//声明画线函数
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

// 获取是否触摸
let isTouchDevice = "ontouchstart" in document.documentElement

//绘制一个填充了内容的圆形
if (isTouchDevice) {    //移动端
    canvas.ontouchstart = (e) => {
        last = [e.touches[0].clientX, e.touches[0].clientY]
        painting = true
    }
    canvas.ontouchmove = (e) => {

        if (painting === true) {
            drawLine(last[0], last[1], e.touches[0].clientX, e.touches[0].clientY)
            last = [e.touches[0].clientX, e.touches[0].clientY]
        } else {
            // console.log("停止")
        }
    }
} else {   //PC端
    canvas.onmousedown = (e) => {
        painting = true
        last = [e.clientX, e.clientY]

        // 在这里储存绘图表面
        let firstDot
        firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        saveData(firstDot);


    }
    canvas.onmousemove = (e) => {
        if (painting === true) {
            // console.log(last);
            drawLine(last[0], last[1], e.clientX, e.clientY)

            last = [e.clientX, e.clientY]
        } else {
            // console.log("停止")

        }
    }
    canvas.onmouseup = () => {
        painting = false
    }
}

// let whiteBut = document.getElementById("white")
// whiteBut.addEventListener('click', () => {
//     //设置线样式
//     ctx.strokeStyle = "white"
// })
// let blackBut = document.getElementById("black")
// blackBut.addEventListener('click', () => {
//     //设置线样式
//     ctx.strokeStyle = "black"
// })
// let redBut = document.getElementById("red")
// redBut.addEventListener('click', () => {
//     //设置线样式
//     ctx.strokeStyle = "red"
// })


//事不过三
let wrapperBut = document.getElementById("wrapper")
wrapperBut.addEventListener('click', (e) => {
    console.log(e.target.tagName);
    if (e.target.type === 'submit') {

        ctx.strokeStyle = e.target.id
        lastsStrokeStyle = e.target.id

    } else if (e.target.tagName === 'BUTTON' || e.target.tagName === 'svg' || e.target.tagName === 'use') {
       
        switch (e.target.id) {
            case '画笔':
                console.log('选择画笔');
                ctx.strokeStyle = lastsStrokeStyle
                break;
            case '橡皮':
                console.log('选择橡皮');
                ctx.strokeStyle = 'white'

                break;
            case '清除':
                console.log('选择清除');
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
                break;
            case '撤回':
                console.log('选择撤回');
                if (historyDeta.length < 1) return false;
                ctx.putImageData(historyDeta[historyDeta.length - 1], 0, 0);
                historyDeta.pop()
                break;
            case '保存':
                console.log('选择保存');
                let imgUrl = canvas.toDataURL("image/png");
                let saveA = document.createElement("a");
                document.body.appendChild(saveA);
                saveA.href = imgUrl;
                saveA.download = "zspic" + (new Date).getTime();
                saveA.target = "_blank";
                saveA.click();
                break;
            default:
                break;
        }
    } else {
        ctx.lineWidth = e.target.value //8
    }

})


let menuLength = 0;
let randomNum;
let sum = 0;
let cnt = 0;
let rate = [1.08, 1.1];
let menuName = [];
let menuPrice = [];
let resultName = [];
let resultPrice = [];

// JSONファイルを読み込む
fetch('menu.json')
    .then(response => response.json())
    .then(data => {
        const menuItems = data.menu;
        menuItems.forEach(item => {
            menuName.push(item.name);
            menuPrice.push(item.price);
            menuLength++;
        });
    })
    .catch(error => console.error('Error loading menu:', error));

let btn_in = document.getElementById("eatin");
btn_in.addEventListener('click',function(){
    Gacha(1);
},false);

let btn_out = document.getElementById("takeout");
btn_out.addEventListener('click',function(){
    Gacha(0);
},false);


function Gacha(i) {
    sum = 0;
    cnt = 0;

    let limit = parseInt(document.getElementById("budget").value, 10);
    // clear results
    document.getElementById("result").innerHTML = "";

    while (sum <= limit / rate[i] - 20) {
        randomNum = Math.floor(Math.random() * menuLength);
        sum = sum + menuPrice[randomNum];
        if (sum <= limit / rate[i]) {
            resultName[cnt] = menuName[randomNum];
            resultPrice[cnt] = menuPrice[randomNum];
            cnt++;
        } else {
            sum = sum - menuPrice[randomNum];
        }
    }

    for(let j = 0; j < cnt; ++j){
        PrintResults(j);
    }

    document.getElementById("result").innerHTML += "<p>合計:" + sum + "円(税込:" + Math.floor(sum * rate[i]) + "円)</p>";
    document.getElementById("send").innerHTML = '<input type="button" id="toX" value="結果をXに投稿する">';

    let btn_send = document.getElementById("toX");
    btn_send.addEventListener('click',function(){
        window.open("http://twitter.com", "blank", "width=600, height=300");
    })
}

function PrintResults(cnt) {
    document.getElementById("result").innerHTML += "<p>" + resultName[cnt] + ":" + resultPrice[cnt] + "円</p>";
}
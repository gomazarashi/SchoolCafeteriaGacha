let menuLength = 0;
const taxRates = {
    eatIn: 1.1,
    takeOut: 1.08
};
let menuName = [];
let menuPrice = [];
let results = []; // ガチャ結果を保持するためのオブジェクトの配列

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

// イートインボタン
let btn_in = document.getElementById("eatin");
btn_in.addEventListener('click', function () {
    Gacha(taxRates.eatIn);
}, false);

// テイクアウトボタン
let btn_out = document.getElementById("takeout");
btn_out.addEventListener('click', function () {
    Gacha(taxRates.takeOut);
}, false);

function Gacha(taxRate) {
    let randomNum = 0;
    let totalPrice = 0;
    results = []; // 結果の配列を初期化

    let limit = parseInt(document.getElementById("budget").value, 10);
    // clear results
    document.getElementById("result").innerHTML = "";

    while (totalPrice <= limit / taxRate - 20) {
        randomNum = Math.floor(Math.random() * menuLength);
        totalPrice += menuPrice[randomNum];
        if (totalPrice <= limit / taxRate) {
            results.push({
                name: menuName[randomNum],
                price: menuPrice[randomNum]
            });
            PrintResults();
        } else {
            totalPrice -= menuPrice[randomNum];
        }
    }
    document.getElementById("result").innerHTML += "<p>合計:" + totalPrice + "円(税込:" + Math.floor(totalPrice * taxRate) + "円)</p>";
    document.getElementById("send").innerHTML = '<input type="button" id="toX" value="結果を&#x1D54Fに投稿する">';

    let postText = GenerateTweetText(limit, totalPrice, taxRate);

    let btn_send = document.getElementById("toX");
    btn_send.addEventListener('click', function () {
        window.open('http://twitter.com/intent/tweet?&text=' + postText, "blank", "width=600, height=300");
    });
}

function PrintResults() {
    const lastResult = results[results.length - 1]; // 最新の結果を取得
    document.getElementById("result").innerHTML += "<p>" + lastResult.name + ":" + lastResult.price + "円</p>";
}

function GenerateTweetText(limit, totalPrice, taxRate) {
    let baseText = "学食ガチャを予算" + limit + "円で回した結果・・・\n\n";
    let resultText = "";

    // 140文字以内に収めるため、結果を短縮
    for (let j = 0; j < results.length; j++) {
        const itemText = results[j].name + ":" + results[j].price + "円\n";
        if ((baseText + resultText + itemText).length > 110) { // URLなども含めて文字数を考慮
            resultText += "他" + (results.length - j) + "品…\n";　// 制限文字数を超えた部分は略記
            break;
        }
        resultText += itemText;
    }

    baseText += resultText;
    baseText += "\n合計" + totalPrice + "(税込:" + Math.floor(totalPrice * taxRate) + ")円でした!\n";
    baseText += "↓ガチャを回す↓\nhttps://tdtiger.github.io/SchoolCafeteriaGacha/";

    return encodeURIComponent(baseText);
}

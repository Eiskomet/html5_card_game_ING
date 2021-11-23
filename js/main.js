

function createCrad(data) {
    let card=new Monster(data);

    return card;
}


//画面渲染
function render() {

    //我方卡牌渲染
    for (let i = 0; i < room_size; i++) {
        let cs = document.getElementById("fd-cs" + (i + 1));
        //清空卡槽
        cs.innerHTML = "";
        if (friendlys[i] == undefined) continue;
        //卡牌置入卡槽
        cs.appendChild(friendlys[i].cardModel());

    }

    //敌方卡牌渲染
    for (let i = 0; i < room_size; i++) {
        let cs = document.getElementById("en-cs" + (i + 1));
        //清空卡槽
        cs.innerHTML = "";
        if (enemys[i] == undefined) continue;
        //卡牌置入卡槽
        cs.appendChild(enemys[i].cardModel());
    }


    //渲染手牌
    let hand_tab = document.getElementById("hand");
    hand_tab.innerHTML = "";
    //console.log( player.hands);
    //console.log( player.deck);

    for (let i = 0; i < player.hands.length; i++) {
        let card = player.hands[i].cardModel();
        card.draggable = true;
        card.id = "hand-card" + String(i);
        card.ondragstart = drag;
        hand_tab.appendChild(card);

    }


    //渲染角色生命
    let en_hp = document.getElementById("en-hp");
    en_hp.innerHTML = "<p>" + npc.hp + "</p>";

    let fd_hp = document.getElementById("fd-hp");
    fd_hp.innerHTML = "<p>" + player.hp + "</p>";

    //渲染费用
    let coin = document.getElementById("p-coin");
    coin.innerHTML = "";

    let num_coin = document.createElement("span");
    num_coin.className = "num"
    num_coin.innerHTML = "(" + player.coin + "/" + player.limit_coin + ")";
    coin.appendChild(num_coin);

    let coin_bar = document.createElement("span");
    coin_bar.className = "bar";
    for (let i = 0; i < player.coin; i++) {
        coin_bar.innerHTML += "&nbsp;";
    }
    coin.appendChild(coin_bar);

    //渲染牌库
    let deck=document.getElementById("p-deck");
    deck.innerHTML="";
    let num_deck=document.createElement("span");
    num_deck.innerHTML="牌库："+player.deck.length;
    deck.appendChild(num_deck);

}



//结算卡牌状态和角色状态
function settlement() {
    if (player.hp <= 0) {
        window.alert("you die!")
    }
    if (npc.hp <= 0) {
        window.alert("you win!")

    }
    for (let i = 0; i < room_size; i++) {

        if (friendlys[i] != undefined && friendlys[i].hp <= 0) {
            friendlys[i].is_die = true;
        }
        if (enemys[i] != undefined && enemys[i].hp <= 0) {
            enemys[i].is_die = true
        }

    }
    for (let i = 0; i < room_size; i++) {
        if (friendlys[i] != undefined && friendlys[i].is_die) {
            //死亡效果结算
            friendlys[i].deathEffect();
            friendlys[i] = undefined;
        }
        if (enemys[i] != undefined && enemys[i].is_die) {
            //死亡效果结算
            enemys[i].deathEffect();
            enemys[i] = undefined;
        }
    }

    render();
}

//友方攻击
function friendlyAttack() {
    //console.log("atk");
    for (let i = 0; i < room_size; i++) {
        if (friendlys[i] != undefined) {
            friendlys[i].attack();
            if (enemys[i] != undefined) {
                enemys[i].hp -= friendlys[i].atk;
            }
            else {
                npc.hp -= friendlys[i].atk;
            }
        }
    }
    settlement();
    document.getElementById("b-atk").disabled = true;
}

//敌方攻击
function enemyAttack() {

    for (let i = 0; i < room_size; i++) {
        if (enemys[i] != undefined) {
            enemys[i].attack();

            if (friendlys[i] != undefined) {
                friendlys[i].hp -= enemys[i].atk;
            }
            else {
                player.hp -= enemys[i].atk;
            }
        }

    }

    settlement();
}


//敌方行为
function  enemyAction(){
    let r=Math.floor(Math.random() * room_size);
    for(let i=0;i<room_size&&enemys[r]!=undefined;i++){
        r=(r+1)%room_size;
    }
    enemys[r]=createCrad(card_data["Dog"]);
    enemyAttack();
}

//下一回合
function nextRound() {

    enemyAction();

    document.getElementById("b-atk").disabled = false;
    player.growth();

    player.drawCard();
    render();

}

//使用卡片
function useCard(e) {
    e.preventDefault();
    let cs_id = e.target.id;
    console.log("text__cs_id:" + cs_id);

    cs_id = cs_id.replace(/[^0-9]/ig, "");
    console.log("cs_id:" + cs_id);
    // console.log(friendlys[cs_id]);
    // console.log(friendlys);

    if (cs_id == "") return;
    cs_id--;
    if (friendlys[cs_id] != undefined) return;

    let card_id = e.dataTransfer.getData("Text");
    card_id = card_id.replace(/[^0-9]/ig, "");
    console.log("card_id:" + card_id);

    if (player.coin < player.hands[card_id].cost) return;
    player.coin -= player.hands[card_id].cost;
    friendlys[cs_id] = player.hands[card_id];
    player.hands.splice(card_id, 1);
    render();
}



function allowDrop(e) {
    // 阻止浏览器默认行为
    e.preventDefault()
}

function drag(e) {
    e.dataTransfer.setData("Text", e.target.id);

}


//初始化部分
var room_size = 6;
var friendlys = new Array(room_size);
var enemys = new Array(room_size);
var player = new Player();
var npc = new Player();
var data=new Object();




//测试


console.log(card_data["Dog"]);
friendlys[0] = createCrad(card_data["Dog"]);
friendlys[1] = (createCrad(card_data["Dog"]));

friendlys[2] = (createCrad(card_data["Dog"]));
enemys[0] = (createCrad(card_data["Dog"]));
enemys[2] = (createCrad(card_data["Dog"]));
enemys[0].hp = 4;
player.hands.push(createCrad(card_data["Dog"]));
player.hands.push(createCrad(card_data["Dog"]));
player.hands.push(createCrad(card_data["Dog"]));
player.hands.push(createCrad(card_data["DogKnights"]));
player.deck.push(createCrad(card_data["DogFrog"]));
player.deck.push(createCrad(card_data["Dog"]));
player.deck.push(createCrad(card_data["Dog"]));
player.deck.push(createCrad(card_data["JumpDog"]));


render();
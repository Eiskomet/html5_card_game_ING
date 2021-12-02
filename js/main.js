

function createCrad(data) {
    let card = new Monster(data);

    return card;
}




//单步渲染
function SingleStepRender(i) {
    //确认位置
    if (friendlys[i] != undefined) {
        friendlys[i].place = i;
    }
    if (enemys[i] != undefined) {
        enemys[i].place = room_size + i;
    }
    let cs = document.getElementById("fd-cs" + (i + 1));
    cs.innerHTML = "";
    if (friendlys[i] != undefined) {

        cs.appendChild(friendlys[i].cardModel());
    }
    cs = document.getElementById("en-cs" + (i + 1));
    cs.innerHTML = "";
    if (enemys[i] != undefined) {

        cs.appendChild(enemys[i].cardModel());
    }

    //渲染手牌
    let hand_tab = document.getElementById("hand");
    hand_tab.innerHTML = "";
    for (let i = 0; i < player.hands.length; i++) {
        let card = player.hands[i].cardModel();
        card.draggable = can_use_card;
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
    let deck = document.getElementById("p-deck");
    deck.innerHTML = "";
    let num_deck = document.createElement("span");
    num_deck.innerHTML = "牌库：" + player.deck.length;
    deck.appendChild(num_deck);

}

//画面渲染
function Render() {

    //确认怪兽位置
    for (let i = 0; i < room_size; i++) {
        if (friendlys[i] != undefined) {
            friendlys[i].place = i;
        }
        if (enemys[i] != undefined) {
            enemys[i].place = room_size + i;
        }
    }


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
        card.draggable = can_use_card;
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
    let deck = document.getElementById("p-deck");
    deck.innerHTML = "";
    let num_deck = document.createElement("span");
    num_deck.innerHTML = "牌库：" + player.deck.length;
    deck.appendChild(num_deck);

}

function IsGameOver() {
    if (player.hp <= 0) {
        window.alert("you die!")
        return true;
    }
    if (npc.hp <= 0) {
        window.alert("you win!")
        return true;
    }
    return false;
}

//单步结算
function SingleStepSettlement(i) {
    console.log(i);
    IsGameOver()

    evevts.checkEvent();

    if (friendlys[i] != undefined && friendlys[i].hp <= 0) {
        friendlys[i].is_die = true;
    }
    if (enemys[i] != undefined && enemys[i].hp <= 0) {
        enemys[i].is_die = true
    }
    if (friendlys[i] != undefined && friendlys[i].is_die) {
        //死亡效果结算
        friendlys[i].deathEffect(player, friendlys, npc, enemys);
        friendlys[i] = undefined;
    }
    if (enemys[i] != undefined && enemys[i].is_die) {
        //死亡效果结算
        enemys[i].deathEffect(npc, enemys, player, friendlys);
        enemys[i] = undefined;
    }
    SingleStepRender(i);
}

//结算卡牌状态和角色状态
function Settlement() {
    IsGameOver();

    for (let i = 0; i < room_size; i++) {
        SingleStepSettlement(i);
    }
    for (let i = 0; i < room_size; i++) {
        SingleStepSettlement(i);
    }
    Render();
}


function _Attack(x, attacker_character, attackers, target_character, targets) {
    console.log(x);
    if (x >= room_size) {

        if (attackers[x - 1] != undefined) {
            attackers[x - 1].attack(attacker_character, attackers, target_character, targets);
        }
        if (attacker_character.is_player) {
            document.getElementById("n-round").disabled = false;
            can_use_card=true;

        }
        SingleStepSettlement(x - 1);
        return;
    }
    if (attackers[x] == undefined||attackers[x].is_unatk) {

       
        if (attackers[x - 1] != undefined) {
            setTimeout(() => {
                _Attack(x + 1, attacker_character, attackers, target_character, targets);
            }, 500);
            attackers[x - 1].attack(attacker_character, attackers, target_character, targets);
            SingleStepSettlement(x - 1);
        }
        else{
            _Attack(x + 1, attacker_character, attackers, target_character, targets);
        }
        
    }
    else {
        let id = (attackers[x].place < room_size ? "fd" : "en") + "-cs" + (attackers[x].place % room_size + 1);
        let card_tag = document.getElementById(id);
   
        card_tag.children[0].style = "animation-play-state: running;";
        console.log(card_tag.children[0]);

        card_tag.children[0].addEventListener("animationend",
            _Attack.bind(this, x + 1, attacker_character, attackers, target_character, targets));
        
        if (x != 0) {

            if (attackers[x - 1] != undefined) {
                attackers[x - 1].attack(attacker_character, attackers, target_character, targets);
            }
            SingleStepSettlement(x - 1);

        }
    }
}

//攻击
function Attack(attacker_character, attackers, target_character, targets) {
    
    console.log("atk");
    attacker_character.is_attack = true;
    if (attacker_character.is_player) {
        document.getElementById("n-round").disabled = true;
        document.getElementById("b-atk").disabled = true;
        can_use_card=false;

    }
    Render();
    _Attack(0, attacker_character, attackers, target_character, targets);
}



//敌方行为
function EnemyAction() {
 
    let r = Math.floor(Math.random() * room_size);
    for (let i = 0; i < room_size && enemys[r] != undefined; i++) {
        r = (r + 1) % room_size;
    }
    if (enemys[r] == undefined) {
        
        enemys[r] = createCrad(card_data["Dog"]);
        enemys[r].hp += round_number;
        enemys[r].atk += Math.floor(round_number / 2);
        enemys[r].cost = round_number;
        enemys[r].place = r;
    }
    Render();
    //Attack(npc, enemys, player, friendlys);
    setTimeout(()=>{NextRound(npc, enemys, player, friendlys)},100);

}

//回合开始
function RoundStart(fd_character, fds, en_character, ens) {
    console.log(fd_character);
    fd_character.is_attack = false;
    for (let i = 0; i < room_size; i++) {
        if (fds[i] != undefined) {
            fds[i].roundStartEffect(fd_character, fds, en_character, ens);
        }
    }
    fd_character.drawCard();
    fd_character.growth();
    
    if (fd_character.is_player) {
        round_number++;
        document.getElementById("b-atk").disabled = false;
        document.getElementById("n-round").disabled = false;
        can_use_card=true;
        Render()
    }
    else {
        EnemyAction();
    }


}

//回合结束
function RoundEnd(fd_character, fds, en_character, ens) {
    for (let i = 0; i < room_size; i++) {
        if (fds[i] != undefined) {
            fds[i].roundEndEffect(fd_character, fds, en_character, ens);
        }
    }
    if (fd_character.is_player) {
        document.getElementById("n-round").disabled = true;
        document.getElementById("b-atk").disabled = true;

       can_use_card=false;
       
    }
    Render();
}


//下一回合
function NextRound(fd_character, fds, en_character, ens) {

   console.log( fd_character);
    RoundEnd(fd_character, fds, en_character, ens);
    RoundStart(en_character, ens, fd_character, fds);
}

//使用卡片
function UseCard(e) {
    e.preventDefault();
    let cs_id = e.target.id;
    //console.log("text__cs_id:" + cs_id);

    cs_id = cs_id.replace(/[^0-9]/ig, "");
    //console.log("cs_id:" + cs_id);
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

    friendlys[cs_id].useEffect(player, friendlys, npc, enemys);
    player.hands.splice(card_id, 1);
    Render();
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
var evevts=new EventList();
var player = new Player();
var npc = new Character();
var round_number = 1;
var can_use_card;






//测试

friendlys[0] = createCrad(card_data["Test"]);
friendlys[1] = (createCrad(card_data["Dog"]));
console.log(friendlys[0]);
friendlys[2] = (createCrad(card_data["Dog"]));
enemys[0] = (createCrad(card_data["Dog"]));
enemys[2] = (createCrad(card_data["Dog"]));
enemys[0].hp = 4;

player.hands.push(createCrad(card_data["Test"]));
player.hands.push(createCrad(card_data["CruelDog"]));
player.hands.push(createCrad(card_data["Dog"]));
player.hands.push(createCrad(card_data["DogKnights"]));
for(let id in card_data){
    player.deck.push(createCrad(card_data[id]));
}




RoundStart(player,friendlys,npc,enemys);
             


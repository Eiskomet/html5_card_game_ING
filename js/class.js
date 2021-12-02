
class Card {
    name;           //卡牌名
    img_path;       //图片路径
    cost;           //费用
    text;           //文本
    type;           //卡牌类型
    rarity;         //稀有度
    particular;     //详细介绍
    place;          //卡牌位置，-1为手牌，
    //[0,room_size)为玩家卡槽
    //[room_size,2*room_size)为敌人卡槽
    constructor(name, img_path, cost, text, type, rarity, particular) {

        this.name = name || "";
        this.img_path = img_path || "img/NULL.png";
        this.cost = cost == undefined ? 0 : parseInt(cost);
        this.text = text || "";
        this.type = type || "card";
        this.rarity = rarity || "普通";
        this.particular = particular || "";
    }

    cardModel() {
        let card = document.createElement("div");
        card.className = "card";


        switch (this.rarity) {
            case "稀有":
                card.className += " rare";
                break;
            case "史诗":
                card.className += " epic";
                break;
            case "传说":
                card.className += " tale";
                break;
        }
        if (this.cost != undefined && this.cost != 0) {
            let cost = document.createElement("p");
            cost.className = "cost";
            cost.innerHTML = this.cost;
            card.appendChild(cost);
        }

        let img = document.createElement("img");
        img.className = "card-img";
        img.src = this.img_path;
        img.draggable = false;
        card.appendChild(img)

        let name = document.createElement("p");
        name.className = "name";
        name.innerText = this.name;
        card.appendChild(name);


        let text = document.createElement("p");
        text.className = "text";
        text.innerHTML = this.text || "";
        card.appendChild(text);


        let particular = document.createElement("div");
        particular.className = "particular";
        particular.innerHTML = this.particular;
        if (particular.innerHTML == "") {
            particular.style = "display:none;"
        }
        card.appendChild(particular);

        return card;
    }
}

class Monster extends Card {

    def_atk;        //原攻击力
    def_hp;         //原血量


    atk;            //当前攻击力
    limit_hp;       //血量上限
    hp;             //当前血量


    is_die;         //是否死亡
    is_leap_atk;    //是否飞跃攻击
    is_guard;       //是否守护
    is_unatk;       //是否无法攻击
    is_stealth;     //是否潜行

    useEffect;          //卡牌使用效果
    atkEffect;          //攻击效果
    roundEndEffect;     //回合结束效果
    roundStartEffect;   //回合开始效果
    deathEffect;        //死亡效果




    constructor(data) {

        super(data.name, data.img_path, data.cost, data.text,
            data.type || "monster", data.rarity, data.particular);
        this.def_atk = data.def_atk == undefined ? 0 : parseInt(data.def_atk);
        this.def_hp = data.def_hp == undefined ? 1 : parseInt(data.def_hp);


        this.is_leap_atk = data.is_leap_atk == undefined ? false : data.is_leap_atk;
        this.is_guard = data.is_guard == undefined ? false : data.is_guard;
        this.is_unatk = data.is_unatk == undefined ? false : data.is_unatk;
        this.is_stealth = data.is_stealth == undefined ? false : data.is_stealth;


        this.useEffect = data.useEffect == undefined ? function () { } : data.useEffect;
        this.atkEffect = data.atkEffect == undefined ? function () { } : data.atkEffect;
        this.roundEndEffect = data.roundEndEffect == undefined ? function () { } : data.roundEndEffect;
        this.roundStartEffect = data.roundStartEffect == undefined ? function () { } : data.roundStartEffect;
        this.deathEffect = data.deathEffect == undefined ? function () { } : data.deathEffect;

        this.atk = this.def_atk;
        this.limit_hp = this.def_hp;
        this.hp = this.limit_hp;
        this.place = -1;
    }



    //创建卡牌标签
    cardModel() {
        let _super = new Card(this.name, this.img_path, this.cost, this.text,
            this.type, this.rarity, this.particular);
        let card = _super.cardModel();

        let atk = document.createElement("span");
        atk.className = "atk";
        atk.innerHTML = this.atk;
        card.appendChild(atk);



        let hp = document.createElement("span");
        hp.className = "hp";
        hp.innerHTML = this.hp;
        card.appendChild(hp);

        let text = card.getElementsByClassName("text")[0];
        let able_tag = "";
        if (this.is_leap_atk) {
            able_tag += "<span class=\"able_tag\">飞跃</span>";
        }
        if (this.is_guard) {
            able_tag += "<span class=\"able_tag\">守护</span>";

        }
        if (this.is_unatk) {
            able_tag += "<span class=\"able_tag\">无法攻击</span>";

        }
        if (this.is_stealth) {
            able_tag += "<span class=\"able_tag\">潜行</span>";
        }
        text.innerHTML = able_tag + "<p>" + text.innerHTML + "</p>";



        return card;
    }

    attack(attacker_character, attackers, target_character, targets, pos) {
        if (this.is_unatk) return;

        this.atkEffect(attacker_character, attackers, target_character, targets);






        //默认攻击正对面
        if (pos == undefined) {
            pos = this.place % room_size;
        }
        let target = targets[pos];
        //console.log(pos+":"+target);
        if (target == undefined ||
            target.is_die ||
            (this.is_leap_atk && !target.is_guard) ||
            target.is_stealth) {
            target_character.hp -= this.atk;
        }
        else {
            target.hp -= this.atk;
        }
    }


}



class Character {
    limit_hp;
    hp;
    max_coin;
    limit_coin;
    coin;

    library;
    deck;
    hands;

    //本回合是否攻击过
    is_attack;
    constructor(limit_hp, coin, max_coin) {
        this.limit_hp = limit_hp || 20;
        this.hp = this.limit_hp;
        this.limit_coin = coin || 0;
        this.coin = this.limit_coin;
        this.max_coin = max_coin || 7;
        this.deck = new Array();
        this.hands = new Array();
        this.library = new Array();
        this.is_attack = false;
    }

    growth() {
        if (player.limit_coin < this.max_coin) {
            player.limit_coin++;
        }
        player.coin = player.limit_coin;
    }


    //抽卡
    drawCard() {
        if (this.deck.length == 0) return;
        let x = Math.floor(Math.random() * this.deck.length);
        this.hands.push(this.deck[x]);
        this.deck.splice(x, 1);

    }

    //填充牌库
    fillDeck() {
        this.deck.length = 0;
        for (let i = 0; i < this.library.length; i++) {
            this.deck.push({ ...this.library[i] });
        }
    }
}


class Player extends Character {
    is_player = true;

    money;
    constructor(limit_hp, coin, max_coin) {
        super(limit_hp, coin, max_coin)
        this.money = 0;
    }


}



class GameEvent {

    //事件生命周期
    isdie() {

    }

    //事件开始效果
    startEffect() {

    }

    //事件结束效果
    endEffect() {

    }
    constructor(isdie, startEffect, endEffect) {
        this.isdie = isdie || function () { return true; };
        this.startEffect = startEffect || function () { };
        this.endEffect = endEffect || function () { };

    }

}



class EventList {
    events;

    constructor() {
        this.events = new Array();
    }

    checkEvent() {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].isdie()) {
                this.killEvent(this.events[i]);
                this.events.splice(i, 1);
                i--;
            }
        }
    }

    addEvent(event) {
        event.startEffect();
        this.events.push(event);
    }

    killEvent(event) {
        event.endEffect();
    }

}


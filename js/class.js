
class Card {
    name;
    img_path;
    cost;
    text;
    constructor(name, img_path, cost, text) {

        this.name = name||"";
        this.img_path = img_path||"img/NULL.png";
        this.cost = cost==undefined?0:cost;
        this.text = text||"";
    }
    cardModel() {
        let card = document.createElement("div");
        card.className = "card";

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

        if (this.text != undefined && this.text != "") {
            let text = document.createElement("p");
            text.className = "text";
            text.innerHTML = this.text;
            card.appendChild(text);
        }


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

    useEffect;
    atkEffect;
    roundEffect;
    deathEffect;


    constructor(data) {
        super(data.name, data.img_path, data.cost, data.text);
        this.def_atk = data.def_atk==undefined?0:data.def_atk;
        this.def_hp = data.def_hp==undefined?1:data.def_hp;

        
        this.is_leap_atk=data.is_leap_atk==undefined?false:data.is_leap_atk;
        this.is_guard=data.is_guard==undefined?false:data.is_guard;
        this.is_unatk=data.is_unatk==undefined?false:data.is_unatk;
        
        this.useEffect=data.useEffect==undefined?function(){}:data.useEffect;
        this.atkEffect=data.atkEffect==undefined?function(){}:data.atkEffect;
        this.roundEffect=data.roundEffect==undefined?function(){}:data.roundEffect;
        this.deathEffect=data.deathEffect==undefined?function(){}:data.deathEffect;

        this.atk = this.def_atk;
        this.limit_hp = this.def_hp;
        this.hp = this.limit_hp;
    }


    cardModel() {
        //创建卡牌标签
        let _super = new Card(this.name, this.img_path, this.cost, this.text);
        let card = _super.cardModel();

        let atk = document.createElement("span");
        atk.className = "atk";
        atk.innerHTML = this.atk;
        card.appendChild(atk);



        let hp = document.createElement("span");
        hp.className = "hp";
        hp.innerHTML = this.hp;
        card.appendChild(hp);


        return card;
    }



}



class Character {
    limit_hp;
    hp;
    limit_coin;
    coin;
    constructor(limit_hp, coin) {
        this.limit_hp = limit_hp;
        this.hp = this.limit_hp;
        this.limit_coin = coin;
        this.coin = this.limit_coin;
    }
}


class Player extends Character {
    library;
    deck;
    hands;
    constructor() {
        super(20, 1);
        this.deck = new Array();
        this.hands = new Array();
        this.library=new Array();
    }

    growth() {
        if (player.limit_coin < 7) {
            player.limit_coin++;
        }
        player.coin = player.limit_coin;
    }

    //抽卡
    drawCard() {
        if (this.deck.length == 0) return;
        let x = Math.floor(Math.random() * this.deck.length);
        this.hands.push(this.deck[x]);
        this.deck.splice(x,1);

    }

    //填充牌库
    fillDeck(){
        this.deck.length=0;
        for(let i=0;i<this.library.length;i++){
            this.deck.push({...this.library[i]});
        }
    }
}



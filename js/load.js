
function merge(a, b) {
    for (let i in b) {
        a[i] = b[i];
    }
}


var card_data = {}
var card_index = {};
var load_flag = 0
let req = new XMLHttpRequest();
let url="card/index.json";
req.open("get", url);
req.send(null);
req.onload = function () {

    if (req.status == 200) {
        merge(card_index, JSON.parse(req.responseText));
        //console.log(card_index);
        
        load_flag= Object.keys(card_index).length;
        for (let i in card_index) {
            let xreq = new XMLHttpRequest();
            xreq.open("get", card_index[i]);
            xreq.send(null);

            xreq.onload = function () {

                if (xreq.status == 200) {
                    card_data[i] = JSON.parse(xreq.responseText,(key,val)=>{
                        if("string" == typeof  val && val.indexOf('function')== 0){
                            return  Function('return ' + val)();
                        }
                        else{
                            return val;
                        }
                    });
                    //console.log(JSON.parse(xreq.responseText));
                    load_flag--;
                    if (load_flag == 0) {
                        console.log("start");
                        let div_script = document.getElementById("script");
                        let script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = "js/main.js";

                        div_script.appendChild(script);


                    }
                }
            }

        }
        console.log(card_data);

    }
}




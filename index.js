const https = require('https');
var api_data;

const Discord = require('discord.js');
const client = new Discord.Client();
var dolar=0,last_dolar=0,diff=0;

function emoji(id){
  return client.emojis.find(id).toString();
}

function getRequest(){
  return new Promise((resolve,reject)=>{
    https.get('https://api.coincap.io/v2/assets/bitcoin', (resp) => {
      let data = '';
    
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        api_data = JSON.parse(data);
        last_dolar = (0 + dolar);
        dolar = (0 + api_data.data.priceUsd);
        diff = dolar-last_dolar;
        resolve(JSON.stringify("Price $USD: "+(Math.round(api_data.data.priceUsd*100)/100)));
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject("Error happened: "+err.message);
    });
    
  });
}

let request_call = getRequest();



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  s_msg = msg.content.split(" ");
  if (s_msg[0] === '>cbot') {
    switch (s_msg[1]) {
      case "btc":
        request_call.then((response)=>{
          console.log("call: "+dolar+ " | "+diff);
            if(diff>0)
              msg.channel.send("<:stonks:711648739978248202>");
            else if(diff<0)
              msg.channel.send("<:not_stonks:711755837961535569>");
            else
              msg.channel.send("<:mememan:711648673632616549>");
            msg.channel.send(response);
          }).catch((err)=>{
            msg.channel.send(err);
          });
          request_call = getRequest();
        break;
      case undefined:
      case "":
      case " ":
        msg.channel.send("funcionando");
      break;
      default:
          msg.reply("nao implementado");
        break;
    }
  }
});
//crie um arquivo na pasta, chamado server_token e coloque o token do seu bot
//ou substitua essa parte aqui por client.login( < seu token > );
const fs = require("fs");
fs.readFile("server_token",'utf-8',function(err,data){
  if(err)
    throw err;
  else{
    client.login(data);
  }
})


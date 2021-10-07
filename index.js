ToRequire = ["./server.js","./Important/sql.js"];let s ="Required:\n"
for(_ in ToRequire){require(ToRequire[_]);s=s+ToRequire[_]+"\n"}s=s+"----";function RemoveLog(){return;}
/**/const discord=require("discord.js");const bot=new discord.Client();const prefix="k9 ";var Cooldown={};const fs=require("fs")
//---------------------------------
function checkisintable(t,h){if(t[h]){return true}else{return false}}
bot.on("ready", async () => {
  bot.user.setActivity(`${prefix}help`,{type:"LISTENING"})
})
bot.on("message",async message => {
  let userpath;
  if(typeof(Cooldown[message.author.id]) =="object" == false){
    Cooldown[message.author.id] = {}
  }
  userpath=Cooldown[message.author.id]
  let msg = message.content.split(/ +/g)
  if(msg[0].toLowerCase()===prefix.replace(/ +/g,"").toLowerCase()==false)return;
  let cmd = msg[1].toLowerCase()
  let args = msg.slice(2)
  let dirPath = fs.readdirSync(__dirname + "/Commands")
  //--------------\\
  let cmdmatched = undefined
  let cmdmatchedsettings = undefined
  for(_ in dirPath){
    let s = fs.readdirSync(__dirname + "/Commands" + "/" + dirPath[_])
    for(i in s) {
      let filename = s[i].split(".")[0].toLowerCase()
      let fileextenstion = s[i].split(".")[1]
      let iscmd = false
      let iscmdname;
      let iscmdsettings;
      let seconds;
      let file = require("./Commands" + "/" + dirPath[_] + "/"+filename+"."+fileextenstion)
      if(typeof(file.keyword)=="object") {
        for(z in file.keyword) {
          if(iscmd)break;
          if(cmd===file.keyword[z].toLowerCase()) {
          iscmd = true
          iscmdname = file.keyword[z]
          iscmdsettings = file
          seconds = file.cooldown || 5
          }
        }
      }
      if(iscmd==false && cmd===filename && fileextenstion=="js") {
          iscmd = true
          iscmdname = filename
          iscmdsettings = file
          seconds = file.cooldown || 5
      }
      if(iscmd) {
        //-----------------------
        if(checkisintable(userpath,filename)) {
          let a = userpath[filename]
          if(checkisintable(a,"Seconds")) {
            return message.reply("You need to wait `"+a.Seconds+"` more seconds before using Allies of the command/the command `"+filename+"` again!\n"+"Command's Default Cooldown: "+seconds)
          }
          else return;
        }
        else {
          userpath[filename] = {}
          cmdmatched = iscmdname
          cmdmatchedsettings = iscmdsettings
          userpath[filename].Seconds = seconds
          function RemoveWait() {
            setTimeout(function(){
              if(userpath[filename].Seconds < 1) {
                userpath[filename] = null
              }
              else
              {
                userpath[filename].Seconds = userpath[filename].Seconds - 1
                RemoveWait()
              }
            },1000)
          }
          RemoveWait()
        }
        //-----------------------
        break;
      }
    }
  }
if(cmdmatched && cmdmatchedsettings) {
  return cmdmatchedsettings.script(bot,message,args,prefix,cmdmatched+" ")
}
})
bot.login(process.env.token||"Token not found: process.env.token");
module.exports = bot
RemoveLog()

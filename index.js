const Discord = require("discord.js");
const auth = require("./auth.json");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var timing;             // interval timer
var minutes = 0;        // minutes for each interval eg. 25 or 5
var timePassed = 0;     // how much time has passed in pomo so far
var time;               // date object to parse for time
var working = false;  // which interval we are on eg. working or break

function setPomo(msg) {
    working = !working;

    if (!working) {
      // sets value for break time eg. 5 minutes
      minutes = 5;
      message = "ding! work time!";
    } else {
      // sets value for initial time eg. 25 minutes
      minutes = 25;
      message = "ding! break time!";
    }

    countingTime(minutes);

    timer = setTimeout(() => {
      msg.channel.send(message);
      clearInterval(timing);
      timePassed = 0;
      setPomo(msg);
    }, minutes * 60 * 1000);
}

function reset(){
    timePassed = 0;
    timeRemaining = 0;
    intervalCount = 0;
    working = false;
    clearTimeout(timer);
    clearInterval(timing); 
}

function countingTime(min){
    timing = setInterval(() => {
        timePassed++;
        timeRemaining = (min*60)-timePassed
        time = new Date(timeRemaining * 1000).toISOString().substr(14,5);
      }, 1000);
}

client.on("message", (msg) => {
  // checks for bot message or non command message, we don't care
  if (!msg.content.startsWith("!") || msg.author.bot) return;

  // allows for arugments to be passed in
  const args = msg.content.trim().split(" ");

  // const for the specific command to be parsed
  const command = args.shift().toLowerCase();

  // starting pomo
  if (command === "!start") {
    msg.channel.send("starting work day!");
    intervalCount = 0;
    setPomo(msg);
  } else if (command === "!stop") {
    reset();
    msg.channel.send("stopping work time!");
  } else if (command === "!time") {
    msg.channel.send(
      "Time remaining " + time.substr(0,2) + " min " + time.substr(3,2) + " sec"
    );
  } else if (command === "!lunch"){
      reset()
      msg.channel.send("lunch time!");
      let lunchMinutes = 30;
      countingTime(lunchMinutes);
      setTimeout(function(){
        reset();
        msg.channel.send("work time!");
        setPomo(msg);
      }, lunchMinutes*20*1000)
  }
});

client.login(auth.token);

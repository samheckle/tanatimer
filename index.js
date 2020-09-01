const Discord = require("discord.js");
const auth = require("./auth.json");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var timing; // interval timer
var minutes = 0; // minutes for each interval eg. 25 or 5
var timePassed = 0; // how much time has passed in pomo so far
var time; // date object to parse for time
var working = false; // which interval we are on eg. working or break
var minuteCounter;
var minuteMessage;

function setPomo(msg) {
  working = !working;

  if (!working) {
    // sets value for break time eg. 5 minutes
    minutes = 5;
    message = "ding! work time!";
    minuteMessage = "breaking: ";
    client.user.setPresence({ activity: { name: minuteMessage + 
          "5 min" } });
  } else {
    // sets value for initial time eg. 25 minutes
    minutes = 25;
    message = "ding! break time!";
    minuteMessage = "working: "
    client.user.setPresence({ activity: { name: minuteMessage +
      "25 min" } });
  }

  countingTime(minutes);

  timer = setTimeout(() => {
    msg.channel.send(message);
    clearInterval(timing);
    timePassed = 0;
    setPomo(msg);
  }, minutes * 60 * 1000);
}

function reset() {
  timePassed = 0;
  timeRemaining = 0;
  intervalCount = 0;
  working = false;
  clearTimeout(timer);
  clearInterval(timing);
  clearInterval(minuteCounter);
  timer = null, timing= null, minuteCounter = null;
  client.user.setPresence({ activity: { name: "anti-pomo time" } });
}

function countingTime(min) {
  timing = setInterval(() => {
    timePassed++;
    timeRemaining = min * 60 - timePassed;
    time = new Date(timeRemaining * 1000).toISOString().substr(14, 5);
  }, 1000);

  minuteCounter = setInterval(()=>{
    client.user.setPresence({
      activity: {
        name:
          minuteMessage + 
          time.substr(0, 2) +
          " min"
      },
    });
    console.log(time.substr(0, 2) + " min ")
  }, 60000)
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
    client.user.setPresence({ activity: { name: "work time!" } });
    intervalCount = 0;
    setPomo(msg);
  } else if (command === "!stop") {
    if(timing != null){
      reset();
      msg.channel.send("stopping work time!");
    } else msg.channel.send("no active timers!");
  } else if (command === "!time") {
    msg.channel.send(
      "Time remaining " +
        time.substr(0, 2) +
        " min " +
        time.substr(3, 2) +
        " sec"
    );
  } else if (command === "!lunch") {
    reset();
    msg.channel.send("lunch time!");
    let lunchMinutes = 30;
    countingTime(lunchMinutes);
    minuteMessage = "lunch: "
    client.user.setPresence({
      activity: {
        name:
          minuteMessage + 
          "30 min"
      },
    });
    setTimeout(function () {
      reset();
      msg.channel.send("work time!");
      setPomo(msg);
    }, lunchMinutes * 20 * 1000);
  }
});

client.login(auth.token);

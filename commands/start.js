module.exports = {
	name: 'start',
	description: 'starts the timer for the cycle of the day',
	execute(message, args) {

        message.channel.send('starting timer!');
        // setInterval(timer => {

        // }, 15000000)

        let ms = 0;
        let timer = setTimeout(timer => {
            message.channel.send('break time!');
        }, 10000)
        // clearInterval(timer);
        // message.channel.send("stopped!");
	},
};
const timers = require("../../models/timer");
const startTimer = require("../../utility/startTimer");

module.exports = {
  // The ready event runs only once during the startup of the discord bot
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} is logged in and online`);

    const data = await timers.find();
    data.forEach((timer) => {
      startTimer(client, timer);
    });
  },
};

const { EmbedBuilder } = require("discord.js");

module.exports = (client, timer) => {
  const embed = new EmbedBuilder()
    .setTitle("Timer Ended!")
    .setDescription(`Timer for \`${timer.reason || "No Reason"}\``)
    .addFields([
      {
        name: "Server",
        value: client.guilds.cache.get(timer.guild)?.name || "Unknown",
        inline: true,
      },
      {
        name: "Channel",
        value: client.channels.cache.get(timer.channel)?.name || "Unknown",
        inline: true,
      },
      {
        name: "Set at",
        value: new Date(parseInt(timer.createdAt)).toString() || "Unknown",
        inline: true,
      },
    ])
    .setFooter({
      text: `Timer ended at ${new Date(Date.now()).toTimeString()}`,
    });

  const timeLeft = Date.now() >= timer?.endAt ? 0 : timer.endAt - Date.now();

  setTimeout(async () => {
    try {
      const channel = client.channels.cache.get(timer.channel);
      channel.send({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      const channel = client.channels.cache.get(timer.channel);
      channel.send("There was an error with starting the timer.");
    }
  }, timeLeft);
};

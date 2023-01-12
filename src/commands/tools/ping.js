//Use the SlashCommandBuilder to build commands
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  // Create new Slash command using the SlashCommand Builder.
  // Store it in data because that gets processed by our handlers
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns my ping"),
  /* Define Slash commands execute method
   * This is where its functionality is defined
   * This execute method will be called by the command Handlers
   */
  async execute(interaction, client) {
    // Get the message that invoked the interaction
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    // Create a new message string
    const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${
      message.createdTimestamp - interaction.createdTimestamp
    }`;

    // Send the message string as a reply
    await interaction.editReply({
      content: newMessage,
    });
  },
};

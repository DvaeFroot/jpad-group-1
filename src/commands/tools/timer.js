//Use the SlashCommandBuilder to build commands
const pms = require("ms-prettify");
const { SlashCommandBuilder } = require("discord.js");
const { default: ShortUniqueId } = require("short-unique-id");
const timers = require("../../models/timer");
const startTimer = require("../../utility/startTimer");

module.exports = {
  // Create new Slash command using the SlashCommand Builder.
  // Store it in data because that gets processed by our handlers
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Create a timer")
    //Create the autocomplete parameters
    .addNumberOption((option) =>
      option
        .setName("time_units")
        .setDescription("Time units")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("unit")
        .setDescription("seconds, minutes, hours")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("What the timer is for")
        .setAutocomplete(true)
    ),

  // Define autocomplete method
  // This is where it's funcionality is defined
  async autocomplete(interaction, client) {
    // Get the current focused autocomplete parameter object
    const focusedOption = interaction.options.getFocused(true);

    /*
     * Defined the options for each autocomplete here
     */
    let choices = [];
    if (focusedOption.name === "time_units") {
      choices = [];
    }

    if (focusedOption.name === "unit") {
      choices = ["seconds", "minutes", "hours"];
    }

    // Filter the options to the current value of the focused parameter
    const filtered = choices.filter((choice) => {
      return choice.startsWith(focusedOption.value);
    });

    // Display the autocomplete options
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  // Define Slash commands execute method
  // This is where its functionality is defined
  async execute(interaction, client) {
    const uid = new ShortUniqueId({ length: 10 });
    const timeUnits = interaction.options.getNumber("time_units");
    const unit = interaction.options.getString("unit");
    const reason = interaction.options.getString("reason");

    let totalTimeMS;

    switch (unit) {
      case "seconds":
        totalTimeMS = timeUnits * 1000;
        break;
      case "minutes":
        totalTimeMS = timeUnits * 1000 * 60;
        break;
      case "hours":
        totalTimeMS = timeUnits * 1000 * 60 * 60;
        break;
    }

    const timer = await timers.create({
      id: uid(),
      user: interaction.user.id,
      guild: interaction.guild.id,
      channel: interaction.channel.id,
      reason: reason,
      createdAt: Date.now(),
      time: totalTimeMS,
      endAt: Date.now() + totalTimeMS,
    });

    interaction.reply({
      content: `Timer set for ${timeUnits} ${unit} for ${reason}`,
    });

    startTimer(client, timer);
  },
};

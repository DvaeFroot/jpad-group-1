/* InteractionType allows us to identify the type of interaction that has been invoked.
 * Under the hood, this just returns a number so technically you can directly specify
 * the number but that would be unreadable that's why we use this.
 */
const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /*
   * interaction is the object that was used to invoke the command
   * We can perform many things with the interaction object such as replying to it and editing its contents
   */
  async execute(interaction, client) {
    // Define the different types of interactions
    // Perform Slash Commands
    if (interaction.isChatInputCommand()) {
      // Get the name of the Slash command that was invoked
      const { commandName } = interaction;
      // Retrive the data for the command in the commands Collection using the get method
      const command = client.commands.get(commandName);

      /* Guard clause to stop the method if we're not running a command
       *
       * Take Note of this Programming Pattern because this is a simple but effective pattern that you can use in your own codes.
       */
      if (!command) {
        return;
      }

      // If there is a command then we try to execute that command.
      // The execute method is defined in the command itself in the commands folder
      try {
        await command.execute(interaction, client);
        // If an error occurs output it to the console.
      } catch (error) {
        console.error(error);
        // Output the error to the user as a reply
        await interaction.reply({
          content: `Something went wrong while executing this command...`,
        });
      }
      // Perform autocompletion
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      // Get the name of the Slash command that was invoked
      const { commandName } = interaction;
      // Retrive the data for the command in the commands Collection using the get method
      const command = client.commands.get(commandName);

      // Guard clause to stop the method if we're not running a command
      if (!command) {
        return;
      }

      // Perform autocompletion if there exists one
      try {
        await command.autocomplete(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Something went wrong while performing autocomplete...`,
        });
      }
    }
  },
};

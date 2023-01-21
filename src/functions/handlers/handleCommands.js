/*
 * REST allows us to perform requests like a REST API. Think of it like fetch or axios but specifically for discord.
 * Routes allows us to navigate to the correct API. It's essentially a builder for a url.
 */
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
require("dotenv").config();

module.exports = (client) => {
  client.handleCommands = async () => {
    //Get all the folders contained in src/commands
    const commandFolders = fs.readdirSync(`./src/commands`);
    //Loop through each folder in commands
    for (const folder of commandFolders) {
      //Get all the files within the current folder and make sure it's a javascript file using the filter method.
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      //Loop through each file in the current folder
      for (const file of commandFiles) {
        //Import the current file
        const command = require(`../../commands/${folder}/${file}`);
        /*
         * Add it to the commands collection; the Collection class is
         * just like an object but with added extra functions
         * This is used for retrieving data about the command.
         */
        client.commands.set(command.data.name, command);
        /*
         * Add it to the command array; Remember that the command array
         * is only used for registering commands to the discord api
         */
        client.commandArray.push(command.data.toJSON());
        console.log(
          `Command: ${command.data.name} has been passed through the handler`
        );
      }
    }

    /*
     * Prepare Ids for bot instance and server
     * You can retrieve the id for the bot instance in the discord server it's in.
     * Right click the avatar icon and select copy id
     * The same process applies to getting the id of the server
     */
    const clientId = "1061699324586766372";
    const guildId = "910824575321903104";

    // Create new REST instance to register the commands to our discord bot
    const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

    try {
      // Register the commands
      console.log("Started refreshing application (/) commands.");
      /*
       * Await stops the current program at the current line until a promise
       * is returned
       */
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands");
    } catch (error) {
      console.error(error);
    }
  };
};

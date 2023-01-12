// We will be using CommonJS imports and exports for this project since it allows for a more modular approach
// I am unsure how to implement this with Modules so just get used to using CommonJS

/*
 * Client will allow us to instantiate a new discord bot client
 * Collection is a data type that inherits from the Object class.
 * GatewayIntentBits will allow us to easily set permissions for what type of events that our discord bot can listen to
 */
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// fs stands for file system. This will allow us to read local directories and files.
const fs = require("fs");

// This allows us to access the variables we set in the .env file in the root directory
require("dotenv").config();
// Only get the BOT_TOKEN variable
const { BOT_TOKEN } = process.env;

// Create Discord Bot Client Instance and set its permissions with GatewayIntentBits.
const client = new Client({ intents: GatewayIntentBits.Guilds });

/*
 * Initialize variables for storing commands. We can easily retrieve information about the commands with this data type.
 * We need this for registering our commands to the server so that we may use it in our discord bot
 *
 * NOTE that both data types serve different purposes. One is for retrieval of data and the other is for registering the commands to the Discord API.
 */
client.commands = new Collection();
client.commandArray = [];

/*
 * The block of code below is where we feed in various functions into our client dynamically
 * We can add functions as its own file and we can add and remove them as much as needed
 * This is all just setup btw and you don't need to fully understand them.
 * Just know that this will make adding events and commands much easier in the future by modularizing them
 */

/* Get all the folders in src/functions
 *
 *NOTE ./ means current directory and ../ means parent directory
 */
const functionFolders = fs.readdirSync("./src/functions");
// Loop through each folder in src/functions
for (const folder of functionFolders) {
  /*
   * Get all the files in src/functions/folder and make sure it is a javascript file using the filter method.
   *
   * The filter method iterates through the entire array or object. It returns an Array.
   * The filter method requires a call back method that returns a boolean.
   * For each item in the array or object, the callback method is applied.
   * If the call back method returns a true then that item in the array get's appended into the return Array.
   * In the method below file.endsWith(`.js`) returns a boolean literal true if the file name ends with .js
   */
  const functionFiles = fs
    // Note that for string interpolation with the ${} substitution, you must use the backtick character. Backtick and Quotation marks are DIFFERENT.
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(`.js`));
  /*
   * Import each file in src/functions/folder
   *
   * This is where we are able to dynamically add functions and objects as needed.
   * This is still just setup so no need to fully understand it.
   * You can observe this pattern inside the imported files as well.
   * Checkout handleCommands and handleEvents because they use the same pattern.
   */
  for (const file of functionFiles) {
    /*
     * We are calling the default function from a file (the one defined in module.exports) and then passing
     * a reference of the client directly.
     * Without all the string interpolation it's simply just: require(filepath)(client)
     * After the require is executed, the client will have registered the function to itself.
     *
     * NOTE we are the one registering the function into the client. If we don't specify registration within the file then
     * there will be no registration
     */
    require(`./functions/${folder}/${file}`)(client);
  }
}

// Now we call our dynamically added functions
client.handleEvents();
client.handleCommands();

// Lastly, we login our bot with the token from the .env file
client.login(BOT_TOKEN);

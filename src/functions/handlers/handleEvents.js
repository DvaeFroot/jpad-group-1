const fs = require("fs");

module.exports = (client) => {
  client.handleEvents = async () => {
    // Get all folders in src/events
    const eventFolders = fs.readdirSync(`./src/events`);
    // Loop through all folders in src/events
    for (const folder of eventFolders) {
      // Get all files in the current folder
      const eventFiles = fs
        .readdirSync(`./src/events/${eventFolders}`)
        .filter((file) => file.endsWith(".js"));

      // Do something based on the name of the folder
      switch (folder) {
        case "client":
          // Loop through each file in the current folder
          for (const file of eventFiles) {
            // Import the file
            const event = require(`../../events/${folder}/${file}`);

            // Do something based on its type of event.
            // the event.once event occurs at the start up of the bot
            if (event.once) {
              // ...args allows function to take an undefined amount of arguments
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
              // the event.on event listens for events throughout the lifetime of the bot
            } else {
              // ...args allows function to take an undefined amount of arguments
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
            }
          }
      }
    }
  };
};

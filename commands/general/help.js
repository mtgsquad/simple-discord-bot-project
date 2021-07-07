const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "The help command",
  aliases: ["commands"],
  run: (client, message, args) => {
    let embedForTheHelpCommad = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.member.user.displayAvatarURL({ dynamic: true })
      )
      .setTitle("Help Menu")
      .setDescription(
        "The Help Menu, Contains All The Commands And Their Names."
      )
      .setTimestamp();

    message.channel.send(embedForTheHelpCommad);
  },
};

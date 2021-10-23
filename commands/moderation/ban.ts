import { Command } from '@';
import { Permissions } from 'discord.js';
import { userMention } from '@discordjs/builders';
import embed from '@/utils/embed';

new Command({
  name: 'ban',
  description: 'Ban A User With A Reason',
  options: [
    {
      name: 'user',
      description: 'The User To Ban',
      type: 'USER',
      isRequired: true
    },
    {
      name: 'reason',
      description: 'The Reason You Are Banning The User',
      type: 'STRING',
      isRequired: true
    },
    {
      name: 'days',
      description: 'The Ammount Of Days To Ban The User',
      type: 'INTEGER'
    }
  ],
  run: async (_, __, interaction) => {
    let user = interaction.options.getUser('user');
    let days = interaction.options.getInteger('days');
    let reason = interaction.options.getString('reason');
    let member = await interaction.guild.members.fetch(user);

    if (!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return await interaction.reply({
        content: 'You Do Not Have Permission To Ban Members',
        ephemeral: true
      });
    else if (!member.bannable)
      return await interaction.reply({
        embeds: [
          embed({
            title: 'Cannot Ban This User',
            description: `You Are Not Able To Ban ${userMention(user.id)}`,
            user: interaction.user,
            isError: true
          })
        ]
      });

    await member.ban({ days, reason });

    try {
      await user.send({
        embeds: [
          embed({
            title: 'You Were Banned',
            description: `You Were Banned From: ${interaction.guild.name} ${
              days ? `For ${days} Days` : ''
            }, Because: ${reason}`,
            user: interaction.user,
            isError: true
          })
        ]
      });
    } catch {}

    await interaction.reply({
      embeds: [
        embed({
          title: 'Banned User',
          description: `Sucessfully Banned User: ${user.tag}`,
          user: interaction.user
        })
      ],
      ephemeral: true
    });
  }
});

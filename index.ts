import {
  Client as _Client,
  Collection,
  Intents,
  CommandInteraction
} from 'discord.js';
import glob from 'fast-glob';
import onReady from '@/events/ready.js';
import embed from '@/utils/embed';
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  codeBlock,
  userMention
} from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { token, clientId } from '@/config.json';

process.chdir(__dirname);

async function main(client: Client, rest: REST) {
  (await glob('commands/**/*.js')).map((command: string) =>
    require(`${__dirname}/${command}`)
  );

  (await glob('handlers/**/*.js')).map(async (handler: string) =>
    require(`${__dirname}/${handler}`)
  );

  client.once('ready', () => onReady(client));

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.run(client, rest, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [
          embed({
            title: 'Error',
            description: `Failed To Execute The Command!\nPlease DM Me About This Error At ${userMention(
              '488802888928329753'
            )}\n${codeBlock(String(error))}`,
            user: interaction.user,
            isError: true
          })
        ],
        ephemeral: true
      });
    }
  });

  await rest.put(
    Routes.applicationGuildCommands(clientId, '900561863094460497'),
    {
      body: client.commands.map((command: _command) =>
        command.slashCommand.toJSON()
      )
    }
  );

  client.login(token);
}

export class Command {
  constructor(command: command) {
    [
      {
        ...command,
        isAlias: false,
        slashCommand: ((command: command) => {
          let cmd = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

          (command.options || []).map((userOption) => {
            cmd[
              `add${userOption.type.replace(/./g, (m, i) =>
                i === 0 ? m.toUpperCase() : m.toLowerCase()
              )}Option`
            ]((option: SlashCommandStringOption) => {
              let opt = option
                .setName(userOption.name)
                .setDescription(userOption.description)
                .setRequired(Boolean(userOption.isRequired));

              return opt;
            });
          });

          return cmd;
        })(command)
      },
      ...(command.aliases || []).map((alias: string) => ({
        ...command,
        name: alias,
        isAlias: true,
        slashCommand: ((command: command) => {
          let cmd = new SlashCommandBuilder()
            .setName(alias)
            .setDescription(command.description);

          (command.options || []).map((userOption) => {
            cmd[
              `add${userOption.type.replace(/./g, (m, i) =>
                i === 0 ? m.toUpperCase() : m.toLowerCase()
              )}Option`
            ]((option: SlashCommandStringOption) => {
              let opt = option
                .setName(userOption.name)
                .setDescription(userOption.description)
                .setRequired(Boolean(userOption.isRequired));

              return opt;
            });
          });

          return cmd;
        })(command)
      }))
    ].map((command: _command) => {
      client.commands.set(command.name, command);
    });
  }
}

export class Client extends _Client {
  commands: Collection<string, _command> = new Collection();
}

export interface command {
  name: string;
  description: string;
  aliases?: string[];
  options?: {
    name: string;
    description: string;
    isRequired?: boolean;
    type:
      | 'STRING'
      | 'INTEGER'
      | 'NUMBER'
      | 'BOOLEAN'
      | 'USER'
      | 'CHANNEL'
      | 'ROLE'
      | 'MENTIONABLE';
    choices?: {
      name: string;
      value: any;
    }[];
  }[];
  run: (client: Client, rest: REST, interaction: CommandInteraction) => any;
}

export interface _command extends command {
  slashCommand: Omit<
    SlashCommandBuilder,
    'addSubcommand' | 'addSubcommandGroup'
  >;
  isAlias: boolean;
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken(token);

main(client, rest);

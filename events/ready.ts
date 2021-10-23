import { Client } from '@';
import { activity } from '@/config.json';
import ascii from 'ascii-table';

export default async (client: Client) => {
  console.log(`Logged In As ${client.user.tag}!`);
  client.user.setActivity(activity);

  const table = new ascii('Commands');
  table.setHeading('Command', 'Descriptions', 'Aliases');
  client.commands
    .filter((command) => !command.isAlias)
    .map((command) =>
      table.addRow(
        command.name,
        command.description,
        command.aliases ? command.aliases.join(', ') : 'No Aliases'
      )
    );
  console.log();
  console.log(table.toString());
};

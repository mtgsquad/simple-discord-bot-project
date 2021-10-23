import type { User, EmbedFieldData, ColorResolvable } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export default ({
  title,
  description,
  user,
  isError,
  fields,
  color,
  url,
  footer
}: options): MessageEmbed =>
  new MessageEmbed()
    .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
    .setTitle(title)
    .setDescription(description)
    .addFields(fields || [])
    .setColor(color || isError ? 0xd80000 : 0x50c878)
    .setURL(url || '')
    .setFooter(footer?.text || '', footer?.iconURL || '')
    .setTimestamp();

interface options {
  title: string;
  description: string;
  user: User;
  isError?: boolean;
  footer?: { iconURL?: string; text: string };
  fields?: EmbedFieldData[];
  color?: ColorResolvable;
  url?: string;
}

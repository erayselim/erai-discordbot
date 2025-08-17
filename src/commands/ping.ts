import type { ChatInputCommandInteraction } from 'discord.js';
import { registerSlashCommand } from '../lib/interaction-dispatcher.js';

registerSlashCommand('ping', async (interaction: ChatInputCommandInteraction) => {
  const sent = await interaction.reply({ content: 'Pong!', fetchReply: true });
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  await interaction.editReply(`Pong! Gecikme: ${latency}ms`);
});



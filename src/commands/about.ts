import type { ChatInputCommandInteraction } from 'discord.js';
import { registerSlashCommand } from '../lib/interaction-dispatcher.js';
import pkg from '../../package.json' assert { type: 'json' };

registerSlashCommand('about', async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply({
    content: `<@486501098211901466> tarafından yapılmıştır.`,
    ephemeral: true
  });
});
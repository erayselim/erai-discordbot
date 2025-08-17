import type { Client, ChatInputCommandInteraction, Interaction } from 'discord.js';

type CommandHandler = (interaction: ChatInputCommandInteraction) => Promise<void> | void;

const commandHandlers = new Map<string, CommandHandler>();

export function registerSlashCommand(name: string, handler: CommandHandler): void {
  commandHandlers.set(name, handler);
}

export function registerInteractionHandlers(client: Client): void {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const handler = commandHandlers.get(interaction.commandName);
    if (!handler) return;
    try {
      await handler(interaction);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: `Hata: ${errorMessage}`, ephemeral: true });
      } else {
        await interaction.reply({ content: `Hata: ${errorMessage}`, ephemeral: true });
      }
    }
  });
}



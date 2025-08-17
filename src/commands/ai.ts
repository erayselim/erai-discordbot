import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { registerSlashCommand } from '../lib/interaction-dispatcher.js';
import { ai, type ChatMessage } from '../lib/ai.js';

// Kullanıcı + kanal bazlı son 3 konuşma turu (en çok 6 mesaj) hafızası
const conversationHistories = new Map<string, ChatMessage[]>();

// Bu dosya sadece handler kaydeder; komut tanımı register scriptinde
registerSlashCommand('ai', async (interaction: ChatInputCommandInteraction) => {
  const prompt = interaction.options.getString('prompt', false) ?? '';
  if (!prompt) {
    await interaction.reply({ content: 'Bir şey söyle (prompt gir).', ephemeral: true });
    return;
  }

  await interaction.deferReply();
  const temperature = Number(process.env.AI_TEMPERATURE ?? '0.9');
  const maxTokens = Number(process.env.AI_MAX_OUTPUT_TOKENS ?? '200');

  const key = `${interaction.channelId}:${interaction.user.id}`;
  const history = conversationHistories.get(key) ?? [];
  const last6 = history.slice(-6);

  const reply = await ai.chat(prompt, {
    temperature,
    maxOutputTokens: maxTokens,
    history: last6,
  });

  const response = `> Şunu yanıtlıyorum: \`${prompt}\`\n\n${reply}`;
  await interaction.editReply(response);

  const updated: ChatMessage[] = [
    ...history,
    { role: 'user', content: prompt },
    { role: 'assistant', content: reply },
  ];
  conversationHistories.set(key, updated.slice(-6));
});

export const aiCommand = new SlashCommandBuilder()
  .setName('ai')
  .setDescription('AI ile kısa sohbet')
  .addStringOption((opt) =>
    opt
      .setName('prompt')
      .setDescription('Ne söylemek istersin?')
      .setRequired(true)
  );


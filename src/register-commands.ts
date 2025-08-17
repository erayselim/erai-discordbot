import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { aiCommand } from './commands/ai.js';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

const token = requiredEnv('DISCORD_TOKEN');
const clientId = requiredEnv('DISCORD_CLIENT_ID');
const guildId = process.env.DISCORD_GUILD_ID; // Optional: for guild-scoped during dev

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun gecikmesini ölçer'),
  new SlashCommandBuilder()
    .setName('about')
    .setDescription('Bot ve sürüm bilgisi'),
  aiCommand
].map((c) => c.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

async function main() {
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands
      });
      console.log('Registered guild commands');
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Registered global commands');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();



import 'dotenv/config';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { registerInteractionHandlers } from './lib/interaction-dispatcher.js';
import './commands/index.js';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Missing DISCORD_TOKEN in environment');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

registerInteractionHandlers(client);

client.login(token);



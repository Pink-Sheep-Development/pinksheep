const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});
require('dotenv').config();

const baaaMessages = [
  "BAAAAAAAAAAA 🐑",
  "bAAAaaaAAAaaAaa",
  "✨🅱️AAAAAAAAA✨",
  "Baa moment™",
  "🚨BAA EMERGENCY🚨",
  "This is your daily baa. Carry on.",
];

const easterEggs = [
  "Pink Sheep is watching 👁️🐏",
  "Baa... but like, philosophically 🧠",
  "You've unlocked Ultra Instinct Baa 🐉",
  "This baa has been brought to you by Mustache Gang™️",
  "I'm not just a bot... I'm a baa-t.",
];

// 🔄 Baa in a random channel every 10–30 min per guild
function scheduleBaaa() {
  const min = 10 * 60 * 1000;
  const max = 30 * 60 * 1000;
  const interval = Math.floor(Math.random() * (max - min + 1)) + min;

  setTimeout(async () => {
    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const channels = guild.channels.cache.filter(
          (ch) =>
            ch.isTextBased() &&
            ch.type === 0 && // GuildText
            ch
              .permissionsFor(guild.members.me)
              .has(PermissionsBitField.Flags.SendMessages)
        );

        if (channels.size === 0) continue;

        const channel = channels.random();
        const msg =
          Math.random() < 0.01
            ? easterEggs[Math.floor(Math.random() * easterEggs.length)]
            : baaaMessages[Math.floor(Math.random() * baaaMessages.length)];

        channel.send(msg);
      } catch (err) {
        console.error(`Error in guild ${guildId}:`, err);
      }
    }

    scheduleBaaa(); // 🔁 Repeat
  }, interval);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // 🔥 Trigger phrases
  if (content.includes("pink")) {
    message.reply("Did someone say PINK?! 💅");
  } else if (content.includes("sheep")) {
    message.reply("You summoned the majestic baa lord 🐑");
  } else if (content.includes("who asked")) {
    message.reply("I asked. BAAAAAAAAA.");
  } else if (content === ".") {
    message.reply("...BAA.");
  }

  // 👑 Force an easter egg (dev use only)
  if (
    content === "!force" &&
    message.author.id === "201654076369403904"
  ) {
    const egg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
    message.channel.send(`🧪 Dev Forced: ${egg}`);
  }

  // 🥚 1 in 200 chance easter egg
  if (Math.floor(Math.random() * 200) === 0) {
    message.channel.send(
      easterEggs[Math.floor(Math.random() * easterEggs.length)]
    );
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  scheduleBaaa();
});

client.login(process.env.token);

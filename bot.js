const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const configPath = path.join(__dirname, "baachannels.json");
let baaChannels = {};
if (fs.existsSync(configPath)) {
  baaChannels = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
function saveBaaChannels() {
  fs.writeFileSync(configPath, JSON.stringify(baaChannels, null, 2));
}

const messageCounter = new Map();
const lastBaaTime = new Map();
const baaaMessages = [
  "BAAAAAAAAAAA 🐑",
  "bAAAaaaAAAaaAaa",
  "✨🕱️AAAAAAAAA✨",
  "Baa moment™",
  "🚨BAA EMERGENCY🚨",
  "This is your daily baa. Carry on.",
  "Certified Baa Classic™",
  "You have been blessed by the BAA 🐑",
  "Baa.exe has started...",
  "💿 Loading... BAA sequence initiated.",
  "Hold up... did someone say BAA?",
  "*baas in sheep*",
  "Unleashing the forbidden BAA 🕳️🐑",
  "Echoes of ancient BAAAAAA",
  "The prophecy foretold... BAA",
  "Baaquake detected. Magnitude: Shear 9.0",
  "WARNING: Too much BAA can be contagious",
  "Every time you read this, a sheep goes 🐑",
  "One small BAA for sheep, one giant BAA for sheepkind",
  "💥 Tactical BAA deployed",
  "Now broadcasting on BAA FM 📻",
  "Have you considered... BAA?",
  "Powered by 100% BAA-grade nonsense",
  "It's baa o'clock somewhere ⏰",
  "🐑 BAA is love. BAA is life.",
  "New DLC unlocked: *BAAAAAAAAA*",
  "The floor is lava. The baa is real.",
  "🧠 Think baa. Be baa.",
  "404: Chill not found. BAAAAAAAA!",
  "✨ Maximum BAA Overdrive Activated ✨",
  
];


const easterEggs = [
  // "Pink Sheep is watching 👁️🐑",
  // "Baa... but like, philosophically 🧠",
  // "You've unlocked Ultra Instinct Baa 🐉",
  // "This baa has been brought to you by Mustache Gang™️",
  // "I'm not just a bot... I'm a baa-t.",
  "God I love <@471721245868556298>....I mean BAAA"
];

function scheduleBaaa() {
  const interval = 5 * 60 * 1000; // check every 5 minutes

  setTimeout(async () => {
    try {
      for (const [guildId, guild] of client.guilds.cache) {
        try {
          const channelId = baaChannels[guild.id];
          if (!channelId) continue;

          const channel = guild.channels.cache.get(channelId);
          if (
            !channel ||
            !channel.isTextBased() ||
            !channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
          ) {
            console.warn(`[WARN] Missing permission in ${channel?.name || channelId}`);
            continue;
          }

          const messageCount = messageCounter.get(channelId) || 0;
          const lastTime = lastBaaTime.get(channelId) || 0;
          const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);

          if (messageCount < 20 && lastTime > twoHoursAgo) continue;
          messageCounter.set(channelId, 0);
          lastBaaTime.set(channelId, Date.now());

          const msg = Math.random() < 0.01
            ? easterEggs[Math.floor(Math.random() * easterEggs.length)]
            : baaaMessages[Math.floor(Math.random() * baaaMessages.length)];

          try {
            await channel.send(msg);
          } catch (sendErr) {
            console.error(`[ERROR] Failed to send BAA in ${channel?.name || channelId}:`, sendErr);
          }
        } catch (innerErr) {
          console.warn(`[Guild: ${guildId}] Error:`, innerErr);
        }
      }
    } catch (outerErr) {
      console.error(`[Global Baa Error]`, outerErr);
    }

    scheduleBaaa();
  }, interval);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const channelId = message.channel.id;
  messageCounter.set(channelId, (messageCounter.get(channelId) || 0) + 1);

  if (content.includes("pink")) {
    message.reply("Did someone say PINK?! 💅");
  } else if (content.includes("sheep")) {
    message.reply("You summoned the majestic baa lord 🐑");
  } else if (content.includes("who asked")) {
    message.reply("I asked. BAAAAAAAAA.");
  } else if (content === ".") {
    message.reply("...BAA.");
  }

  if (content === "!force" && message.author.id === "201654076369403904") {
    const egg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
    message.channel.send(`🧪 Dev Forced: ${egg}`);
  }

  if (Math.floor(Math.random() * 200) === 0) {
    message.channel.send(
      easterEggs[Math.floor(Math.random() * easterEggs.length)]
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setbaachannel") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: 'You need **Manage Server** permission to use this command.', ephemeral: true });
    }

    baaChannels[interaction.guild.id] = interaction.channel.id;
    saveBaaChannels();

    return interaction.reply({
      content: `✅ Set <#${interaction.channel.id}> as the official BAA channel!`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "deletebaachannel") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: 'You need **Manage Server** permission to use this command.', ephemeral: true });
    }

    if (!baaChannels[interaction.guild.id]) {
      return interaction.reply({ content: `❌ No BAA channel set for this server.`, ephemeral: true });
    }

    delete baaChannels[interaction.guild.id];
    saveBaaChannels();

    return interaction.reply({
      content: `❌ The BAA channel has been removed for this server.`,
      ephemeral: true,
    });
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  scheduleBaaa();
});

client.login(process.env.token);

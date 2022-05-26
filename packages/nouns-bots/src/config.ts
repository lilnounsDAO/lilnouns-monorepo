
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisDb: Number(process.env.REDIS_DB ?? 0),
  redisPassword: process.env.REDIS_PASSWORD,

  nounsSubgraph:
    process.env.NOUNS_SUBGRAPH_URL ??
    "https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph",

  twitterEnabled: process.env.TWITTER_ENABLED === 'true',
  twitterAppKey: process.env.TWITTER_APP_KEY ?? '',
  twitterAppSecret: process.env.TWITTER_APP_SECRET ?? '',
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN ?? '',
  twitterAccessSecret: process.env.TWITTER_ACCESS_SECRET ?? '',

  nounsTokenAddress:
    process.env.NOUNS_TOKEN_ADDRESS ?? '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B', //todo: rinkeby
    jsonRpcUrl: process.env.JSON_RPC_URL ?? 'http://localhost:8545',

  discordEnabled: process.env.DISCORD_ENABLED === 'true',
  discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN ?? '',
  discordWebhookId: process.env.DISCORD_WEBHOOK_ID ?? '',
  
  propDiscordWebhookToken: process.env.PROP_DISCORD_WEBHOOK_TOKEN ?? '',
  propDiscordWebhookId: process.env.PROP_DISCORD_WEBHOOK_ID ?? '',

  discordPublicWebhookToken: process.env.DISCORD_PUBLIC_WEBHOOK_TOKEN ?? '',
  discordPublicWebhookId: process.env.DISCORD_PUBLIC_WEBHOOK_ID ?? '',

  pinataEnabled: process.env.PINATA_ENABLED === 'true',
  pinataApiKey: process.env.PINATA_API_KEY ?? '',
  pinataApiSecretKey: process.env.PINATA_API_SECRET_KEY ?? '',
};

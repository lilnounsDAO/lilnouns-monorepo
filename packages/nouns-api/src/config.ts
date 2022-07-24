export const config = {
  environment: process.env.NODE_ENV || 'development',
  serverPort: Number(process.env.SERVER_PORT ?? 5001),
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  nounsTokenAddress:
    process.env.NOUNS_TOKEN_ADDRESS ?? '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
  jsonRpcUrl: process.env.JSON_RPC_URL ?? 'http://localhost:8545',
  lilNounsJWTSecret: process.env.ACCESS_TOKEN_SECRET || 'lil-nouns-test',
  rollbarApiKey: process.env.ROLLBAR_API_KEY || '',
  nftStorageApiKey:
    process.env.NFT_STORAGE_API_KEY ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1NjA0ZTA0YTkxYzcwOGM0MTU2OGZCRTcwMWVjNzVDY2IyMEM3MDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNDgxNDkxNzE4NCwibmFtZSI6Im5vdW5zIn0.f3D9WFLQv4fNGBivXMtbXiKK0ta_UN5RRS_eZCiNLJY',
  sentryDSN: process.env.SENTRY_DSN ?? '',
};

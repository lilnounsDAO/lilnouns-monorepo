export const config = {
  environment: process.env.NODE_ENV || 'development',
  serverPort: Number(process.env.PORT ?? 5001),
  nounsTokenAddress:
    process.env.NOUNS_TOKEN_ADDRESS ?? '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
  jsonRpcUrl: process.env.JSON_RPC_URL ?? 'http://localhost:8545',
  lilNounsJWTSecret: process.env.ACCESS_TOKEN_SECRET || 'lil-nouns-test',
  rollbarApiKey: process.env.ROLLBAR_API_KEY || '',
  nftStorageApiKey:
    process.env.NFT_STORAGE_API_KEY ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1NjA0ZTA0YTkxYzcwOGM0MTU2OGZCRTcwMWVjNzVDY2IyMEM3MDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNDgxNDkxNzE4NCwibmFtZSI6Im5vdW5zIn0.f3D9WFLQv4fNGBivXMtbXiKK0ta_UN5RRS_eZCiNLJY',
  sentryDSN: process.env.SENTRY_DSN ?? '',
};

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.SECRET_KEY || 'secret-key',
    signOptions: process.env.SIGN_OPTIONS || '4h',
  },
  aws: {
    s3Bucket: process.env.AWS_S3_BUCKET || 'testnet-assets',
    s3AccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  apiKey: process.env.X_API_KEY || 'api-key',
  web3: {
    httpUrl: process.env.WEB3_HTTP_URL,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  contracts: {
    heContract: process.env.HE_CONTRACT,
  },
});

export default () => ({
  environment: process.env.NODE_ENV || 'devalopment',
  databse: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 15432,
  },
});

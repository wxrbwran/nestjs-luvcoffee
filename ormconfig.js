module.exports = {
  type: 'postgres',
  host: '103.105.200.216',
  port: 15432,
  username: 'postgres',
  password: '123456',
  database: 'dev',
  // entities: ['**/*.entity.ts'],
  // dist
  entities:
    process.env.NODE_ENV === 'development'
      ? ['**/*.entity.js']
      : ['**/*.entity.ts'],
  synchornize: false,
};

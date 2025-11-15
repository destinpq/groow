const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'groow_user',
  password: 'groow_password',
  database: 'groow_db',
  synchronize: false,
});

async function listUsers() {
  await AppDataSource.initialize();
  
  const result = await AppDataSource.query(
    `SELECT id, email, role, status, "emailVerified", "createdAt", "deletedAt" FROM users ORDER BY "createdAt" DESC LIMIT 10`
  );
  
  console.log('Recent users:', JSON.stringify(result, null, 2));
  
  // Also search for the specific email including soft-deleted
  const specific = await AppDataSource.query(
    `SELECT id, email, role, status, "emailVerified", "createdAt", "deletedAt" FROM users WHERE email LIKE '%khanapurkar%'`
  );
  
  console.log('\nUsers matching khanapurkar:', JSON.stringify(specific, null, 2));
  
  await AppDataSource.destroy();
}

listUsers().catch(console.error);


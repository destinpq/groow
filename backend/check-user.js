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

async function checkUser(email) {
  await AppDataSource.initialize();
  
  const result = await AppDataSource.query(
    `SELECT id, email, role, status, "emailVerified", "createdAt" FROM users WHERE email = $1`,
    [email]
  );
  
  console.log('User found:', JSON.stringify(result, null, 2));
  
  if (result.length > 0 && result[0].status !== 'active') {
    console.log('\nActivating user...');
    const updated = await AppDataSource.query(
      `UPDATE users SET status = 'active', "emailVerified" = true WHERE email = $1 RETURNING id, email, status, "emailVerified"`,
      [email]
    );
    console.log('User activated:', JSON.stringify(updated, null, 2));
  }
  
  await AppDataSource.destroy();
}

const email = process.argv[2] || 'khanapurkarpratik@gmail.com';
checkUser(email).catch(console.error);


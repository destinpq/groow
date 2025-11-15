const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'groow_user',
  password: process.env.DATABASE_PASSWORD || 'groow_password',
  database: process.env.DATABASE_NAME || 'groow_db',
  synchronize: false,
});

async function activateUser(email) {
  await AppDataSource.initialize();
  
  const result = await AppDataSource.query(
    `UPDATE users SET status = 'active', "emailVerified" = true WHERE email = $1 RETURNING id, email, role, status, "emailVerified"`,
    [email]
  );
  
  console.log('User activated:', result);
  await AppDataSource.destroy();
}

const email = process.argv[2] || 'khanapurkarpratik@gmail.com';
activateUser(email).catch(console.error);


const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'groow_user',
  password: 'groow_password',
  database: 'groow_db',
  synchronize: false,
});

async function createUser(email, password, firstName, lastName, role = 'customer') {
  await AppDataSource.initialize();
  
  // Check if user exists
  const existing = await AppDataSource.query(
    `SELECT id, email FROM users WHERE email = $1`,
    [email]
  );
  
  if (existing.length > 0) {
    console.log('User already exists:', existing[0]);
    await AppDataSource.destroy();
    return;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();
  
  // Create user with ACTIVE status
  const result = await AppDataSource.query(
    `INSERT INTO users (id, email, password, "firstName", "lastName", role, status, "emailVerified", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, 'active', true, NOW(), NOW())
     RETURNING id, email, role, status, "emailVerified"`,
    [id, email, hashedPassword, firstName, lastName, role]
  );
  
  console.log('User created:', JSON.stringify(result, null, 2));
  
  await AppDataSource.destroy();
}

const email = process.argv[2] || 'khanapurkarpratik@gmail.com';
const password = process.argv[3] || '12345678';
const firstName = process.argv[4] || 'Pratik';
const lastName = process.argv[5] || 'Khanapurkar';

createUser(email, password, firstName, lastName).catch(console.error);


// Script to insert fresh table data
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function insertTables() {
  try {
    // Clear existing data
    await sql`DELETE FROM order_items`;
    await sql`DELETE FROM orders`;
    await sql`DELETE FROM tables`;
    
    console.log('Cleared existing data');
    
    // Insert fresh table data
    await sql`
      INSERT INTO tables (number, capacity, status, floor, is_active) VALUES
      ('1', 2, 'available', 'Ground Floor', true),
      ('2', 4, 'available', 'Ground Floor', true),
      ('3', 4, 'occupied', 'Ground Floor', true),
      ('4', 6, 'available', 'Ground Floor', true),
      ('5', 2, 'available', 'First Floor', true),
      ('6', 4, 'reserved', 'First Floor', true),
      ('7', 6, 'available', 'First Floor', true),
      ('8', 8, 'cleaning', 'First Floor', true)
    `;
    
    console.log('Inserted fresh table data');
    
    // Verify the data
    const tables = await sql`SELECT * FROM tables ORDER BY id`;
    console.log('Tables in database:', tables.length);
    console.log('Sample table:', tables[0]);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

insertTables();
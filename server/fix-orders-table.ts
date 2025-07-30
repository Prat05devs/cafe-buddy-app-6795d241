// Script to add missing columns to orders table
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function fixOrdersTable() {
  try {
    console.log('Adding missing columns to orders table...');
    
    // Add missing columns
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0`;
    
    console.log('Columns added successfully');
    
    // Verify the table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `;
    
    console.log('Orders table structure:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixOrdersTable();
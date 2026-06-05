import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Seeding admin user...');
    
    // Check if admin already exists
    const existing = await db.select().from(users).where(eq(users.email, 'admin@houseofwisdom.com'));
    if (existing.length > 0) {
        console.log('Admin user already exists. Updating properties...');
        await db.update(users).set({
            role: 'admin',
            isApproved: true
        }).where(eq(users.email, 'admin@houseofwisdom.com'));
        console.log('Admin updated successfully.');
        process.exit(0);
    }
    
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const inserted = await db.insert(users).values({
        name: 'مدير بيت الحكمة (Admin)',
        email: 'admin@houseofwisdom.com',
        password: adminPasswordHash,
        role: 'admin',
        isApproved: true,
        xp: 1000,
        level: 10,
        badges: []
    }).returning();
    
    console.log('Admin user seeded successfully with ID:', inserted[0].id);
    process.exit(0);
}

main().catch(err => {
    console.error('Error seeding admin:', err);
    process.exit(1);
});

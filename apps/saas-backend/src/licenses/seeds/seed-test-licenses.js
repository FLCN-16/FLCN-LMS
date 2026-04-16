"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestLicenses = seedTestLicenses;
const typeorm_1 = require("typeorm");
const license_entity_1 = require("../../master-entities/license.entity");
async function seedTestLicenses() {
    const AppDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.MASTER_DATABASE_URL || process.env.DATABASE_URL,
        entities: ['src/master-entities/*.entity.ts'],
        synchronize: false,
    });
    await AppDataSource.initialize();
    console.log('[Seed] Database connected');
    const licenseRepo = AppDataSource.getRepository(license_entity_1.License);
    const testLicenses = [
        {
            licenseKey: 'TEST-PERPETUAL-001',
            organizationName: 'Test Organization - Perpetual',
            status: 'active',
            isValid: true,
            features: [
                { name: 'live_sessions', enabled: true, limit: 1000 },
                { name: 'advanced_analytics', enabled: true },
            ],
            maxUsers: 5000,
            notes: 'Perpetual test license',
        },
        {
            licenseKey: 'TEST-BASIC-001',
            organizationName: 'Test Organization - Basic',
            status: 'active',
            isValid: true,
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            features: [{ name: 'live_sessions', enabled: true, limit: 100 }],
            maxUsers: 500,
            notes: 'Basic plan',
        },
        {
            licenseKey: 'TEST-EXPIRED-001',
            organizationName: 'Test Organization - Expired',
            status: 'expired',
            isValid: false,
            expiryDate: new Date(new Date().setDate(new Date().getDate() - 30)),
            features: [{ name: 'live_sessions', enabled: true }],
            maxUsers: 1000,
            notes: 'Expired',
        },
    ];
    console.log('[Seed] Creating licenses...');
    for (const licenseData of testLicenses) {
        const existing = await licenseRepo.findOne({
            where: { licenseKey: licenseData.licenseKey },
        });
        if (existing) {
            console.log(`[Seed] Exists: ${licenseData.licenseKey}`);
            continue;
        }
        const license = licenseRepo.create({
            ...licenseData,
            lastVerifiedAt: new Date(),
            verificationCount: 0,
        });
        await licenseRepo.save(license);
        console.log(`[Seed] Created: ${licenseData.licenseKey}`);
    }
    await AppDataSource.destroy();
    console.log('[Seed] Complete');
}
seedTestLicenses().catch((err) => {
    console.error('[Seed] Error:', err);
    process.exit(1);
});

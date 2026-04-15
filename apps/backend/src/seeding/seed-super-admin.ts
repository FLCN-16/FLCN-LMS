import 'reflect-metadata';

import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { License } from '../master-entities/license.entity';
import { Plan } from '../master-entities/plan.entity';
import { SuperAdmin } from '../master-entities/super-admin.entity';

async function hashPassword(password: string): Promise<string> {
  // Use bcrypt with 10 salt rounds (cost factor)
  // This is a proper work factor-based password hashing algorithm
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function seedSaasPlatform() {
  // Read from environment variables
  const databaseUrl =
    process.env.MASTER_DATABASE_URL || process.env.DATABASE_URL;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@flcn.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123456';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'FLCN Administrator';

  if (!databaseUrl) {
    console.error('❌ Error: MASTER_DATABASE_URL or DATABASE_URL is not set');
    console.error('Please configure your .env file');
    process.exit(1);
  }

  console.log('🌱 Seeding SaaS Platform Master Database...\n');

  try {
    const dataSource = new DataSource({
      type: 'postgres',
      url: databaseUrl,
      entities: [SuperAdmin, Plan, License],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();
    console.log('✅ Connected to master database\n');

    // ========== SEED PLANS ==========
    const planRepository = dataSource.getRepository(Plan);

    const defaultPlans = [
      {
        name: 'Starter',
        slug: 'starter',
        description: 'Perfect for getting started',
        monthlyPrice: 29,
        yearlyPrice: 290,
        maxLicenses: 10,
        features: {
          courses: true,
          testSeries: true,
          liveClasses: false,
          analytics: false,
          advancedReporting: false,
        },
      },
      {
        name: 'Professional',
        slug: 'professional',
        description: 'For growing organizations',
        monthlyPrice: 99,
        yearlyPrice: 990,
        maxLicenses: 100,
        features: {
          courses: true,
          testSeries: true,
          liveClasses: true,
          analytics: true,
          advancedReporting: false,
        },
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'For large-scale deployments',
        monthlyPrice: 299,
        yearlyPrice: 2990,
        maxLicenses: 10000,
        features: {
          courses: true,
          testSeries: true,
          liveClasses: true,
          analytics: true,
          advancedReporting: true,
        },
      },
    ];

    let planCount = 0;
    for (const planData of defaultPlans) {
      const existingPlan = await planRepository.findOne({
        where: { name: planData.name },
      });

      if (!existingPlan) {
        const plan = planRepository.create(planData);
        await planRepository.save(plan);
        console.log(`  ✓ Created plan: ${planData.name}`);
        planCount++;
      }
    }

    if (planCount === 0) {
      console.log('  ℹ All default plans already exist\n');
    } else {
      console.log(`\n✅ Created ${planCount} default plans\n`);
    }

    // ========== SEED SUPER ADMIN ==========
    const superAdminRepository = dataSource.getRepository(SuperAdmin);

    const existingAdmin = await superAdminRepository.findOne({
      where: { email: superAdminEmail },
    });

    if (existingAdmin) {
      console.log('ℹ Super admin already exists\n');
    } else {
      const hashedPassword = await hashPassword(superAdminPassword);
      const superAdmin = superAdminRepository.create({
        email: superAdminEmail,
        name: superAdminName,
        hashedPassword,
        isActive: true,
        role: 'super_admin',
      });

      await superAdminRepository.save(superAdmin);
      console.log(`✅ Created super admin: ${superAdminEmail}\n`);
    }

    // ========== SEED DEFAULT LICENSE ==========
    const licenseRepository = dataSource.getRepository(License);

    const existingLicense = await licenseRepository.findOne({
      where: { licenseKey: 'FLCN-TRIAL-001' },
    });

    if (!existingLicense) {
      const trialLicense = licenseRepository.create({
        licenseKey: 'FLCN-TRIAL-001',
        organizationName: 'Trial Organization',
        status: 'active',
        isValid: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        features: {
          courses: true,
          testSeries: true,
          liveClasses: false,
          analytics: false,
        },
        maxUsers: 50,
        verificationCount: 0,
        lastVerifiedAt: undefined,
        notes: 'Default trial license for testing',
      } as any);

      await licenseRepository.save(trialLicense);
      console.log('✅ Created trial license: FLCN-TRIAL-001\n');
    }

    console.log('🎉 Seeding completed successfully!');
    console.log('\nCredentials for first login:');
    console.log(`  Email: ${superAdminEmail}`);
    console.log(`  Password: ${superAdminPassword}`);
    console.log('\n⚠️  Please change these credentials in production!\n');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedSaasPlatform();

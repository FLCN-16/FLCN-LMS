import 'reflect-metadata';

import { createHmac, randomBytes } from 'crypto';
import { DataSource } from 'typeorm';

import { AttemptSection } from '../institutes/attempts/entities/attempt-section.entity';
import { QuestionResponse } from '../institutes/attempts/entities/question-response.entity';
import { TestAttempt } from '../institutes/attempts/entities/test-attempt.entity';
import { TestResult } from '../institutes/attempts/entities/test-result.entity';
import { Institute } from '../master-entities/institute.entity';
import { Category } from '../institutes/courses/entities/category.entity';
import { CourseEnrollment } from '../institutes/courses/entities/course-enrollment.entity';
import { Course } from '../institutes/courses/entities/course.entity';
import { LessonProgress } from '../institutes/courses/entities/lesson-progress.entity';
import { Lesson } from '../institutes/courses/entities/lesson.entity';
import { Module as CourseModule } from '../institutes/courses/entities/module.entity';
import { ExamType } from '../institutes/exam-types/entities/exam-type.entity';
import { Leaderboard } from '../institutes/leaderboard/entities/leaderboard.entity';
import { LiveAttendance } from '../institutes/live-sessions/entities/live-attendance.entity';
import { LiveChatMessage } from '../institutes/live-sessions/entities/live-chat-message.entity';
import { LivePoll } from '../institutes/live-sessions/entities/live-poll.entity';
import { LiveQA } from '../institutes/live-sessions/entities/live-qa.entity';
import { LiveSession } from '../institutes/live-sessions/entities/live-session.entity';
import { QuestionOption } from '../institutes/questions/entities/question-option.entity';
import { Question } from '../institutes/questions/entities/question.entity';
import { TestQuestion } from '../institutes/test-series/entities/test-question.entity';
import { TestSection } from '../institutes/test-series/entities/test-section.entity';
import { TestSeriesEnrollment } from '../institutes/test-series/entities/test-series-enrollment.entity';
import { TestSeries } from '../institutes/test-series/entities/test-series.entity';
import { Test } from '../institutes/test-series/entities/test.entity';
import { User, UserRole } from '../institutes/users/entities/user.entity';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}:${hash}`;
}

async function seedSuperAdmin() {
  // Read from environment variables
  const databaseUrl = process.env.DATABASE_URL;
  const instituteSlug = process.env.TENANT_SLUG || 'default';
  const tenantName = process.env.TENANT_NAME || 'Default Tenant';
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@flcn-lms.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123456';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'System Administrator';

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    console.error('Please configure your .env file with DATABASE_URL');
    process.exit(1);
  }

  // Create a standalone DataSource with all entities
  const AppDataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    entities: [
      Institute,
      User,
      Category,
      Course,
      CourseModule,
      Lesson,
      CourseEnrollment,
      LessonProgress,
      Question,
      QuestionOption,
      TestSeries,
      Test,
      TestSection,
      TestQuestion,
      TestSeriesEnrollment,
      TestAttempt,
      AttemptSection,
      QuestionResponse,
      TestResult,
      Leaderboard,
      ExamType,
      LiveSession,
      LiveChatMessage,
      LiveQA,
      LivePoll,
      LiveAttendance,
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
  });

  try {
    console.log('\n========== FLCN-LMS Database Seeding ==========\n');

    // Initialize the data source
    console.log('📡 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✓ Database connected\n');

    const tenantRepository = AppDataSource.getRepository(Institute);
    const userRepository = AppDataSource.getRepository(User);

    console.log('📋 Configuration:');
    console.log(`   Tenant Slug: ${instituteSlug}`);
    console.log(`   Tenant Name: ${tenantName}`);
    console.log(`   Admin Email: ${superAdminEmail}`);
    console.log(`   Admin Name: ${superAdminName}\n`);

    // Create or get tenant
    let tenant = await tenantRepository.findOne({
      where: { slug: instituteSlug },
    });

    if (!tenant) {
      console.log(`🏢 Creating tenant: ${tenantName}`);
      tenant = tenantRepository.create({
        slug: instituteSlug,
        name: tenantName,
        isActive: true,
      });
      tenant = await tenantRepository.save(tenant);
      console.log(`✓ Tenant created with ID: ${tenant.id}\n`);
    } else {
      console.log(`✓ Tenant already exists: ${tenant.name}\n`);
    }

    // Check if super admin already exists
    let user = await userRepository.findOne({
      where: { email: superAdminEmail, instituteId: tenant.id },
    });

    if (user) {
      console.log(`⚠️  Super admin user already exists`);
      console.log('\n📊 User Details:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}\n`);
    } else {
      // Create super admin user
      console.log('👤 Creating super admin user...');
      const hashedPassword = hashPassword(superAdminPassword);
      user = userRepository.create({
        instituteId: tenant.id,
        name: superAdminName,
        email: superAdminEmail,
        role: UserRole.SUPER_ADMIN,
        hashedPassword,
        isActive: true,
      });

      user = await userRepository.save(user);
      console.log('✓ Super admin user created successfully\n');

      console.log('📊 User Details:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Tenant ID: ${user.instituteId}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}\n`);
    }

    console.log('========== Seeding Complete ==========\n');
    console.log('✅ Super Admin Credentials:');
    console.log(`   Email: ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Tenant ID: ${user.instituteId}`);
    console.log(
      '\n⚠️  Please save these credentials securely. Change the password on first login.',
    );
    console.log('⚠️  Never commit passwords to version control.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (error.message.includes('ECONNREFUSED')) {
        console.error(
          '\n💡 Hint: Make sure PostgreSQL is running and DATABASE_URL is correct',
        );
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Execute
void seedSuperAdmin();

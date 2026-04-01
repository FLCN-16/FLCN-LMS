import { Injectable, NotFoundException } from '@nestjs/common';

import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import { CreateTestSeriesDto } from './dto/create-test-series.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { TestQuestion } from './entities/test-question.entity';
import { TestSection } from './entities/test-section.entity';
import { TestSeriesEnrollment } from './entities/test-series-enrollment.entity';
import { TestSeries } from './entities/test-series.entity';
import { ResultMode, Test } from './entities/test.entity';

@Injectable()
export class TestSeriesService {
  constructor(private instituteContext: InstituteContext) {}

  // --- Test Series ---

  async createSeries(
    userId: string,
    dto: CreateTestSeriesDto,
  ): Promise<TestSeries> {
    const seriesRepo = this.instituteContext.getRepository(TestSeries);
    const instituteId = this.instituteContext.getInstituteId();

    const series = seriesRepo.create({
      ...dto,
      instituteId,
      createdById: userId,
      thumbnailUrl: dto.thumbnail,
    } as any);

    return (await seriesRepo.save(series)) as unknown as TestSeries;
  }

  async findAllSeries(): Promise<TestSeries[]> {
    const seriesRepo = this.instituteContext.getRepository(TestSeries);
    return (await seriesRepo.find({
      order: { createdAt: 'DESC' },
    })) as unknown as TestSeries[];
  }

  async findOneSeries(id: string): Promise<TestSeries> {
    const seriesRepo = this.instituteContext.getRepository(TestSeries);
    const series = await seriesRepo.findOne({
      where: { id },
      relations: ['tests'],
    });

    if (!series) {
      throw new NotFoundException('Test series not found');
    }

    return series as TestSeries;
  }

  async updateSeries(
    id: string,
    dto: Partial<CreateTestSeriesDto>,
  ): Promise<TestSeries> {
    const series = await this.findOneSeries(id);
    const seriesRepo = this.instituteContext.getRepository(TestSeries);

    Object.assign(series, {
      ...dto,
      thumbnailUrl: dto.thumbnail,
    });
    return (await seriesRepo.save(series)) as unknown as TestSeries;
  }

  async publishSeries(id: string): Promise<TestSeries> {
    const series = await this.findOneSeries(id);
    const seriesRepo = this.instituteContext.getRepository(TestSeries);

    series.isPublished = true;
    return (await seriesRepo.save(series)) as unknown as TestSeries;
  }

  async removeSeries(id: string): Promise<void> {
    const series = await this.findOneSeries(id);
    const seriesRepo = this.instituteContext.getRepository(TestSeries);

    await seriesRepo.remove(series);
  }

  // --- Tests ---

  async createTest(
    seriesId: string,
    dto: CreateTestDto,
  ): Promise<Test> {
    const series = await this.findOneSeries(seriesId);
    const testRepo = this.instituteContext.getRepository(Test);
    const sectionRepo = this.instituteContext.getRepository(TestSection);
    const testQuestionRepo = this.instituteContext.getRepository(TestQuestion);

    const test = testRepo.create({
      ...dto,
      testSeriesId: series.id,
      showResultAfter: dto.showResultAfter ?? ResultMode.INSTANT,
    } as Partial<Test>) as Test;

    if (dto.sections?.length) {
      test.sections = dto.sections.map((sectionDto) => {
        const section = sectionRepo.create({
          title: sectionDto.title,
          description: sectionDto.description,
          order: sectionDto.order,
          totalQuestions: sectionDto.totalQuestions,
          maxAttemptable: sectionDto.maxAttemptable,
          durationMins: sectionDto.durationMins,
        } as Partial<TestSection>) as TestSection;

        if (sectionDto.questionIds?.length) {
          section.testQuestions = sectionDto.questionIds.map(
            (questionId, idx) =>
              testQuestionRepo.create({
                questionId,
                order: idx,
              } as Partial<TestQuestion>) as TestQuestion,
          );
        }

        return section;
      });
    }

    const saved = await testRepo.save(test);
    const seriesRepo = this.instituteContext.getRepository(TestSeries);
    await seriesRepo.increment({ id: seriesId }, 'totalTests', 1);
    return (saved as unknown) as Test;
  }

  async findAllTests(seriesId: string): Promise<Test[]> {
    await this.findOneSeries(seriesId);
    const testRepo = this.instituteContext.getRepository(Test);

    return (await testRepo.find({
      where: { testSeriesId: seriesId },
      order: { order: 'ASC' },
    })) as unknown as Test[];
  }

  async findOneTest(
    seriesId: string,
    testId: string,
  ): Promise<Test> {
    await this.findOneSeries(seriesId);
    const testRepo = this.instituteContext.getRepository(Test);

    const test = await testRepo.findOne({
      where: { id: testId, testSeriesId: seriesId },
      relations: ['sections', 'sections.testQuestions'],
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test as Test;
  }

  async updateTest(
    seriesId: string,
    testId: string,
    dto: Partial<CreateTestDto>,
  ): Promise<Test> {
    const test = await this.findOneTest(seriesId, testId);
    const testRepo = this.instituteContext.getRepository(Test);

    Object.assign(test, dto);
    if (dto.showResultAfter) {
      test.showResultAfter = dto.showResultAfter;
    }
    return (await testRepo.save(test)) as unknown as Test;
  }

  async publishTest(
    seriesId: string,
    testId: string,
  ): Promise<Test> {
    const test = await this.findOneTest(seriesId, testId);
    const testRepo = this.instituteContext.getRepository(Test);

    test.isPublished = true;
    return (await testRepo.save(test)) as unknown as Test;
  }

  // --- Enrollments ---

  async enroll(
    seriesId: string,
    userId: string,
    paymentId?: string,
  ): Promise<TestSeriesEnrollment> {
    await this.findOneSeries(seriesId);
    const enrollmentRepo = this.instituteContext.getRepository(
      TestSeriesEnrollment,
    );

    const existing = await enrollmentRepo.findOne({
      where: { testSeriesId: seriesId, userId },
    });

    if (existing) {
      return existing as TestSeriesEnrollment;
    }

    const enrollment = enrollmentRepo.create({
      testSeriesId: seriesId,
      userId,
      paymentId,
    } as any);

    return (await enrollmentRepo.save(enrollment)) as unknown as TestSeriesEnrollment;
  }

  async getEnrollments(
    seriesId: string,
  ): Promise<TestSeriesEnrollment[]> {
    await this.findOneSeries(seriesId);
    const enrollmentRepo = this.instituteContext.getRepository(
      TestSeriesEnrollment,
    );

    return (await enrollmentRepo.find({
      where: { testSeriesId: seriesId },
      order: { enrolledAt: 'DESC' },
    })) as unknown as TestSeriesEnrollment[];
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestSeries } from './entities/test-series.entity';
import { Test } from './entities/test.entity';
import { TestSection } from './entities/test-section.entity';
import { TestQuestion } from './entities/test-question.entity';
import { TestSeriesEnrollment } from './entities/test-series-enrollment.entity';
import { CreateTestSeriesDto } from './dto/create-test-series.dto';
import { CreateTestDto } from './dto/create-test.dto';

@Injectable()
export class TestSeriesService {
  constructor(
    @InjectRepository(TestSeries)
    private readonly seriesRepo: Repository<TestSeries>,
    @InjectRepository(Test)
    private readonly testRepo: Repository<Test>,
    @InjectRepository(TestSection)
    private readonly sectionRepo: Repository<TestSection>,
    @InjectRepository(TestQuestion)
    private readonly testQuestionRepo: Repository<TestQuestion>,
    @InjectRepository(TestSeriesEnrollment)
    private readonly enrollmentRepo: Repository<TestSeriesEnrollment>,
  ) {}

  // --- Test Series ---

  async createSeries(tenantId: string, userId: string, dto: CreateTestSeriesDto): Promise<TestSeries> {
    const series = this.seriesRepo.create({ ...dto, tenantId, createdBy: userId });
    return this.seriesRepo.save(series);
  }

  async findAllSeries(tenantId: string): Promise<TestSeries[]> {
    return this.seriesRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async findOneSeries(tenantId: string, id: string): Promise<TestSeries> {
    const series = await this.seriesRepo.findOne({
      where: { id, tenantId },
      relations: ['tests'],
    });
    if (!series) throw new NotFoundException('Test series not found');
    return series;
  }

  async updateSeries(tenantId: string, id: string, dto: Partial<CreateTestSeriesDto>): Promise<TestSeries> {
    const series = await this.findOneSeries(tenantId, id);
    Object.assign(series, dto);
    return this.seriesRepo.save(series);
  }

  async publishSeries(tenantId: string, id: string): Promise<TestSeries> {
    const series = await this.findOneSeries(tenantId, id);
    series.isPublished = true;
    return this.seriesRepo.save(series);
  }

  async removeSeries(tenantId: string, id: string): Promise<void> {
    const series = await this.findOneSeries(tenantId, id);
    await this.seriesRepo.remove(series);
  }

  // --- Tests ---

  async createTest(tenantId: string, seriesId: string, dto: CreateTestDto): Promise<Test> {
    const series = await this.findOneSeries(tenantId, seriesId);
    const test = this.testRepo.create({ ...dto, testSeriesId: series.id });

    if (dto.sections?.length) {
      test.sections = dto.sections.map((s) => {
        const section = this.sectionRepo.create({
          title: s.title,
          description: s.description,
          order: s.order,
          totalQuestions: s.totalQuestions,
          maxAttemptable: s.maxAttemptable,
          durationMins: s.durationMins,
        });
        if (s.questionIds?.length) {
          section.testQuestions = s.questionIds.map((qId, idx) =>
            this.testQuestionRepo.create({ questionId: qId, order: idx }),
          );
        }
        return section;
      });
    }

    const saved = await this.testRepo.save(test);
    await this.seriesRepo.increment({ id: seriesId }, 'totalTests', 1);
    return saved;
  }

  async findAllTests(tenantId: string, seriesId: string): Promise<Test[]> {
    await this.findOneSeries(tenantId, seriesId);
    return this.testRepo.find({
      where: { testSeriesId: seriesId },
      order: { order: 'ASC' },
    });
  }

  async findOneTest(tenantId: string, seriesId: string, testId: string): Promise<Test> {
    await this.findOneSeries(tenantId, seriesId);
    const test = await this.testRepo.findOne({
      where: { id: testId, testSeriesId: seriesId },
      relations: ['sections', 'sections.testQuestions'],
    });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async updateTest(tenantId: string, seriesId: string, testId: string, dto: Partial<CreateTestDto>): Promise<Test> {
    const test = await this.findOneTest(tenantId, seriesId, testId);
    Object.assign(test, dto);
    return this.testRepo.save(test);
  }

  async publishTest(tenantId: string, seriesId: string, testId: string): Promise<Test> {
    const test = await this.findOneTest(tenantId, seriesId, testId);
    test.isPublished = true;
    return this.testRepo.save(test);
  }

  // --- Enrollments ---

  async enroll(tenantId: string, seriesId: string, userId: string, paymentId?: string): Promise<TestSeriesEnrollment> {
    await this.findOneSeries(tenantId, seriesId);
    const enrollment = this.enrollmentRepo.create({ testSeriesId: seriesId, userId, paymentId });
    return this.enrollmentRepo.save(enrollment);
  }

  async getEnrollments(tenantId: string, seriesId: string): Promise<TestSeriesEnrollment[]> {
    await this.findOneSeries(tenantId, seriesId);
    return this.enrollmentRepo.find({ where: { testSeriesId: seriesId } });
  }
}

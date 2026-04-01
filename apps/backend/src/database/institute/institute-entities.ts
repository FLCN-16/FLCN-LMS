import { AttemptSection } from '../../institutes/attempts/entities/attempt-section.entity';
import { QuestionResponse } from '../../institutes/attempts/entities/question-response.entity';
import { TestAttempt } from '../../institutes/attempts/entities/test-attempt.entity';
import { TestResult } from '../../institutes/attempts/entities/test-result.entity';
import { Category } from '../../institutes/courses/entities/category.entity';
import { CourseEnrollment } from '../../institutes/courses/entities/course-enrollment.entity';
import { Course } from '../../institutes/courses/entities/course.entity';
import { LessonProgress } from '../../institutes/courses/entities/lesson-progress.entity';
import { Lesson } from '../../institutes/courses/entities/lesson.entity';
import { Module as CourseModule } from '../../institutes/courses/entities/module.entity';
import { ExamType } from '../../institutes/exam-types/entities/exam-type.entity';
import { Leaderboard } from '../../institutes/leaderboard/entities/leaderboard.entity';
import { LiveAttendance } from '../../institutes/live-sessions/entities/live-attendance.entity';
import { LiveChatMessage } from '../../institutes/live-sessions/entities/live-chat-message.entity';
import { LivePoll } from '../../institutes/live-sessions/entities/live-poll.entity';
import { LiveQA } from '../../institutes/live-sessions/entities/live-qa.entity';
import { LiveSession } from '../../institutes/live-sessions/entities/live-session.entity';
import { QuestionOption } from '../../institutes/questions/entities/question-option.entity';
import { Question } from '../../institutes/questions/entities/question.entity';
import { TestQuestion } from '../../institutes/test-series/entities/test-question.entity';
import { TestSection } from '../../institutes/test-series/entities/test-section.entity';
import { TestSeriesEnrollment } from '../../institutes/test-series/entities/test-series-enrollment.entity';
import { TestSeries } from '../../institutes/test-series/entities/test-series.entity';
import { Test } from '../../institutes/test-series/entities/test.entity';
import { User } from '../../institutes/users/entities/user.entity';

/**
 * All entities that belong to an institute's specific database.
 * These are used by InstituteConnectionManager to switch databases dynamically.
 */
export const INSTITUTE_ENTITIES = [
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
];

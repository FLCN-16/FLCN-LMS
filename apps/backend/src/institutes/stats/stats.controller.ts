import { Controller, Get } from '@nestjs/common';

import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getStats() {
    const [studentCount, instructorCount, courseCount] = await Promise.all([
      this.usersService.countByRole(UserRole.STUDENT),
      this.usersService.countByRole(UserRole.INSTRUCTOR),
      this.coursesService.findAllCourses().then(courses => courses.length),
    ]);

    // For now, return mock/basic data for recent enrollments and sessions
    // until those services are fully implemented with specialized query methods
    return {
      counts: {
        students: studentCount,
        instructor: instructorCount,
        courses: courseCount,
        activeSessions: 0, // Placeholder
      },
      todaySessions: 0, // Placeholder
      recentEnrollments: [], // Placeholder
    };
  }
}

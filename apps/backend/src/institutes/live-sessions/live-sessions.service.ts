import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import { LiveSession } from './entities/live-session.entity';
import { LiveChatMessage } from './entities/live-chat-message.entity';
import { LiveQA } from './entities/live-qa.entity';
import { LivePoll } from './entities/live-poll.entity';
import { LiveAttendance } from './entities/live-attendance.entity';

/**
 * LiveSessionsService
 *
 * Handles business logic for live teaching sessions including:
 * - Session CRUD operations
 * - Chat message management
 * - Q&A handling
 * - Poll creation and management
 * - Attendance tracking
 *
 * Uses InstituteContext to access the current institute's database.
 */
@Injectable()
export class LiveSessionsService {
  private readonly logger = new Logger(LiveSessionsService.name);

  constructor(private readonly instituteContext: InstituteContext) {}

  /**
   * Get all live sessions for the current institute
   *
   * @param options - Query options (limit, offset, filters)
   * @returns Array of live sessions
   */
  async getAllSessions(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    try {
      const repo = this.instituteContext.getRepository(LiveSession);
      const query = repo.createQueryBuilder('session');

      if (options?.status) {
        query.where('session.status = :status', { status: options.status });
      }

      if (options?.limit) {
        query.take(options.limit);
      }

      if (options?.offset) {
        query.skip(options.offset);
      }

      const sessions = await query.getMany();
      this.logger.debug(`Retrieved ${sessions.length} live sessions`);
      return sessions;
    } catch (error) {
      this.logger.error(`Failed to get all sessions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a specific live session by ID
   *
   * @param id - Live session ID
   * @returns Live session details
   */
  async getSessionById(id: string) {
    try {
      const repo = this.instituteContext.getRepository(LiveSession);
      const session = await repo.findOne({
        where: { id },
        relations: ['instructor', 'course'],
      });

      if (!session) {
        this.logger.warn(`Live session not found: ${id}`);
        return null;
      }

      return session;
    } catch (error) {
      this.logger.error(`Failed to get session ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new live session
   *
   * @param createSessionDto - Session creation data
   * @returns Created live session
   */
  async createSession(createSessionDto: any) {
    try {
      const repo = this.instituteContext.getRepository(LiveSession);
      const session = repo.create(createSessionDto as Partial<LiveSession>) as LiveSession;
      const saved = await repo.save(session);
      this.logger.log(`Created live session: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create session: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a live session
   *
   * @param id - Live session ID
   * @param updateSessionDto - Session update data
   * @returns Updated live session
   */
  async updateSession(id: string, updateSessionDto: any) {
    try {
      const repo = this.instituteContext.getRepository(LiveSession);
      await repo.update(id, updateSessionDto);
      this.logger.log(`Updated live session: ${id}`);
      return await this.getSessionById(id);
    } catch (error) {
      this.logger.error(
        `Failed to update session ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Delete a live session
   *
   * @param id - Live session ID
   * @returns Deletion result
   */
  async deleteSession(id: string) {
    try {
      const repo = this.instituteContext.getRepository(LiveSession);
      const result = await repo.delete(id);
      this.logger.log(`Deleted live session: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete session ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all chat messages for a live session
   *
   * @param sessionId - Live session ID
   * @param options - Query options (limit, offset)
   * @returns Array of chat messages
   */
  async getSessionChat(
    sessionId: string,
    options?: { limit?: number; offset?: number },
  ) {
    try {
      const repo = this.instituteContext.getRepository(LiveChatMessage);
      const query = repo.createQueryBuilder('message').where(
        'message.sessionId = :sessionId',
        { sessionId },
      );

      if (options?.limit) {
        query.take(options.limit);
      }

      if (options?.offset) {
        query.skip(options.offset);
      }

      const messages = await query.getMany();
      this.logger.debug(`Retrieved ${messages.length} chat messages for session ${sessionId}`);
      return messages;
    } catch (error) {
      this.logger.error(
        `Failed to get chat for session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Add a chat message to a live session
   *
   * @param sessionId - Live session ID
   * @param createMessageDto - Chat message data
   * @returns Created chat message
   */
  async addChatMessage(sessionId: string, createMessageDto: any) {
    try {
      const repo = this.instituteContext.getRepository(LiveChatMessage);
      const message = repo.create({
        ...createMessageDto,
        sessionId,
      });
      const saved = await repo.save(message);
      this.logger.log(`Added chat message to session ${sessionId}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `Failed to add chat message to session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get all Q&A for a live session
   *
   * @param sessionId - Live session ID
   * @param options - Query options (limit, offset)
   * @returns Array of Q&A items
   */
  async getSessionQA(
    sessionId: string,
    options?: { limit?: number; offset?: number },
  ) {
    try {
      const repo = this.instituteContext.getRepository(LiveQA);
      const query = repo.createQueryBuilder('qa').where(
        'qa.sessionId = :sessionId',
        { sessionId },
      );

      if (options?.limit) {
        query.take(options.limit);
      }

      if (options?.offset) {
        query.skip(options.offset);
      }

      const qaItems = await query.getMany();
      this.logger.debug(`Retrieved ${qaItems.length} Q&A items for session ${sessionId}`);
      return qaItems;
    } catch (error) {
      this.logger.error(
        `Failed to get Q&A for session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Add a Q&A to a live session
   *
   * @param sessionId - Live session ID
   * @param createQADto - Q&A data
   * @returns Created Q&A
   */
  async addQA(sessionId: string, createQADto: any) {
    try {
      const repo = this.instituteContext.getRepository(LiveQA);
      const qa = repo.create({
        ...createQADto,
        sessionId,
      });
      const saved = await repo.save(qa);
      this.logger.log(`Added Q&A to session ${sessionId}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `Failed to add Q&A to session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get all polls for a live session
   *
   * @param sessionId - Live session ID
   * @returns Array of polls
   */
  async getSessionPolls(sessionId: string) {
    try {
      const repo = this.instituteContext.getRepository(LivePoll);
      const polls = await repo.find({
        where: { sessionId },
      });
      this.logger.debug(`Retrieved ${polls.length} polls for session ${sessionId}`);
      return polls;
    } catch (error) {
      this.logger.error(
        `Failed to get polls for session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Create a poll for a live session
   *
   * @param sessionId - Live session ID
   * @param createPollDto - Poll data
   * @returns Created poll
   */
  async createPoll(sessionId: string, createPollDto: any) {
    try {
      const repo = this.instituteContext.getRepository(LivePoll);
      const poll = repo.create({
        ...createPollDto,
        sessionId,
      });
      const saved = await repo.save(poll);
      this.logger.log(`Created poll for session ${sessionId}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `Failed to create poll for session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get attendance records for a live session
   *
   * @param sessionId - Live session ID
   * @param options - Query options (limit, offset)
   * @returns Array of attendance records
   */
  async getSessionAttendance(
    sessionId: string,
    options?: { limit?: number; offset?: number },
  ) {
    try {
      const repo = this.instituteContext.getRepository(LiveAttendance);
      const query = repo.createQueryBuilder('attendance').where(
        'attendance.sessionId = :sessionId',
        { sessionId },
      );

      if (options?.limit) {
        query.take(options.limit);
      }

      if (options?.offset) {
        query.skip(options.offset);
      }

      const attendance = await query.getMany();
      this.logger.debug(`Retrieved ${attendance.length} attendance records for session ${sessionId}`);
      return attendance;
    } catch (error) {
      this.logger.error(
        `Failed to get attendance for session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Record attendance for a user in a live session
   *
   * @param sessionId - Live session ID
   * @param createAttendanceDto - Attendance data
   * @returns Created attendance record
   */
  async recordAttendance(sessionId: string, createAttendanceDto: any) {
    try {
      const repo = this.instituteContext.getRepository(LiveAttendance);
      const attendance = repo.create({
        ...createAttendanceDto,
        sessionId,
      });
      const saved = await repo.save(attendance);
      this.logger.log(`Recorded attendance for session ${sessionId}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `Failed to record attendance for session ${sessionId}: ${error.message}`,
      );
      throw error;
    }
  }
}

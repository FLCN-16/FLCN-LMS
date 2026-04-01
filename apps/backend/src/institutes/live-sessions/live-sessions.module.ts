import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LiveAttendance } from './entities/live-attendance.entity';
import { LiveChatMessage } from './entities/live-chat-message.entity';
import { LivePoll } from './entities/live-poll.entity';
import { LiveQA } from './entities/live-qa.entity';
import { LiveSession } from './entities/live-session.entity';
import { LiveSessionsController } from './live-sessions.controller';
import { LiveSessionsService } from './live-sessions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LiveSession,
      LiveChatMessage,
      LiveQA,
      LivePoll,
      LiveAttendance,
    ]),
  ],
  controllers: [LiveSessionsController],
  providers: [LiveSessionsService],
  exports: [LiveSessionsService],
})
export class LiveSessionsModule {}

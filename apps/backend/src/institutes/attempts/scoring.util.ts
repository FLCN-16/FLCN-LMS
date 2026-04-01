import type { QuestionType } from '@flcn-lms/types/questions';

import { Question } from '../questions/entities/question.entity';
import { QuestionResponse } from './entities/question-response.entity';

export interface ScoredResponse {
  questionId: string;
  isCorrect: boolean;
  marksAwarded: number;
}

export function scoreResponses(
  responses: QuestionResponse[],
  questions: Question[],
): ScoredResponse[] {
  return responses.map((res) => {
    const q = questions.find((question) => question.id === res.questionId);
    if (!q)
      return { questionId: res.questionId, isCorrect: false, marksAwarded: 0 };

    const posMarks = Number(q.positiveMarks);
    const negMarks = Number(q.negativeMarks);

    if (q.type === ('MCQ' satisfies QuestionType)) {
      const correctOption = q.options.find((option) => option.isCorrect);
      const isCorrect =
        !!correctOption && res.selectedOptionIds?.[0] === correctOption.id;
      return {
        questionId: q.id,
        isCorrect,
        marksAwarded: isCorrect
          ? posMarks
          : res.selectedOptionIds?.length
            ? -negMarks
            : 0,
      };
    }

    if (q.type === ('MSQ' satisfies QuestionType)) {
      const correctIds = q.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id);
      const selected = res.selectedOptionIds ?? [];
      const isFullyCorrect =
        correctIds.length === selected.length &&
        correctIds.every((id) => selected.includes(id));
      return {
        questionId: q.id,
        isCorrect: isFullyCorrect,
        marksAwarded: isFullyCorrect ? posMarks : 0,
      };
    }

    if (q.type === ('INTEGER' satisfies QuestionType)) {
      const isCorrect =
        res.integerAnswer != null &&
        q.correctInteger != null &&
        res.integerAnswer === Number(q.correctInteger);
      return {
        questionId: q.id,
        isCorrect,
        marksAwarded: isCorrect ? posMarks : 0,
      };
    }

    // SUBJECTIVE — manual grading, no auto-score
    return { questionId: q.id, isCorrect: false, marksAwarded: 0 };
  });
}

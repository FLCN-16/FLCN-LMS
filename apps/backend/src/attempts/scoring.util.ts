import { Question, QuestionType } from '../questions/entities/question.entity';
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
    const q = questions.find((q) => q.id === res.questionId);
    if (!q)
      return { questionId: res.questionId, isCorrect: false, marksAwarded: 0 };

    const posMarks = q.positiveMarks;
    const negMarks = q.negativeMarks;

    if (q.type === QuestionType.MCQ) {
      const correctOption = q.options.find((o) => o.isCorrect);
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

    if (q.type === QuestionType.MSQ) {
      const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
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

    if (q.type === QuestionType.INTEGER) {
      const isCorrect =
        res.integerAnswer !== null && res.integerAnswer === q.correctInteger;
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

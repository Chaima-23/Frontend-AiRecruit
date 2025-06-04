import { QuestionModel } from './question.model';

export interface McqModel extends QuestionModel {
  options: string;
  timeLimit: number;

}

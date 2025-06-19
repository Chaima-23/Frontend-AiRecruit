import {QuestionModel} from './question.model';

export interface TestModel {
  id: string;
  title: string;
  questions: QuestionModel[];
}

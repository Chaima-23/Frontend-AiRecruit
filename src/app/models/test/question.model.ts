import { QuestionType } from './question-type.enum';
import { TestModel } from './test.model';

export interface QuestionModel {
  id: string;
  content: string;
  type: QuestionType;
  options: string[];
  correctOptions: number[];
  test?: TestModel;
}

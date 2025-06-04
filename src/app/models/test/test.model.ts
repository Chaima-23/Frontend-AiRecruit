import { TestStatus } from './test-status.enum';
import { QuestionModel } from './question.model';

export interface TestModel {
  id: string;
  timing: Date;
  status: TestStatus;
  questions: QuestionModel[];


}

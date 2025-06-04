import { QuestionModel} from './question.model';

export interface TechnicalProbModel extends QuestionModel {
  maxSubmissions: number;
  problemStatement: string;


}

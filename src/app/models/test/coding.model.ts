import { QuestionModel } from './question.model';

export interface CodingModel extends QuestionModel{
  programmingLanguage: string;
  timeLimit: number;


}

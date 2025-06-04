import { CandidateModel } from '../idm/candidate.model';
import { TestModel } from './test.model';

export interface EvaluationModel {
  id: string;
  feedback: string;
  maxScore: number;
  score: number;
  candidate: CandidateModel;
  test: TestModel;

}

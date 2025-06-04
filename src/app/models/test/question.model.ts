import { DifficultyLevel } from './difficulty-level.enum';

export interface QuestionModel {
  id: string;
  difficultyLevel: DifficultyLevel;
  field: string;

}

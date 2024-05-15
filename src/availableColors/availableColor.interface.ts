import { ColorInterface } from '../colors/color.interface';
import { ModelInterface } from '../utils/interfaces/model.interface';

export interface AvailableColorInterface {
  id: string;
  image: string;
  name: string;
  color: ColorInterface;
  model: ModelInterface;
  createdAt: Date;
}

export interface DeleteAvailableColorInterface {
  id: string;
  name: string;
}

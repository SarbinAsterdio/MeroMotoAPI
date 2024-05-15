import { Doors, SeatingCapacity } from '../common/variant.enum';

export interface DimensionAndCapacityInterface {
  id: string;
  length: number | null;
  width: number | null;
  height: number | null;
  bootSpace: number | null;
  seatingCapacity: SeatingCapacity | null;
  groundClearance: number | null;
  noOfDoors: Doors | null;
  fuelCapacity: number | null;
  saddleHeight: number | null;
  wheelbase: number | null;
  kerbWeight: number | null;
  loadCarryingCapacity: number | null;
  createdAt: Date;
  updatedAt: Date;
}

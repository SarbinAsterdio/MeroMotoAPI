export interface InteriorInterface {
  id: string;
  electronicMultiTripmeter: boolean | null;
  leatherSeats: boolean | null;
  fabricUpholstery: boolean | null;
  leatherSteeringWheel: boolean | null;
  gloveCompartment: boolean | null;
  digitalOdometer: boolean | null;
  digitalClock: boolean | null;
  heightAdjustableDriverSeat: boolean | null;
  dualToneDashboard: boolean | null;
  images: Array<string> | null;
  additionalFeatures: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

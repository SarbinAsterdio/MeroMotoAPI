import { Speakers } from '../common/variant.enum';

export interface EntertainmentAndCommunicationInterface {
  id: string;
  radio: boolean | null;
  speakersFront: boolean | null;
  speakersRear: boolean | null;
  externalSpeakers: boolean | null;
  integrated2DINAudio: boolean | null;
  usbAndAuxiliaryInput: boolean | null;
  bluetoothConnectivity: boolean | null;
  touchScreen: boolean | null;
  touchScreenSize: number | null;
  connectivity: boolean | null;
  androidAuto: boolean | null;
  appleCarPlay: boolean | null;
  noOfSpeakers: Speakers | null;
  additionalFeatures: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

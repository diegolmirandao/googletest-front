import { MAcquisitionChannel } from 'src/models/customer/acquisitionChannel';

export interface IAcquisitionChannelState {
  acquisitionChannels: MAcquisitionChannel[];
  currentAcquisitionChannel: MAcquisitionChannel | undefined;
};
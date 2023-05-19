import { IAcquisitionChannelState } from '../../interfaces/customer/redux/acquisitionChannelState';
import { createAction, createSlice } from '@reduxjs/toolkit'
import { getAcquisitionChannelsAction, addAcquisitionChannelAction, updateAcquisitionChannelAction, deleteAcquisitionChannelAction } from '../actions/acquisitionChannel'
import { MAcquisitionChannel } from 'src/models/customer/acquisitionChannel';
import { IAcquisitionChannel } from 'src/interfaces/customer/acquisitionChannel';

const initialState: IAcquisitionChannelState = {
    acquisitionChannels: [],
    currentAcquisitionChannel: undefined
}

const slice = createSlice({
    initialState,
    name: 'acquisitionChannel',
    reducers: {
        setCurrentAcquisitionChannel(state, action) {
            state.currentAcquisitionChannel = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IAcquisitionChannel[]>('acquisitionChannel/get'), (state, action) => {
            const acquisitionChannels = action.payload.map((acquisitionChannel) => new MAcquisitionChannel(acquisitionChannel));
            state.acquisitionChannels = acquisitionChannels;
        })
        builder.addCase(getAcquisitionChannelsAction.fulfilled, (state, action) => {
            const acquisitionChannels = action.payload.map((acquisitionChannel) => new MAcquisitionChannel(acquisitionChannel));
            state.acquisitionChannels = acquisitionChannels;
        })
        builder.addCase(addAcquisitionChannelAction.fulfilled, (state, action) => {
            const acquisitionChannel = new MAcquisitionChannel(action.payload);
            state.acquisitionChannels = [acquisitionChannel, ...state.acquisitionChannels];
            state.currentAcquisitionChannel = acquisitionChannel;
        })
        builder.addCase(updateAcquisitionChannelAction.fulfilled, (state, action) => {
            const updatePayload = new MAcquisitionChannel(action.payload);
            state.acquisitionChannels = state.acquisitionChannels.map(acquisitionChannel => acquisitionChannel.id == updatePayload.id ? updatePayload : acquisitionChannel);
            state.currentAcquisitionChannel = updatePayload;
        })
        builder.addCase(deleteAcquisitionChannelAction.fulfilled, (state, action) => {
            const deletePayload = new MAcquisitionChannel(action.payload);
            state.acquisitionChannels = state.acquisitionChannels.filter(acquisitionChannel => acquisitionChannel.id !== deletePayload.id);
        })
    },
})

export const { setCurrentAcquisitionChannel } = slice.actions

export default slice
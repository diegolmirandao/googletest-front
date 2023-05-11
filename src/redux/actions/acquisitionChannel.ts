import { IAcquisitionChannel } from 'src/interfaces/customer/acquisitionChannel';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IAddUpdateAcquisitionChannel } from 'src/interfaces/customer/addUpdateAcquisitionChannel';

export const getAcquisitionChannelsAction = createAsyncThunk(
    'acquisitionChannel/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: acquisitionChannelResponse}: AxiosResponse<IAcquisitionChannel[]> = await axios.get(`/acquisition-channels`);

            return acquisitionChannelResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addAcquisitionChannelAction = createAsyncThunk(
    'acquisitionChannel/add',
    async (addData: IAddUpdateAcquisitionChannel, {rejectWithValue}) => {
        try {
            const {data: acquisitionChannelResponse}: AxiosResponse<IAcquisitionChannel> = await axios.post('/acquisition-channels', addData);

            return acquisitionChannelResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateAcquisitionChannelAction = createAsyncThunk(
    'acquisitionChannel/update',
    async (updateData: IAddUpdateAcquisitionChannel, {getState, rejectWithValue}) => {
        try {
            const { acquisitionChannelReducer: { currentAcquisitionChannel } } = getState() as RootState;
            const {data: acquisitionChannelResponse}: AxiosResponse<IAcquisitionChannel> = await axios.put(`/acquisition-channels/${currentAcquisitionChannel?.id}`, updateData);

            return acquisitionChannelResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteAcquisitionChannelAction = createAsyncThunk(
    'acquisitionChannel/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { acquisitionChannelReducer: { currentAcquisitionChannel } } = getState() as RootState;
            const {data: acquisitionChannelResponse}: AxiosResponse<IAcquisitionChannel> = await axios.delete(`/acquisition-channels/${currentAcquisitionChannel?.id}`);

            return acquisitionChannelResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);
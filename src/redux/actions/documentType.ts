import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from 'src/config/axios';
import { RootState } from '..';
import { IDocumentType } from 'src/interfaces/document-type/documentType';
import { IAddUpdateDocumentType } from 'src/interfaces/document-type/addUpdate';

export const getDocumentTypesAction = createAsyncThunk(
    'documentType/get',
    async (_: void, {rejectWithValue}) => {
        try {
            const {data: documentTypeResponse}: AxiosResponse<IDocumentType[]> = await axios.get(`/document-types`);

            return documentTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const addDocumentTypeAction = createAsyncThunk(
    'documentType/add',
    async (addData: IAddUpdateDocumentType, {rejectWithValue}) => {
        try {
            const {data: documentTypeResponse}: AxiosResponse<IDocumentType> = await axios.post('/document-types', addData);

            return documentTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const updateDocumentTypeAction = createAsyncThunk(
    'documentType/update',
    async (updateData: IAddUpdateDocumentType, {getState, rejectWithValue}) => {
        try {
            const { documentTypeReducer: { currentDocumentType } } = getState() as RootState;
            const {data: documentTypeResponse}: AxiosResponse<IDocumentType> = await axios.put(`/document-types/${currentDocumentType?.id}`, updateData);

            return documentTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const deleteDocumentTypeAction = createAsyncThunk(
    'documentType/delete',
    async (_: void, {getState, rejectWithValue}) => {
        try {
            const { documentTypeReducer: { currentDocumentType } } = getState() as RootState;
            const {data: documentTypeResponse}: AxiosResponse<IDocumentType> = await axios.delete(`/document-types/${currentDocumentType?.id}`);

            return documentTypeResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);
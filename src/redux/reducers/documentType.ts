import { createAction, createSlice } from '@reduxjs/toolkit'
import { getDocumentTypesAction, addDocumentTypeAction, updateDocumentTypeAction, deleteDocumentTypeAction } from '../actions/documentType'
import { MDocumentType } from 'src/models/documentType';
import { IDocumentTypeState } from 'src/interfaces/document-type/redux/documentTypeState';
import { IDocumentType } from 'src/interfaces/document-type/documentType';

const initialState: IDocumentTypeState = {
    documentTypes: [],
    currentDocumentType: undefined
}

const slice = createSlice({
    initialState,
    name: 'documentType',
    reducers: {
        setCurrentDocumentType(state, action) {
            state.currentDocumentType = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(createAction<IDocumentType[]>('documentType/get'), (state, action) => {
            const documentTypes = action.payload.map((documentType) => new MDocumentType(documentType));
            state.documentTypes = documentTypes;
        })
        builder.addCase(getDocumentTypesAction.fulfilled, (state, action) => {
            const documentTypes = action.payload.map((documentType) => new MDocumentType(documentType));
            state.documentTypes = documentTypes;
        })
        builder.addCase(addDocumentTypeAction.fulfilled, (state, action) => {
            const documentType = new MDocumentType(action.payload);
            state.documentTypes = [documentType, ...state.documentTypes];
            state.currentDocumentType = documentType;
        })
        builder.addCase(updateDocumentTypeAction.fulfilled, (state, action) => {
            const updatePayload = new MDocumentType(action.payload);
            state.documentTypes = state.documentTypes.map(documentType => documentType.id == updatePayload.id ? updatePayload : documentType);
            state.currentDocumentType = updatePayload;
        })
        builder.addCase(deleteDocumentTypeAction.fulfilled, (state, action) => {
            const deletePayload = new MDocumentType(action.payload);
            state.documentTypes = state.documentTypes.filter(documentType => documentType.id !== deletePayload.id);
        })
    },
})

export const { setCurrentDocumentType } = slice.actions

export default slice
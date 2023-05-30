import ITenantState from 'src/interfaces/tenantState';
import { createSlice } from '@reduxjs/toolkit'
import { getTenantAction } from '../actions/tenant';

const initialState: ITenantState = {
    tenantInitialized: false,
    tenantDomain: null,
    tenantId: null
}

const slice = createSlice({
    initialState,
    name: 'tenant',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getTenantAction.fulfilled, (state, action) => {
            state.tenantDomain = action.payload.domain;
            state.tenantId = action.payload.tenant_id;
            state.tenantInitialized = true
        })
    }
})

export default slice
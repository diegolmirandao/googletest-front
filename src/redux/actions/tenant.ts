import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import axios from '../../config/axios';

type Tenant = {
    domain: string
    tenant_id: string
}

export const getTenantAction = createAsyncThunk(
    'tenant/get',
    async (tenantDomain: string , {rejectWithValue}) => {
        try {
            const {data: tenantResponse}: AxiosResponse<Tenant> = await axios.get(`/api/identify-tenant/${tenantDomain}`);

            return tenantResponse;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);
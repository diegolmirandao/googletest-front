import { IRoleState } from '../../interfaces/user/redux/roleState';
import { createSlice, createAction } from '@reduxjs/toolkit'
import { MRole } from 'src/models/user/role';
import { IRole } from 'src/interfaces/user/role';

const initialState: IRoleState = {
    roles: []
}

const slice = createSlice({
    initialState,
    name: 'role',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(createAction<IRole[]>('role/get'), (state, action) => {
            const roles = action.payload.map((role) => new MRole(role));
            state.roles = roles
        })
    }
})

export default slice
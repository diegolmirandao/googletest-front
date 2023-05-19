import { createAction, createSlice } from '@reduxjs/toolkit';
import { ICountryState } from 'src/interfaces/location/redux/countryState';
import { ICountry } from 'src/interfaces/location/country';
import { MCountry } from 'src/models/location/country';

const initialState: ICountryState = {
    countries: []
}

const slice = createSlice({
    initialState,
    name: 'country',
    reducers: {},
    extraReducers(builder) {
        builder.addCase(createAction<ICountry[]>('country/get'), (state, action) => {
            const countries = action.payload.map((country) => new MCountry(country));
            state.countries = countries;
        })
    },
})

export const {  } = slice.actions;

export default slice;
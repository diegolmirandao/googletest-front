import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
  
const PercentageFormat = forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                    name: props.name,
                    value: values.value,
                    },
                });
            }}
            allowLeadingZeros={false}
            valueIsNumericString
        />
        );
    },
);

const PercentageInput = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            onFocus={(event) => event.target.select()}
            inputProps={{
                sx: { textAlign: 'right'}
            }}
            InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                inputComponent: PercentageFormat as any
            }}
        />
    );
};

export default PercentageInput;
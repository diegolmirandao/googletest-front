import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";
import { NumberFormatBase, NumericFormatProps } from 'react-number-format';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
  
const DecimalPercentageFormat = forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
        <NumberFormatBase
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
            format={(val) => String(Number(val) * 100)}
            removeFormatting={(val) => String(Number(val) / 100)}
        />
        );
    },
);

const DecimalPercentageInput = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            onFocus={(event) => event.target.select()}
            inputProps={{
                sx: { textAlign: 'right'}
            }}
            InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                inputComponent: DecimalPercentageFormat as any
            }}
        />
    );
};

export default DecimalPercentageInput;
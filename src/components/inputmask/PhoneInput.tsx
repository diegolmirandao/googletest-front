import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";
import { PatternFormat, NumericFormatProps } from 'react-number-format';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
  
const PhoneFormat = forwardRef<NumericFormatProps, CustomProps>(
    function PatternFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
        <PatternFormat
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
            format="+5959########"
            mask={"_"}
        />
        );
    },
);

const PhoneInput = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            placeholder="+5959________"
            InputProps={{
                inputComponent: PhoneFormat as any
            }}
        />
    );
};

export default PhoneInput;
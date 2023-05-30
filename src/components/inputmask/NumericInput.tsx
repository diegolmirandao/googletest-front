import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";
import { NumberFormatBase, NumericFormatProps } from 'react-number-format';
import { MMeasurementUnit } from "src/models/product/measurementUnit";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
  
const NumericAltFormat = forwardRef<NumericFormatProps, CustomProps>(
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
            format={(value) => String(Number(value))}
            valueIsNumericString
        />
        );
    },
);
  
type IProps = TextFieldProps & {
    measurementUnit?: MMeasurementUnit;
};

const NumericInput = (props: IProps) => {
    const { measurementUnit, ...others} = props;
    return (
        <TextField
            {...others}
            onFocus={(event) => event.target.select()}
            inputProps={{
                sx: { textAlign: 'right'}
            }}
            InputProps={{
                endAdornment: <InputAdornment position='end'>{measurementUnit?.abbreviation}</InputAdornment>,
                inputComponent: NumericAltFormat as any
            }}
        />
    );
};

export default NumericInput;
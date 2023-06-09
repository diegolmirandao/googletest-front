import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { MCurrency } from "src/models/currency";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
  
const CurrencyFormat = forwardRef<NumericFormatProps, CustomProps>(
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
            decimalScale={0}
            valueIsNumericString
            thousandSeparator
            fixedDecimalScale
        />
        );
    },
);
  
type IProps = TextFieldProps & {
    currency?: MCurrency;
};

const CurrencyInput = (props: IProps) => {
    const { currency, ...others} = props;
    return (
        <TextField
            {...others}
            onFocus={(event) => event.target.select()}
            inputProps={{
                sx: { textAlign: 'right'}
            }}
            InputProps={{
                endAdornment: <InputAdornment position='end'>{currency?.abbreviation}</InputAdornment>,
                inputComponent: CurrencyFormat as any
            }}
        />
    );
};

export default CurrencyInput;
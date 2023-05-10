import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import './css/input.css';
import './css/main.css';
import { FormHelperText } from '@mui/material';

export const InputTime = ({ time, onChange, timeUnit, startBtnState, inputStyle }) => {
    const [errors, setErrors] = useState('');
    const [maxLength, setMaxLength] = useState(2);

    useEffect(() => {
        if (timeUnit === 'hour') {
            setMaxLength(4);
        } else if (timeUnit === 'msec') {
            setMaxLength(3);
        }
    }, [timeUnit]);

    const onChangeHandler = (value) => {
        let v = value.replace(/[０-９．]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        );
        if (isNaN(Number(v))) {
            setErrors( '数値で入力してください' );
        } else {
            if ((timeUnit === 'min' || timeUnit === 'sec') && Number(v) > 59) {
                v = 59;
            }
            onChange(Number(v), timeUnit);
            setErrors('');
        }
    };

    return (
        <>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1 },
                }}
                noValidate
                autoComplete="off"
                className={inputStyle}
            >
                {errors.length === 0 ?
                    (
                        <FormControl sx={{ m: 1, width: '10ch' }} variant="outlined">
                        <Input
                            fullWidth
                            defaultValue={time}
                            onChange={(e) => onChangeHandler(e.target.value)}
                            endAdornment={<InputAdornment position="end">{timeUnit}</InputAdornment>}
                            inputProps={{
                                'aria-label': 'yen',
                                style: { 'fontSize': '2rem' },
                                maxLength: maxLength
                            }}
                            disabled={startBtnState}
                        />
                        </FormControl>
                    )
                    :
                    (
                        <FormControl error sx={{ m: 1, width: '10ch' }} variant="outlined">
                        <Input
                            fullWidth
                            defaultValue={time}
                            onChange={(e) => onChangeHandler(e.target.value)}
                            endAdornment={<InputAdornment position="end">{timeUnit}</InputAdornment>}
                            inputProps={{
                                'aria-label': 'yen',
                                style: { 'fontSize': '2rem' },
                                maxLength: maxLength
                            }}
                            disabled={startBtnState}
                        />
                        <FormHelperText className='select-time-error' >{errors}</FormHelperText>
                        </FormControl>
                    )
                }
            </Box>
        </>
    );
};

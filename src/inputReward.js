import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import './css/input.css';
import './css/main.css';
import { FormHelperText } from '@mui/material';

export const InputReward = ({ reward, onChange, placeholder, startBtnState }) => {
    const [errors, setErrors] = useState('');

    const onChangeHandler = (value) => {
        const v = value.replace(/[０-９．]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        );
        if (isNaN(Number(v))) {
            setErrors( '数値で入力してください' );
        } else {
            onChange(Number(v));
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
                >
                {errors.length === 0 ?
                    (
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <Input
                            value={reward === 0 ? '' : reward}
                            onChange={(e) => onChangeHandler(e.target.value)}
                            endAdornment={<InputAdornment position="end">えん</InputAdornment>}
                            inputProps={{
                                'aria-label': 'yen',
                                style: { 'fontSize': '2rem' },
                                maxLength: "16"
                            }}
                            disabled={startBtnState}
                        />
                        </FormControl>
                    )
                    :
                    (
                        <FormControl error sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <Input
                            value={reward === 0 ? '' : reward}
                            onChange={(e) => onChangeHandler(e.target.value)}
                            endAdornment={<InputAdornment position="end">えん</InputAdornment>}
                            inputProps={{
                                'aria-label': 'yen',
                                style: { 'fontSize': '2rem' },
                                maxLength: "16"
                            }}
                            disabled={startBtnState}
                        />
                        <FormHelperText className='reward-error' >{errors}</FormHelperText>
                        </FormControl>
                    )
                }
            </Box>
        </>
    );
};

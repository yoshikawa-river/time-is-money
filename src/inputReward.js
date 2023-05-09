import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './css/input.css';

const ariaLabel = { 'aria-label': 'description' };

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
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <OutlinedInput
                        placeholder={placeholder}
                        value={reward === 0 ? '' : reward}
                        onChange={(e) => onChangeHandler(e.target.value)}
                        endAdornment={<InputAdornment position="end">えん</InputAdornment>}
                        inputProps={{
                            'aria-label': 'yen',
                        }}
                        disabled={startBtnState}
                    />
                </FormControl>
            </Box>
            <div>
                {errors.length !== 0 && <p>{errors}</p>}
            </div>
        </>
    );
};

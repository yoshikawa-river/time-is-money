import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import timeismoney_img from './timeismoney_img.png';
import { ReactComponent as Investicon } from "./undraw_investing_re_bov7.svg";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function UsageScrollDialog() {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [isNotDisplay, setIsNotDisplay] = React.useState(false);

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlerChange = () => {
        setIsNotDisplay(!isNotDisplay);
        saveLocalStorage();
    }

    const saveLocalStorage = () => {
        localStorage.setItem('isNotDisplay', !isNotDisplay);
    }

    React.useEffect(() => {
        const data = localStorage.getItem('isNotDisplay');
        const parsedData = JSON.parse(data);
        if (parsedData === null || !parsedData) {
            setOpen(true);
        } else {
            setIsNotDisplay(parsedData);
            setOpen(false);
        }
    }, []);

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);

    return (
        <div className='text-center'>
        <Button onClick={handleClickOpen('paper')} sx={{ fontSize: '2rem' }}>たいむいずまねーとは？</Button>
        {/* <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            maxWidth='xl'
            // fullWidth='true'
            sx={{
                backgroundColor: 'rgb(241 245 249)',
                fontSize: '3rem',
                textAlign: 'center',
            }}
        >
            <DialogTitle
                id="scroll-dialog-title"
            >
                たいむいずまねーとは
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'} sx={{
                    backgroundColor: 'rgb(241 245 249)'
                }}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
            >
                <div className='p-11 text-center'>
                    <h2 className='text-9xl text-orange-400'>
                        時給を決めるのは<br/>あなたの実力
                    </h2>
                    <h1 className='text-6xl py-10'>
                        「たいむいずまねー」は時給・金額計算ツールです。
                    </h1>
                    <div className='flex w-full'>
                        <img className='w-1/5 h-full my-auto' src={timeismoney_img}/>
                        <div className='text-center mx-auto'>
                            <h2 className='text-5xl py-6 pt-20 pb-10 font-bold text-blue-600'>
                                今の案件って、時給換算するといくらなんだろう？
                            </h2>

                            <p className='text-5xl pb-10 font-bold'>
                                のような疑問を解決。
                            </p>
                            <p className='text-5xl pb-20 font-bold'>
                                1秒ごとに時給を計算します。
                            </p>
                        </div>
                        <Investicon className='w-1/5 h-full my-auto'/>
                    </div>
                    <h3 className='text-5xl py-7'>
                        「ほうしゅうがた」は、報酬金額を入力して1秒ごとに時給を計算します
                    </h3>
                    <h3 className='text-5xl pt-4 pb-5'>
                        「じきゅうがた」は、時給単価を入力して1秒ごとに合計金額を計算します
                    </h3>
                    <FormControlLabel
                        control={
                            <Checkbox onChange={handlerChange} checked={isNotDisplay}/>
                        }
                        label="次回から表示しない"
                    />
                </div>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} sx={{ fontSize:'2rem' }}>閉じる</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

import { useEffect, useState } from "react";
import { Money } from "./money";
import { InputReward } from "./inputReward";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import "./css/main.css"
import "./css/stopwatch.css";

export const StopWatch = () => {
    // 報酬額
    const [reward, setReward] = useState(0);
    // 表示タイプ
    const [displayType, setDisplayType] = useState(true);
    // 経過時間（秒）
    const [startTime, setStartTime] = useState(0);
    // 時間の保存
    const [time, setTime] = useState({h:'00', m:'00', s:'00'});
    // ストップウォッチの状態
    const [isRunning, setRunning] = useState(false);
    // 時給計算用経過時間
    const [elapsedTime, setElapsedTime] = useState(0);
    // ボタンの状態
    const [btnDisabled, setDisabled] = useState({start: false, stop: true, reset: false});

    useEffect(() => {
        loadLocalStorage();
    }, []);

    useEffect(() => {
        window.addEventListener('popstate', (e) => {
            saveLocalStorage();
        });

        window.addEventListener('beforeunload', onClickStop);

        return () => {
            window.removeEventListener('beforeunload', onClickStop);
        }
    });

    const saveLocalStorage = () => {
        const data = {
            reward: reward,
            startTime: startTime,
            elapsedTime: elapsedTime,
            time: time
        };

        localStorage.setItem('stopwatch', JSON.stringify(data));
    };

    const deleteLocalStorage = () => {
        localStorage.removeItem('stopwatch');
    };

    const loadLocalStorage = () => {
        const data = localStorage.getItem('stopwatch');
        if (data) {
            const parsedData = JSON.parse(data);
            setStartTime(parsedData.startTime);
            setReward(parsedData.reward);
            setElapsedTime(parsedData.elapsedTime);
            setTime({h:parsedData.time.h ?? '00', m:parsedData.time.m ?? '00', s:parsedData.time.s ?? '00'});
        }
    };

    useEffect(() => {
        let timerInterval;

        if (isRunning) {
            timerInterval = window.setInterval(() => {
                setStartTime(startTime => startTime + 1);
            }, 1000);
        }

        return () => {
            window.clearInterval(timerInterval);
        };

    }, [isRunning]);

    const toText = (time) => {
        return ('00' + time).slice(-2);
    }

    useEffect(() => {
        const hour = parseInt(startTime / 60 / 60, 10);
        const min = parseInt(startTime / 60 % 60, 10);
        const sec = parseInt(startTime % 60, 10);

        setTime({h: toText(hour), m: toText(min), s: toText(sec)});

        const elapsedTime = Number(hour) + Number(min) / 60 + Number(sec) / 3600;
        setElapsedTime(elapsedTime);

    }, [startTime]);

    // const onClickDisplayType = () => {
    //     setDisplayType(!displayType);
    // };

    const onChangeReward = (value) => {
        setReward(value);
        setDisabled({start: false, stop: true, reset: true})
    }

    const onClickStart = () => {
        setStartTime(startTime);
        setRunning(true);
        setDisabled({start: true, stop: false, reset: false})
        saveLocalStorage();
    };

    const onClickStop = () => {
        setRunning(false);
        setDisabled({start: false, stop: true, reset: false});
        saveLocalStorage();
    };

    const onClickReset = () => {
        deleteLocalStorage();
        setRunning(false);
        setStartTime(0);
        setTime({h:'00', m:'00', s:'00'})
        setElapsedTime(0);
        setDisabled({start: false, stop: true, reset: true})
    };

    return (
        <div className="main">
            <div className="main-content">
                {/* <button onChange={onClickDisplayType}>換算方法切替</button> */}
                <InputReward reward={reward} onChange={onChangeReward} placeholder={'報酬金額'} startBtnState={btnDisabled.start}/>
                <Money reward={reward} elapsedTime={elapsedTime} />
                <div className="stopwatch-content">
                    <time className="stopwatch-content__time">{time.h}:{time.m}:{time.s}</time>
                    <Stack direction="row" spacing={2}>
                        <Button className="stopwatch-content__button-left" variant="contained" onClick={onClickStart} disabled={btnDisabled.start}>スタート</Button>
                        <Button variant="contained" onClick={onClickStop} disabled={btnDisabled.stop}>ストップ</Button>
                        <Button className="stopwatch-content__button-right" variant="contained" onClick={onClickReset} disabled={btnDisabled.reset}>リセット</Button>
                    </Stack>
                </div>
            </div>
        </div>
    );
};
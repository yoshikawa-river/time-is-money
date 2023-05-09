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
    // 表示時間
    const [displayTime, setDisplayTime] = useState("00:00:00");
    // 現在の時間からマイナスするためのスタートした時間
    const [startTime, setStartTime] = useState(0);
    // 経過時間
    const [calcTime, setcalcTime] = useState(0);
    // ストップウォッチの状態
    const [isRunning, setRunning] = useState(false);
    // 時給計算用経過時間
    const [elapsedTime, setElapsedTime] = useState(0);
    // ボタンの状態
    const [btnDisabled, setDisabled] = useState({start: false, stop: true, reset: false})

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
            calcTime: calcTime,
            elapsedTime: elapsedTime,
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
            setStartTime(Date.now() - parsedData.calcTime);
            setReward(parsedData.reward);
            setcalcTime(parsedData.calcTime);
            setElapsedTime(parsedData.elapsedTime);
        }
    };

    useEffect(() => {
        let timerInterval;

        if (isRunning) {
            timerInterval = window.setInterval(() => {
                setcalcTime(Date.now() - startTime);
            }, 1000);
        }

        return () => {
            window.clearInterval(timerInterval);
        };

    }, [isRunning]);

    useEffect(() => {
        const currentTime = new Date(calcTime);
        const hour = String(currentTime.getHours() - 8).padStart(2, "0");
        const min = String(currentTime.getMinutes()).padStart(2, "0");
        const sec = String(currentTime.getSeconds()).padStart(2, "0");

        //　ミリ秒表示
        // const msec = String(currentTime.getMilliseconds()).padStart(3, "0");
        // setDisplayTime(`${h}:${m}:${s}:${ms}`);

        setDisplayTime(`${hour}:${min}:${sec}`);

        const elapsedTime = Number(hour) + Number(min) / 60 + Number(sec) / 3600;
        setElapsedTime(elapsedTime);
    }, [calcTime]);

    const onClickDisplayType = () => {
        setDisplayType(!displayType);
    };

    const onChangeReward = (value) => {
        setReward(value);
        setDisabled({start: false, stop: true, reset: true})
    }

    const onClickStart = () => {
        setStartTime(Date.now() - calcTime);
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
        setDisplayTime("00:00:00");
        setcalcTime(0);
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
                    <time className="stopwatch-content__time">{displayTime}</time>
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
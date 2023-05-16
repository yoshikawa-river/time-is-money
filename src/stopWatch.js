import { useEffect, useState } from "react";
import { Money } from "./money";
import { InputReward } from "./inputReward";
import { InputTime } from "./inputTime";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import stopWatchWorker from './stopWatch.worker.js';
import "./css/main.css"
import "./css/stopwatch.css";

let worker;

export const StopWatch = () => {
    // 報酬額
    const [reward, setReward] = useState(0);
    // 表示タイプ
    const [displayType, setDisplayType] = useState(true);
    // 経過時間（秒）
    const [startTime, setStartTime] = useState(0);
    // 時間の保存
    const [time, setTime] = useState({h:'00', m:'00', s:'00', ms:'00'});
    // ストップウォッチの状態
    const [isRunning, setRunning] = useState(false);
    // 時給計算用経過時間
    const [elapsedTime, setElapsedTime] = useState(0);
    // ボタンの状態
    const [btnDisabled, setDisabled] = useState({start: false, stop: true, reset: false});
    // 時間指定の可否
    const [isSelectTime, setSelectTime] = useState(false);
    // worker用
    const type = {start: 'start', stop: 'stop', reset: 'reset'};

    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        loadLocalStorage();
        worker = new stopWatchWorker();

        return () => {
            if (worker) {
                worker.terminate();
                worker = null;
            }
        };
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
            setTime({
                h:parsedData.time.h ?? '00',
                m:parsedData.time.m ?? '00',
                s:parsedData.time.s ?? '00',
                ms:parsedData.time.ms ?? '00'
            });
        }
    };

    useEffect(() => {
        if (isRunning) {
            worker.addEventListener('message', (e) => {
                setStartTime(e.data.startTime);
            });
        }
    }, [isRunning]);

    const toText = (time, unit) => {
        if (unit === 'h') {
            return time;
        }
        return ('00' + time).slice(-2);
    }

    useEffect(() => {
        const hour = parseInt(startTime / 60 / 60, 10);
        const min = parseInt(startTime / 60 % 60, 10);
        const sec = parseInt(startTime % 60, 10);
        const msec = parseInt(startTime * 1000);

        setTime({h: toText(hour, 'h'), m: toText(min, 'm'), s: toText(sec, 's'), ms: toText(msec, 'ms')});

        const elapsedTime = Number(hour) + Number(min) / 60 + Number(sec) / 3600;
        setElapsedTime(elapsedTime);

    }, [startTime]);

    // const onClickDisplayType = () => {
    //     setDisplayType(!displayType);
    // };

    const changeTime = (inputTime, timeUnit) => {
        let timeData = {
            h: time.h,
            m: time.m,
            s: time.s,
            ms: time.ms
        };

        switch (timeUnit) {
            case 'hour':
                timeData.h = inputTime;
                break;
            case 'min':
                timeData.m = inputTime;
                break;
            case 'sec':
                timeData.s = inputTime;
                break;
            default:
                break;
        }

        setTime(timeData);

        const total = Number(timeData.h) * 3600 + Number(timeData.m) * 60 + Number(timeData.s);

        setStartTime(total);
    }

    const changeSelectTime = () => {
        setSelectTime(!isSelectTime);
    }

    const onChangeReward = (value) => {
        setReward(value);
        setDisabled({start: false, stop: true, reset: true})
    }

    const onClickStart = () => {
        setStartTime(startTime);
        setRunning(true);
        saveLocalStorage();

        if (!worker) {
            worker = new stopWatchWorker();
        }

        worker.postMessage({type: type.start, startTime: startTime});

        worker.addEventListener('message', (e) => {
            setTimerId(e.data.timerId);
            setDisabled({start: true, stop: false, reset: false})
        });
    };

    const onClickStop = () => {
        worker.postMessage({type: type.stop, startTime: startTime, timerId: timerId});
        setRunning(false);
        setDisabled({start: false, stop: true, reset: false});
        worker.postMessage({type: type.stop, startTime: startTime, timerId: timerId});
        saveLocalStorage();
    };

    const onClickReset = () => {
        deleteLocalStorage();
        setRunning(false);
        setStartTime(0);
        setTime({h:'00', m:'00', s:'00', ms:'00'});
        setElapsedTime(0);
        setDisabled({start: false, stop: true, reset: true})
        worker.postMessage({type: type.reset, startTime: startTime, timerId: timerId});
        if (worker) {
            worker.terminate();
            worker = null;
        }
    };

    return (
        <>
            <div className="main">
                <div className="main-content">
                    {/* <button onChange={onClickDisplayType}>換算方法切替</button> */}
                    <InputReward reward={reward} onChange={onChangeReward} placeholder={'報酬金額'} startBtnState={btnDisabled.start}/>
                    <Money reward={reward} elapsedTime={elapsedTime} />
                    <div className="stopwatch-content">
                        <div className="stopwatch-content__p">
                            <Switch
                                checked={isSelectTime}
                                onChange={changeSelectTime}
                            />
                            <span className="ml-10">じかんをしていする</span>
                        </div>
                        {
                            isSelectTime && (
                                <Stack direction="row" spacing={2} className="text-center">
                                    <InputTime time={time.h} onChange={changeTime} timeUnit={'hour'} startBtnState={btnDisabled.start} inputStyle="stopwatch-content__button-left" />
                                    <InputTime time={time.m} onChange={changeTime} timeUnit={'min'} startBtnState={btnDisabled.start} />
                                    <InputTime time={time.s} onChange={changeTime} timeUnit={'sec'} startBtnState={btnDisabled.start} inputStyle="stopwatch-content__button-right" />
                                </Stack>
                            )
                        }
                        <time className="stopwatch-content__time">{time.h}:{time.m}:{time.s}</time>
                        <Stack direction="row" spacing={2}>
                            <Button className="stopwatch-content__button-left" variant="contained" onClick={onClickStart} disabled={btnDisabled.start}>スタート</Button>
                            <Button variant="contained" onClick={onClickStop} disabled={btnDisabled.stop}>ストップ</Button>
                            <Button className="stopwatch-content__button-right" variant="contained" onClick={onClickReset} disabled={btnDisabled.reset}>リセット</Button>
                        </Stack>
                    </div>
                </div>
        </div>
        </>
    );
};
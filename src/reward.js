import { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import NumberEasing from 'react-number-easing';
import './css/money.css';
import CountUp from 'react-countup';

export const Reward = ({reward, elapsedTime}) => {
    const [beforeHourlyWage, setBeforeWage] = useState(0);
    const [hourlyWage, setHourlyWage] = useState(0);
    const [isDisplayUnit, setDisplayUnit] = useState(true);

    const units = ['えん', 'まん', 'おく', 'ちょう', 'けい', 'がい', 'じょ', 'じょう', 'こう', 'かん', 'せい', 'さい', 'ごく', 'ごうがしゃ', 'あそぎ', 'なゆた', 'ふかしぎ', 'むりょうたいすう'];

    useEffect(() => {
        if (reward > 0 && elapsedTime > 0) {
            // アニメーション用に経過時間から1秒引いたものの時給も計算しておく
            const beforeHourlyWage = calcHouryWage(elapsedTime  - (1 / 3600));
            setBeforeWage(beforeHourlyWage);

            const houryWage = calcHouryWage(elapsedTime);
            return setHourlyWage(houryWage);
        }

        setHourlyWage(0);
    });

    const calcHouryWage = (time) => {
        return Math.round( (reward / time) * 100 ) / 100;
    }

    const changeDisplayUnit = () => {
        setDisplayUnit(!isDisplayUnit);
    };

    const toCurrency = (amount, type) => {
        if (type === 'reward') {
            return new Intl.NumberFormat().format(amount);
        } else {
            return <CountUp
                        start={beforeHourlyWage}
                        end={amount}
                        duration={1}
                        separator=","
                        decimals={2}
                        decimal="."
                    />;
        }
    }

    const toJapaneseYen = (amount, type) => {
        let displayWage = '';
        let unitsIndex = 0;
        // 下4桁ずつ単位を振っていき、下の桁数が4桁未満になるまでループを回す
        while (amount >= 10000) {
            let remainder = Math.round( (amount % 10000) * 100 ) / 100;

            if (type === 'reward') {
                // 報酬額表示の場合は0の桁は飛ばす。
                if (remainder === 0) {
                    amount /= 10000;
                    unitsIndex++;
                    continue;
                }

                displayWage =
                    <>
                        <div className="flex">
                            <div className="display-reward-content">
                                {Math.floor(remainder)}
                            </div>
                            <div className="reward-unit-font">{units[unitsIndex]}</div>{displayWage}
                        </div>
                </>

                amount /= 10000;
                unitsIndex++;

                continue;
            }

            amount /= 10000;

            let decimals = 2;
            if (unitsIndex !== 0) {
                decimals = 0;
                remainder = Math.floor(remainder);
            }

            const style = `display-hourlywage-content-${unitsIndex} display-hourlywage-content`

            displayWage =
                    <>
                        <div className="flex">
                            <div className={style}>
                                <NumberEasing
                                    value={remainder}
                                    speed={1000}
                                    decimals={decimals}
                                    ease='linear'
                                />
                            </div>
                            <div className="unit-font">{units[unitsIndex]}</div>{displayWage}
                        </div>
                    </>;
            unitsIndex++;
        }

        if (type === 'reward') {
            displayWage =
                <>
                    <div className="flex  display-reward-container">
                        <div className="display-reward-content">
                            {Math.floor(amount)}
                        </div>
                        <div className="reward-unit-font">{units[unitsIndex]}</div>{displayWage}
                    </div>
                </>
        } else {
            const style = `display-hourlywage-content-${unitsIndex} display-hourlywage-content`
            let decimals = 2;
            if (unitsIndex !== 0) {
                decimals = 0;
                amount = Math.floor(amount);
            }

            // 最後の桁を追加
            displayWage =
                    <>
                        <div className="flex">
                            <div className={style}>
                                <NumberEasing
                                    value={amount}
                                    speed={1000}
                                    decimals={decimals}
                                    ease='linear'
                                />
                            </div>
                            <div className="unit-font">{units[unitsIndex]}</div>{displayWage}
                        </div>
                    </>;
        }

        return displayWage;
    }

    return (
        <div>
            <div className="money-content__p">
                ほうしゅう
                <span className="display-reward-container flex">
                    {isDisplayUnit ? toJapaneseYen(reward, 'reward') : toCurrency(reward, 'reward')}
                    {/* <span className="unit-font">
                        えん
                    </span> */}
                </span>
            </div>
            <div className="money-content__p">
                じきゅう
                <div className="display-hourlywage-container flex">
                    {isDisplayUnit ? toJapaneseYen(hourlyWage, 'wage') : toCurrency(hourlyWage, 'wage')}
                    {/* <span className="unit-font">
                        えん
                    </span> */}
                </div>
            </div>
            <div className="money-content__p">
                <Switch
                    checked={isDisplayUnit}
                    onChange={changeDisplayUnit}
                />
                <span className="ml-10">にほんえんひょうじ</span>
            </div>
        </div>
    );
}
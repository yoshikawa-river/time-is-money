import { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import NumberEasing from 'react-number-easing';
import './css/money.css';
import CountUp from 'react-countup';

export const Money = ({reward, elapsedTime}) => {
    const [beforeHourlyWage, setBeforeWage] = useState(0);
    const [hourlyWage, setHourlyWage] = useState(0);
    const [isDisplayUnit, setDisplayUnit] = useState(true);

    const units = ['', 'まん', 'おく', '兆', '京', '垓', '𥝱', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];

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
                        duration={0.5}
                        separator=","
                        decimals={2}
                        decimal="."
                    />;
        }
    }

    const toJapaneseYen = (amount) => {
        if (amount < 10000) {
            return amount;
        }

        let displayWage = '';
        let unitsIndex = 0;
        // 下4桁ずつ単位を振っていき、下の桁数が4桁未満になるまでループを回す
        while (amount >= 10000) {
            let remainder = Math.round( (amount % 10000) * 100 ) / 100;
            if (remainder === 0) {
                // 割り切れる場合は単位を増やして次のループへ
                amount /= 10000;
                unitsIndex++;
                continue;
            }

            displayWage =
                    <>
                        <NumberEasing
                            value={remainder}
                            speed={500}
                            decimals={2}
                            ease='expoInOut'
                        />
                        <span className="unit-font">{units[unitsIndex]}</span>{displayWage}
                    </>;
            amount /= 10000;
            unitsIndex++;
        }

        // 最後の桁を追加
        displayWage =
                <>
                    <NumberEasing
                        value={Math.floor(amount)}
                        speed={500}
                        ease='elasticIn'
                    />
                    <span className="unit-font">{units[unitsIndex]}</span>{displayWage}
                </>;

        return displayWage;
    }

    return (
        <div>
            <p className="money-content__p">
                ほうしゅう：
                <span className="display-reward-font">
                    {isDisplayUnit ? toJapaneseYen(reward) : toCurrency(reward, 'reward')}
                    <span className="unit-font">
                        えん
                    </span>
                </span>
            </p>
            <p className="money-content__p">
                じきゅう：
                <span className="display-hourlywage-font">
                    {isDisplayUnit ? toJapaneseYen(hourlyWage) : toCurrency(hourlyWage, 'wage')}
                    <span className="unit-font">
                        えん
                    </span>
                </span>
            </p>
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
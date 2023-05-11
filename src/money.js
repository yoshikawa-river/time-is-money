import { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import NumberEasing from 'react-number-easing';
import './css/money.css';

export const Money = ({reward, elapsedTime}) => {
    const [hourlyWage, setHourlyWage] = useState(0);
    const [isDisplayUnit, setDisplayUnit] = useState(true);

    const units = ['', 'まん', 'おく', '兆', '京', '垓', '𥝱', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];

    useEffect(() => {
        if (reward > 0 && elapsedTime > 0) {
            const houryWage = Math.round( (reward / elapsedTime) * 100 ) / 100;
            return setHourlyWage(houryWage);
        }

        setHourlyWage(0);
    });

    const changeDisplayUnit = () => {
        setDisplayUnit(!isDisplayUnit);
    };

    const toCurrency = (amount) => {
        // console.log(amount);

        return <NumberEasing
                    value={amount}
                    thousandSeparator={true}
                    thousandsGroupStyle="thousand"
                    speed={500}
                    decimals={2}
                    ease='circInOut'
                />;
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
                    {isDisplayUnit ? toJapaneseYen(reward) : toCurrency(reward)}
                    <span className="unit-font">
                        えん
                    </span>
                </span>
            </p>
            <p className="money-content__p">
                じきゅう：
                <span className="display-hourlywage-font">
                    {isDisplayUnit ? toJapaneseYen(hourlyWage) : toCurrency(hourlyWage)}
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
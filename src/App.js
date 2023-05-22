import logo from './logo.svg';
import './App.css';
import {RewardStopWatch} from './rewardStopWatch';
import Header from './header';
import { useState } from 'react';

function App() {
    const [type, setType] = useState(0);

    const changeType = (value) => {
        setType(value);
    }

    return (
        <>
            <Header onChange={changeType} />
            {
                type === 0 ? (
                    <RewardStopWatch />
                )
                :
                (
                    <></>
                )
            }
        </>
    );
}

export default App;

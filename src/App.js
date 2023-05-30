import logo from './logo.svg';
import './App.css';
import {RewardStopWatch} from './rewardStopWatch';
import {WageStopWatch} from './wageStopWatch';
import Header from './header';
import { useState } from 'react';
import UsageScrollDialog from './usage';

function App() {
    const [type, setType] = useState(0);

    const changeType = (value) => {
        setType(value);
    }

    return (
        <>
            <Header onChange={changeType} />
            <UsageScrollDialog/>
            {
                type === 0 ? (
                    <RewardStopWatch />
                )
                :
                (
                    <WageStopWatch />
                )
            }
            <div className='cp-write'>
                <p>© 2023 Y.Y. All rights reserved.</p>
            </div>
        </>
    );
}

export default App;

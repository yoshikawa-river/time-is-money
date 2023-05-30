import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './css/header.css';

export default function Header({onChange}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <Box sx={{ width: '100%' }} className="header-container" >
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
        >
            <Tab
                style={{ 'fontSize': '2rem', 'width': '50%', 'fontWeight': 'bold', 'marginLeft':'auto', 'fontFamily': 'Darumadrop One, cursive' }}
                value={0}
                label="ほうしゅうがた"
            />
            <Tab
                style={{ 'fontSize': '2rem', 'width': '50%', 'fontWeight': 'bold', 'marginRight':'auto', 'fontFamily': 'Darumadrop One, cursive'}}
                value={1}
                label="じきゅうがた"
            />
        </Tabs>
        </Box>
    );
}
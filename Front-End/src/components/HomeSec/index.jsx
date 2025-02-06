import 'primeicons/primeicons.css';
import { useUserContext } from '../../providers/UserContext';
import Header from '../Header/index.jsx'
import { useEffect, useState } from 'react';
import FormSec from '../Sections/FormSec/index.jsx';
import ListTasks from '../Sections/ListTasks/index.jsx';
import { Button } from '../ui/button.tsx';


function HomeSec() {




    return (
        <>
            <Header />
            <main className="container main">
                <FormSec />
                <ListTasks />
            </main>
        </>
    )
}
export default HomeSec
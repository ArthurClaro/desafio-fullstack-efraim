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
                {/* <div className="p-5 space-y-2 bg-gray-100">
                    <Button>Click me</Button>
                </div> */}
                <FormSec />
                <ListTasks />
            </main>
        </>
    )
}
export default HomeSec
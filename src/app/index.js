import styles from './assets/sass/main.scss';

import React from 'react';
import { render } from 'react-dom';

import { Header } from './components/Header';
import { ProgrammeList } from './components/programme-list';
import database from './database';

class App extends React.Component {
    render(){
        return (
            <div className="app-container">
                <Header/>
                <main className="main-container"> 
                    <h1>Hello!</h1>
                    <ProgrammeList/>
                </main>
                
            </div>
        );
    }

    componentDidMount(){
        console.log('Mounted main component');
        //TODO: Fetch the data and store in local db

        fetch("https://www.op.ac.nz/api/v1/ProgrammeInformationPage.json", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            }
        })
        .then(response => response.json())
        .then(response => database.storeToDatabase(response));

    }
}

render(<App/>, document.getElementById('app'));
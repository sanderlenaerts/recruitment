import React from 'react';

import { Header } from './components/Header';
import { ProgrammeContainer } from './components/programme-container';
import { ProgrammeList } from './components/programme-list';

import database from './database';

import { Switch, Route } from 'react-router-dom'

export class Layout extends React.Component {
    render(){
        return (
            <div className="app-container">
                <Header/>
                <main className="main-container">
                    <Switch>
                        <Route exact path="/" component={ProgrammeList}/>
                        <Route path='/programmes' component={ProgrammeContainer}/>
                    </Switch>
                </main>
            </div>
        );
    }

    componentDidMount(){

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
import React from 'react';

import { Header } from './components/Header';
import { ProgrammeContainer } from './components/programme-container';
import { ProgrammeList } from './components/programme-list';
import { StudyOptionContainer } from './components/study-option-container';
import { StudyOptionList } from './components/study-option-list';

import database from './database';

import { Switch, Route } from 'react-router-dom'

export class Layout extends React.Component {
    render(){
        return (
            <div className="app-container">
                <Header/>
                <main className="main-container">
                    <Switch>
                        <Route path='/options' component={StudyOptionContainer}/>
                        <Route exact path="/" component={StudyOptionList}/>
                    </Switch>
                </main>
            </div>
        );
    }

    componentWillMount(){
        database.init();
    }
}
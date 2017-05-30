import React from 'react';

import { Header } from './components/Header';
import { ProgrammeContainer } from './components/programme-container';
import { ProgrammeList } from './components/programme-list';
import { StudyOptionContainer } from './components/study-option-container';
import { StudyOptionList } from './components/study-option-list';
import { Contact } from './components/contact';
import { NotFound } from './components/not-found';

import database from './services/database';

import { Switch, Route } from 'react-router-dom'

export class Layout extends React.Component {
    render(){
        return (
            <div className="app-container">
                <Header/>
                <main className="main-container">
                    <Switch>
                        <Route exact path="/" component={StudyOptionList}/>
                        <Route exact path="/contact" component={Contact}/>
                        <Route path='/options' component={StudyOptionContainer}/>
                        <Route component={NotFound}/>
                    </Switch>
                </main>
            </div>
        );
    }

    componentWillMount(){
        database.init();
    }
}
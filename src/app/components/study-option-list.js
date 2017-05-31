import React from 'react';
import dexie from 'dexie';

import { StudyOption } from './study-option';

import { Route, Switch } from 'react-router-dom';

import database from '../services/database';

export class StudyOptionList extends React.Component {
    constructor(){
        super();
        this.state = {
            items: []
        }

    }

    render(){
        let options = [];

        this.state.items.forEach(function(option, index){
            options.push(<StudyOption option={option} key={index} />);
        })

        return(
            <div>
                <h1>Study Options</h1>
                <div className="options-container">
                    { options }
                </div>
            </div>
            
        );
    }

     componentDidMount(){
        database.getStudyAreas()
            .then((data) => {
                this.setState({
                    items: data
                })
            }, (error) => {
                console.log(error);
            })
    }

}
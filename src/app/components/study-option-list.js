import React from 'react';
import dexie from 'dexie';

import { StudyOption } from './study-option';

import { Route, Switch } from 'react-router-dom';

import database from '../database';

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
            console.log("Looping", option);
            options.push(<StudyOption option={option} key={index} />);
            console.log(options);
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
         // TODO: Replace the id
        database.getStudyAreas()
            .then((data) => {
                this.setState({
                    items: data
                })
            }, function(error){
                database.fetchStudyAreas()
                    .then((data) => {
                        database.getStudyAreas().then((data => {
                            this.setState({
                                items: data
                            })
                        }))
                    })
            }.bind(this))
    }

}
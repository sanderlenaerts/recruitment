import React from 'react';
import dexie from 'dexie';

import { StudyOption } from './study-option';

import { Route, Switch } from 'react-router-dom';

import database from '../services/database';

import { toast } from 'react-toastify';

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
                    { options.length > 0 ? options: <h3>No content found</h3> }
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
                toast(<h3>No study options were found</h3>, {
                    type: 'error',
                    hideProgressBar: true,
                    position: toast.POSITION.TOP_RIGHT
                });
            })
    }

}
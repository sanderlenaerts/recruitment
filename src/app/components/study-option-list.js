import React from 'react';
import dexie from 'dexie';

import { StudyOption } from './study-option';

import { Route, Switch } from 'react-router-dom';

import { database } from '../services/database';

import { toast } from 'react-toastify';

import db from '../services/db';

export class StudyOptionList extends React.Component {
    constructor(){
        super();
        this.state = {
            items: []
        }

    }

    render(){
        let options = [];

        // Loop over all the study options and push a component for each option
        this.state.items.forEach(function(option, index){
            console.log(option.IPadHidden === "0");
            if (option.IPadHidden === "0"){
                options.push(<StudyOption option={option} key={index} />);
            }
        })

        options.sort((a, b) => {
            let nameA = a.props.option.Title.toLowerCase(), nameB=b.props.option.Title.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
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
         // On mount we need to get all the study options and set them in state

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
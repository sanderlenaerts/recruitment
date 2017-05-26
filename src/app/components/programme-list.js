import React from 'react';
import { Programme } from './programme';
import { ProgrammeFilter } from './programme-filter';
import { ProgrammeDetails } from './programme-details';

import database from '../database';

import { Route, Switch } from 'react-router-dom';


export class ProgrammeList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            type: 'Choose',
            id: this.props.match.params.snumber
        }

        console.log(this.props);

        this.sendFilter = this.sendFilter.bind(this);
    }

    render(){
        let programmes = [];
        let option = this.props.match.params.snumber;

        if (this.state.type == 'Choose'){
            this.state.items.forEach(function(programme, index){
                programmes.push(<Programme option={option} programme={programme} key={index} />);
            })
        }
        else {
        this.state.items
            .filter((programme) => {
                return programme.type == this.state.type
            })
            .forEach(function(programme, index){
                programmes.push(<Programme programme={programme} key={index} />);
            })
        }
        


        return(
            <div>
                <Route exact path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/> 
                <h1>Study option programmes</h1>
                <ProgrammeFilter sendFilter={this.sendFilter} />
                <div id="list">
                    { programmes }
                </div>
                <div id="info">

                </div>
            </div>
            
        );
    }

    sendFilter(data){
        console.log('Filter received: ', data);
        this.setState({
            type: data
        })
        console.log('Filter changed: ', this.state)
    }

    componentDidMount(){
         // TODO: Replace the id
        let id = this.state.id;
        database.getProgrammes(id)
            .then((data) => {
                this.setState({
                    items: data
                })
            }, function(error){
                database.fetchProgrammes(id)
                    .then((data) => {
                        database.getProgrammes(id).then((data => {
                            this.setState({
                                items: data
                            })
                        }))
                    })
            }.bind(this))
    }


}
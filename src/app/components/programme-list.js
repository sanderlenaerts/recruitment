import React from 'react';
import { Programme } from './programme';
import { ProgrammeFilter } from './programme-filter';
import { ProgrammeDetails } from './programme-details';

import database from '../services/database';

import { Route, Switch, Link } from 'react-router-dom';

import { toast } from 'react-toastify';


export class ProgrammeList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            type: 'Choose',
            id: this.props.match.params.snumber,
            option: {}
        }


        this.sendFilter = this.sendFilter.bind(this);
    }

    render(){
        let programmes = [];
        let inner = null;
        let current = this;

        if (this.state.type == 'Choose'){
            this.state.items.forEach(function(programme, index){
                programmes.push(<Programme option={current.state.id} programme={programme} key={index} />);
            })
        }
        else {
        this.state.items
            .filter((programme) => {
                return programme.Type == this.state.type
            })
            .forEach(function(programme, index){
                programmes.push(<Programme option={current.state.option} programme={programme} key={index} />);
            })
        }



        if (programmes.length == 0){ 
            inner = <h3>There are no programmes under these criteria</h3>
        }
        else {
            inner = <div id="list">{ programmes }</div>
        }

        return(
            <div>
                <Link to={`/options`}>
                    <div className="backbutton">
                        <img src="/app/assets/images/back-button.png" />
                    </div>
                </Link>
                <Route exact path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/> 
                <h1>{this.state.option? this.state.option.Title || 'Programme Options' : 'Programme Options'}</h1>
                <ProgrammeFilter sendFilter={this.sendFilter} />
                { inner }
            </div>
            
        );
    }

    sendFilter(data){
        this.setState({
            type: data
        })
    }

    componentDidMount(){
        let id = this.state.id;
    

        database.getProgrammes(id)
            .then((items) => {
                console.log('PROGRAMMES', items);
                this.setState({
                    items: items
                })

                 database
                    .getStudyArea(id)
                    .then((area) => {
                        this.setState({
                            option: area
                        })
                    }, (error) => {
                        toast(<h3>Study area was not found</h3>, {
                            type: 'error',
                            hideProgressBar: true,
                            position: toast.POSITION.TOP_RIGHT
                        });
                    })

            }, (error) => {
                toast(<h3>No programmes were found</h3>, {
                    type: 'error',
                    hideProgressBar: true,
                    position: toast.POSITION.TOP_RIGHT
                });
            })

       
    }


}
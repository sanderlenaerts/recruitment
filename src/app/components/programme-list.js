import React from 'react';
import { Programme } from './programme';
import { ProgrammeFilter } from './programme-filter';
import { ProgrammeDetails } from './programme-details';

import database from '../services/database';
import selection from '../services/selection';

import { Route, Switch, Link } from 'react-router-dom';

import { toast } from 'react-toastify';

import PubSub  from 'pubsub-js';


export class ProgrammeList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            type: 'Choose',
            id: this.props.match.params.snumber,
            option: {},
            length: 0
        }

        // Need to bind the filter to the current state
        this.sendFilter = this.sendFilter.bind(this);
        this.limitedLength = this.limitedLength.bind(this);
    }

    render(){
        let programmes = [];
        let inner = null;
        let current = this;

        // If no type in the filter was selected, we show all the programmes under that study option
        // For every programme we push a 'Programme' component with some properties that will be used
        if (this.state.type == 'Choose'){
            this.state.items.forEach(function(programme, index){
                programmes.push(<Programme length={current.state.length} limitedLength={current.limitedLength} option={current.state.id} programme={programme} key={index} />);
            })
        }
        else {
            // If there has been a type selected we will filter out only those with the correct type
            // Push a programme component for each filtered item
            // React will rerender when state changes
            this.state.items
                .filter((programme) => {
                    return programme.Type == this.state.type
                })
                .forEach(function(programme, index){
                    programmes.push(<Programme length={current.state.length} limitedLength={current.limitedLength} option={current.state.option} programme={programme} key={index} />);
                })
        }


        // If there are no programmes, we need to let the user know there is not content 
        if (programmes.length == 0){ 
            inner = <h3>There are no programmes under these criteria</h3>
        }
        else {
            // Else whe show the list of (filtered) programmes
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

    // Method that accepts the event from the filter (dropdown) child £
    // Changes a state variable so a rerender will happen
    sendFilter(data){
        this.setState({
            type: data
        })
    }

    limitedLength(length){
        console.log('Event caught: ', length)
        this.setState({
            length: length
        }, () => {
            PubSub.publish('selections', this.state.length);
        })
    }

    componentDidMount(){
        let id = this.state.id;
    
        // On mount we need to get the correct programmes for a certain study option
        // Uses the parameter that was set in state on load of the component (gotten from the url)
        database.getProgrammes(id)
            .then((items) => {
                console.log('PROGRAMMES', items);
                this.setState({
                    items: items
                })
                
                // We don't want to trigger to API calls if there is no data
                // Nesting these database calls, will make sure only one big fetch (or attempt) will happen
                // if there wasn't any data
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

        selection.get().then((items) => {
            this.setState({
                length: items.programmes.length
            })
        })

}


}
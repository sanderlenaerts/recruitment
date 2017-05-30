import React from 'react';

import dexie from 'dexie';
const db = new dexie('maindb');
import database from '../services/database';

import { Link } from 'react-router-dom';

export class ProgrammeDetails extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            programmeId: this.props.match.params.pnumber,
            programme: {}
        }
    }

    componentDidMount(){
        //TODO: fetch the correct item from the local database

        database.getProgrammeWithId(this.state.programmeId)
            .then((programme) => {
                this.setState({
                    programme: programme
                })
            })
        
    }

    render(){
        return(
            <div>
                <Link to={{ pathname: `/options/${this.props.match.params.snumber}/programmes`, state: { option: this.props.location.state.option }}}>
                    <div className="backbutton">
                        <img src="/app/assets/images/back-button.png" />
                    </div>
                </Link>
                <h1>{this.state.programme.title}</h1>
                <div dangerouslySetInnerHTML={{__html: this.state.programme.content}}>

                </div>
            </div>
        );
    }


}
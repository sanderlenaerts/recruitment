import React from 'react';

import { Link, Route} from 'react-router-dom';

import { ProgrammeDetails } from './programme-details';

export class Programme extends React.Component {

    

    render(){
        let programme = this.props.programme;

        return(
            <div>
                <Route path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/> 
                <Link to={`/options/${this.props.option}/programmes/${ this.props.programme.programmeID }`}>
                    <div className="programme">
                        <h3>{programme.title}</h3>
                        <ul>
                            <li>{programme.location}</li>
                            <li>{programme.duration}</li>
                            { programme.level ? 
                                <li>{programme.level}</li> : ''
                            }
                        
                            <li>{programme.start}</li>
                        </ul>
                    </div>
                </Link>
            </div>
           
        );
    }


}
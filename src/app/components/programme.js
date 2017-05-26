import React from 'react';

import { Link, Route} from 'react-router-dom';

import { ProgrammeDetails } from './programme-details';

export class Programme extends React.Component {

    

    render(){
        let programme = this.props.programme;

        return(
            <div className="programme">
                <Route path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/> 
                <Link to={`/options/${this.props.option}/programmes/${ this.props.programme.programmeID }`}>
                    <div>
                        <h3>{programme.title}</h3>
                        <table cellspacing="0" className="programme-info">
                            <thead className="subtitles">
                                <tr>
                                    <td>Location</td>
                                    <td>Duration</td>
                                    <td>Level</td>
                                    <td>Start</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{programme.location}</td>
                                    <td>{programme.duration}</td>
                                    <td>{programme.level}</td>
                                    <td>{programme.start}</td>
                                </tr>
                            </tbody>
                        </table>
                        <ul className="programme-info">
                            
                        </ul>
                    </div>
                </Link>
            </div>
           
        );
    }


}
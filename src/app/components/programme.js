import React from 'react';

import { Link } from 'react-router-dom';

export class Programme extends React.Component {

    

    render(){
        let programme = this.props.programme;
        console.log(this.props.programme);

        return(
            <Link to={`/programmes/${ this.props.programme.programmeID }`}>
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
        );
    }


}
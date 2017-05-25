import React from 'react';

export class Programme extends React.Component {

    render(){
        let programme = this.props.programme;

        return(
            <a href = "/">
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
            </a>
        );
    }


}
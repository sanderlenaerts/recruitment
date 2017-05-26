import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'underscore';

export class StudyOption extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div>
                <Link to={`/options/${ this.props.option.ID }/programmes`}>
                    <img src="/app/assets/images/OP-logo.jpg"/>
                    <h3 className="option-title">{_.unescape(this.props.option.Title)}</h3>
                </Link>
            </div>
            
        );
    }

    componentDidMount(){

        
    }

}
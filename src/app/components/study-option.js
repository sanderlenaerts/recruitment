import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'underscore';

export class StudyOption extends React.Component {
    constructor(){
        super();
    }

    render(){
        // The image url needs to be dynamic depending on the title of the study option
        // We need to unescape the title so '&amp;' gets replaced by just & for example
        // We remove all characters except a-zA-Z
        let img = "/app/assets/images/options/Tile-study-" + _.unescape(this.props.option.Title).replace(/\s/g, '').replace(/[^a-zA-Z ]/g, '').toLowerCase() + ".png";
        return(
            <div className="option">
                <Link to={{ pathname: `/options/${ this.props.option.ID }/programmes`}} >
                    <div className="img-container">
                        <img className="option-img" src={img}/>
                    </div>
                    
                    <h3 className="option-title">{_.unescape(this.props.option.Title)}</h3>
                </Link>
            </div>
            
        );
    }

}
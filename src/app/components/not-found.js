import React from 'react';

import { Link } from 'react-router-dom'

export class NotFound extends React.Component {
    render(){
        return (
            <div className="notfound">
                <h1>Oops. Seems like this page does not exists</h1>
                <div className="btn-container">
                     <Link to={{ pathname: `/options`}} >
                        <button type="button" className="btn btn-good">Go back home</button>
                    </Link>
                </div>
            </div>
        );
    }
}
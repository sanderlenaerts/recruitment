import React from 'react';
import { Link } from 'react-router-dom';
import database from '../services/database';

export class Header extends React.Component {
    render(){
        return(
            <header className="header">
                <nav className="navigation">
                    <ul>
                        <li>
                            <Link to={`/`}>
                                <img className="home" src="/app/assets/images/home-icon.png"/>
                            </Link>
                        </li>
                        <li>
                            <Link to={`/contact`}>
                                <img className="contact" src="/app/assets/images/contact-icon.png"/>
                            </Link>
                        </li>
                        <li onClick={this.refreshDb}>
                            <img className="refresh" src="/app/assets/images/update-button.png"/>
                        </li>
                    </ul>
                </nav>
                <img src="/app/assets/images/OP-logo.jpg" alt="OP logo" className="logo"/>
            </header>
        );
    }

    refreshDb(){
        database.fetchAll()
                .then((values) => {
                    console.log("Fetch ALL: ", values);
                    // TODO: Use these values to alter the data
                    // TODO: Notification
                });
    }
}
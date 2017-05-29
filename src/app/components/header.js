import React from 'react';
import { Link } from 'react-router-dom';

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
                        <li>
                            <a href='/' id="db">
                            </a>
                        </li>
                    </ul>
                </nav>
                <img src="/app/assets/images/OP-logo.jpg" alt="OP logo" className="logo"/>
            </header>
        );
    }
}
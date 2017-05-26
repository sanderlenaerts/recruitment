import React from 'react';

export class Header extends React.Component {
    render(){
        return(
            <header className="header">
                <nav className="navigation">
                    <ul>
                        <li>
                            <a href="/">
                                <img className="home" src="/app/assets/images/home-icon.png"/>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img className="contact" src="/app/assets/images/contact-icon.png"/>
                            </a>
                        </li>
                        <li>
                            <a href='#' id="db">
                            </a>
                        </li>
                    </ul>
                    
                    
                    
                </nav>
                <img src="/app/assets/images/OP-logo.jpg" alt="OP logo" className="logo"/>
            </header>
        );
    }
}
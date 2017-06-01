import React from 'react';
import { Link } from 'react-router-dom';
import database from '../services/database';
import { toast } from 'react-toastify';


export class Header extends React.Component {
    constructor(){
        super();

        this.state = {
            contactCount: 0
        }
    }

    componentWillMount(){
        database.getContacts().then((contacts) => {
            this.setState({
                contactCount: contacts.length
            })
        })
    }

    componentDidMount(){
        
        var mySubscriber = function( msg, data ){
            console.log( msg, data );

             let count = this.state.contactCount;
           

            this.setState({
                contactCount: (count  + 1)
            }, () => {
                console.log(this.state.contactCount)
            })
            
        }.bind(this);
        var token = PubSub.subscribe('contacts', mySubscriber);
    }

    refreshDb(){
        let current = this;
        const toastId = toast(
            <div>
                <span className="loading">
                    <img src="/app/assets/images/update-button.png" />
                </span>
                <span>
                    <h3>Trying to fetch new data from the API</h3>
                </span>
            </div>, {
                autoClose: false,
                hideProgressBar: true
            })

        

        database.fetchAll()
                .then((values) => {
                    toast.dismiss(toastId);
                    setTimeout(
                    toast(<h3>Updated the local database.</h3>, {
                        type: 'success',
                        hideProgressBar: true,
                        position: toast.POSITION.TOP_RIGHT
                    }), 1000);
                }, (error) => {
                    toast.dismiss(toastId);
                    toast(<h3>Failed to fetch new data</h3>, {
                        type: 'error'
                    })
                });
    }


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
                        <li className="send-btn">
                            <span>{this.state.contactCount}</span>
                            <img className="send" src="/app/assets/images/send.png"/>
                        </li>
                    </ul>
                </nav>
                <img src="/app/assets/images/OP-logo.jpg" alt="OP logo" className="logo"/>
            </header>
        );
    }

    
}
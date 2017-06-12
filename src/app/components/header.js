import React from 'react';
import { Link } from 'react-router-dom';
import { database } from '../services/database';
import selection from '../services/selection';
import { toast } from 'react-toastify';
import contact from '../services/contact';
import PubSub from 'pubsub-js';
import db from '../services/db';

export class Header extends React.Component {
    constructor(){
        super();

        this.state = {
            contactCount: 0,
            selectedCount: 0
        }

        this.flushContacts = this.flushContacts.bind(this);
    }

    componentWillMount(){
        // database.getContacts().then((contacts) => {
        //     this.setState({
        //         contactCount: contacts.length
        //     })
        // })

        selection.get().then((items) => {
            this.setState({
                selectedCount: items.programmes.length
            })
        })
    }

    
    

    componentDidMount(){
        // Method that updates the counter when form in contact is submitted
        var mySubscriber = function( msg, data ){
             let count = this.state.contactCount;
           

            this.setState({
                contactCount: (count  + 1)
            })
            
        }.bind(this);

        var updateSelectCounter = function(msg, length){
            this.setState({
                selectedCount: length
            })
        }.bind(this);

        // Subscribing to events published to 'contacts'
        // When event published to 'contacts' the mySubscriber method will trigger
        var token = PubSub.subscribe('contacts', mySubscriber);

        PubSub.subscribe('selections', updateSelectCounter);
    }

    // Click method that will try to POST all the locally stored contacts (dexie)
    // It will set the counter to the amount of contacts left in storage
    flushContacts(){
        // Don't need to try to POST the contacts if there are none
        if (this.state.contactCount > 0) {
            const toaster = toast(
                <div>
                    <span className="loading">
                        <img src="/app/assets/images/update-button.png" />
                    </span>
                    <span>
                        <h3>Trying to flush contacts to the API</h3>
                    </span>
                </div>, {
                    autoClose: false,
                    hideProgressBar: true
                })

        
            // Post all the contacts to the API
             contact
                .flushContacts()
                .then((success) => {
                    toast.dismiss(toaster);
                    this.setState({
                        contactCount: 0
                    }, () => {
                        toast(<h3>All contacts were correctly flushed to the API</h3>, {
                            type: 'success'
                        })
                    })
                }, error => {
                    toast.dismiss(toaster);
                    this.setState({
                        contactCount: error.length
                    }, () => {
                        toast(<h3>Not all contacts were flushed correctly</h3>, {
                            type: 'error'
                        })
                    })
                })
        }
       
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
                        <li className="contact-btn">
                            <Link to={`/contact`}>
                                <span>{this.state.selectedCount}</span>
                                <img className="contact" src="/app/assets/images/contact-icon.png"/>
                            </Link>
                        </li>
                        <li onClick={this.refreshDb}>
                            <img className="refresh" src="/app/assets/images/update-button.png"/>
                        </li>
                        <li onClick={this.flushContacts} className="send-btn">
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
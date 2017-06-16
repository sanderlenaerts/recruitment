import React from 'react';

import dexie from 'dexie';
const db = new dexie('maindb');
import {database} from '../services/database';

import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';

import $ from 'jquery';


export class ProgrammeDetails extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            optionId: this.props.match.params.snumber,
            programmeId: this.props.match.params.pnumber,
            programme: {}
        }
    }

    componentDidMount(){
        // On mount we need to get the correct programme, based on the programme clicked
        // We get the id from the url and then stored in state
        // The state paramter is used here to get the correct programme
        database.getProgrammeWithId(this.state.programmeId)
            .then((programme) => {
                this.setState({
                    programme: programme
                }, () => {
                    this.collapse()
                })
                
            }, (error) => {
                toast(<h3>Programme with this id ({this.state.programmeId}) could not be found</h3>, {
                    type: 'error',
                    hideProgressBar: true,
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        
    }

    render(){
        let content = '';

        if (this.state.programme.Title){
            content = 
                <div className="programme-details">
                <Link to={{ pathname: `/options/${this.state.optionId}/programmes`}}>
                    <div className="backbutton">
                        <img src="/app/assets/images/back-button.png" />
                    </div>
                </Link>
                <h1>{this.state.programme.Title}</h1>
                <div dangerouslySetInnerHTML={{__html: this.state.programme.Content}}>

                </div>
            </div>

            // We set the inner html to the HTML content that was in the API
        }
        else {
            content = 
                <div>
                    <h3>No content found</h3>
                </div>
        }

        return(
            <div>
                { content }
            </div>
            
        );
    }

    collapse(){
        $('h2').each((index, element) => {
           $(element)
            .nextUntil( "h2" )
            .toggle();

           

            $(element).click(() => {
                if($(element).next().css('display') === 'none'){
                    $(element).css('background-image', 'url(' + "/app/assets/images/show-hide-other.png"  +')');
                }
                else {
                    $(element).css('background-image','url(' + "/app/assets/images/show-hide.png"  +')');
                }

                $(element)
                    .nextUntil( "h2" )
                    .toggle();
            })
        })

        $('hr').each((index, element) => {
         $(element).remove();
       });
            
    }


}
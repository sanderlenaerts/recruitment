import React from 'react';

import { Link, Route} from 'react-router-dom';

import { ProgrammeDetails } from './programme-details';
import selection from '../services/selection';

export class Programme extends React.Component { 

    constructor(props){
        super(props);
        this.state = {
            selected: false,
            option: this.props.option
        }

        this.selectProgramme = this.selectProgramme.bind(this);
        this.removeProgramme = this.removeProgramme.bind(this);
    }

    _getButtonStyle(selected){
        return selected ? 'btn-bad' : 'btn-good'
    }

    componentDidMount(){
        // Check if the programme was selected
        selection
            .get()
            .then((value) => {
                let items = value;
                for (let i = 0; i < items.programmes.length; i++){
                    if (items.programmes[i].id == this.props.programme.ID){
                        // Was previously selected, so need to change the state of this programme to selected
                        this.setState({
                            selected: true
                        })
                    }
                }
            })
    }
    
    selectProgramme(){
        selection
            .select(this.props.programme.ID, this.props.programme.Title)
            .then((success) => {
                this.setState({
                    selected: true
                })
            })
    }



    removeProgramme(){
        selection
            .remove(this.props.programme.ID)
            .then((msg) => {
                this.setState({
                    selected: false
                })

            })
    }

    render(){
        let programme = this.props.programme;

        return(
            <div className="programme">
                <Route path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/>
                <div className="btn-container">
                    <button 
                        className={this._getButtonStyle(this.state.selected) + ' btn btn-fixed'} 
                        onClick={this.state.selected ? this.removeProgramme : this.selectProgramme}>
                            { this.state.selected ? 'Remove' : 'Select'}
                    </button> 
                </div>
                

                <Link to={{ pathname:`/options/${this.props.option}/programmes/${ this.props.programme.ID}`}}>
                    <div>
                        <h3>{programme.title}</h3>
                        <table cellSpacing="0" className="programme-info">
                            <thead className="subtitles">
                                <tr>
                                    <td>Location</td>
                                    <td>Duration</td>
                                    <td>Level</td>
                                    <td>Start</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{programme.Location}</td>
                                    <td>{programme.Duration}</td>
                                    <td>{programme.Level}</td>
                                    <td>{programme.Start}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Link>
            </div>
           
        );
    }


}
import React from 'react';

import { Link, Route} from 'react-router-dom';

import { ProgrammeDetails } from './programme-details';

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
        let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};

        for (let i = 0; i < items.programmes.length; i++){
            if (items.programmes[i].id == this.props.programme.programmeID){
                // Was previously selected, so need to change the state of this programme to selected
                this.setState({
                    selected: true
                })
            }
        }

    }
    
    selectProgramme(){
        this.setState({
            selected: true
        })

        // Get the selected programmes or create a new json object if no item exists yet
        let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};

        items.programmes.push({
            id: this.props.programme.programmeID,
            name: this.props.programme.title
        })

        localStorage.setItem('selected-programmes', JSON.stringify(items));
    }

    _getSelectedProgrammeIndex(array){
        for (let i = 0; i < array.length; i++){
            if (array[i].id == this.props.programme.programmeID){
                return i;
            }
        }
        return -1;
    }

    removeProgramme(){
        this.setState({
            selected: false
        })


        // Get the programmes saved as selected in localstorage
        let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};

        // Get the correct index in the localstorage item
        let index = this._getSelectedProgrammeIndex(items.programmes);

        // If the item exists, remove it from that array and save it back into localstorage
        if (index >= 0){
            items.programmes.splice(index, 1);
            localStorage.setItem('selected-programmes', JSON.stringify(items));
        }
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
                

                <Link to={{ pathname:`/options/${this.props.option.ID}/programmes/${ this.props.programme.programmeID}`, state: { option: this.state.option } }}>
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
                                    <td>{programme.location}</td>
                                    <td>{programme.duration}</td>
                                    <td>{programme.level}</td>
                                    <td>{programme.start}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Link>
            </div>
           
        );
    }


}
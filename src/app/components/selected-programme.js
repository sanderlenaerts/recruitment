import React from 'react';
import selection from '../services/selection';

export class SelectedProgramme extends React.Component { 

    constructor(props){
        super(props);
        this.state = {
            selected: {}
        }
        this.removeProgramme = this.removeProgramme.bind(this);
    }


    componentDidMount(){
        // Check if the programme was selected
        let selected = this.props.programme;
        console.log("PROPS: ", this.props);
        this.setState({
            selected: selected
        })
    }
  
    render(){
        return(
            <div className="selected-programme">
                <span>{this.state.selected.name}</span>
                <span>
                    <div className="btn-container">
                        <button type="button" onClick={this.removeProgramme} className="btn btn-bad">Remove</button>
                    </div>
                </span>
            </div>  
        );
    }

    removeProgramme(){
        selection
            .remove(this.props.programme.id)
            .then((msg) => {
                console.log(msg);
                console.log('Deleted from localStorage');
                this.props.deleteSelectedProgramme(this.state.selected.id);
            })
    }


}


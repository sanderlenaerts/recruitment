import React from 'react';

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
                        <button className="btn btn-bad">Remove</button>
                    </div>
                </span>
            </div>  
        );
    }

    _getSelectedProgrammeIndex(array){
        for (let i = 0; i < array.length; i++){
            if (array[i].id == this.props.programme.id){
                return i;
            }
        }
        return -1;
    }

    removeProgramme(){
        // Get the programmes saved as selected in localstorage
        let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};

        // Get the correct index in the localstorage item
        let index = this._getSelectedProgrammeIndex(items.programmes);

        // If the item exists, remove it from that array and save it back into localstorage
        if (index >= 0){
            items.programmes.splice(index, 1);
            this.setState({
                selected: items.programmes
            })
            localStorage.setItem('selected-programmes', JSON.stringify(items));
        }

        //TODO: Event to parent to delete this component
    }


}


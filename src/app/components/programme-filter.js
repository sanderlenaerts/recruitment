import React from 'react';

export class ProgrammeFilter extends React.Component {

    constructor(){
        super();
        this.state = {
            current: 'Choose'
        }

        // Need to bind to this, in order to be able to access the setState method
        this.handleChange = this.handleChange.bind(this);

    }

    render(){
        return(
           
            <div className="form">
                 <p>Current: {this.state.current}</p>
                <label>
                    <select value={this.state.current} onBlur={this.handleChange.bind(this)} onChange={this.handleChange}>
                        <option value="Choose" defaultValue >Select a degree type (Show all)</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="ShortCourse">Short course</option>
                    </select>
                </label>
            </div>
        );
    }

    handleChange(event){
        this.setState({
            current: event.target.value
        }, function(){
            this.props.sendFilter(this.state.current)
        });
    }
}

import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import validator from 'validator';
import database from '../database';
import { SelectedProgramme } from './selected-programme';
import { Link } from 'react-router-dom';

export class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastname: '',
            firstname: '',
            date: '',
            title: '',
            highschool: '',
            notes: '',
            phone: '',
            email: '',
            programmes: '',
            isValid: {
                lastname: false,
                firstname: false,
                date: false,
                title: false,
                notes: true,
                phone: false,
                email: false
            },
            edited: false,
            notification: false,
            selected: []
        };

        this.deleteSelectedProgramme = this.deleteSelectedProgramme.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.finishSubmit = this.finishSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        
    }

    _getInputStyleName(isValid){
        return (!isValid && this.state.edited) ? 'invalid' : 'valid';
    }

    _validateEmail(value) {
        return validator.isEmail(value);
    }

    _validateName(value) {
        console.log(value);
        return (validator.isLength(value.trim(), 1, 50));
    }

    _validateDate(value){
        console.log(value);
        if (value){
            return (validator.isBefore(value.format(), moment().format()));
        }
        return false;
        
    }

    _validatePhone(value){
        return (validator.isMobilePhone(value, 'en-NZ'));
    }

    _validateTitle(value){
        return (!validator.isEmpty(value));
    }


    _validate(firstname, lastname, email, title, date, phone) {
        console.log('Validating');
        this.setState({
            isValid: {
                firstname: this._validateName(firstname),
                lastname: this._validateName(lastname),
                email: this._validateEmail(email),
                title: this._validateTitle(title),
                date: this._validateDate(date),
                phone: this._validatePhone(phone)
            },
            edited: true
        }, function(){
            this.finishSubmit();
        });
    }

    _clearForm(){
        this.setState({
            lastname: '',
            firstname: '',
            date: '',
            title: '',
            highschool: '',
            notes: '',
            phone: '',
            email: '',
            programmes: ''
        })    
    }

   _formValid(){
        let isValid = true;

        for (let property in validation){
            if (validation.hasOwnProperty(property)){
                if (validation[property] == false){
                    isValid = false;
                }
            }
        }

        return isValid;
   }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleDateChange(birth){
        this.setState({
            date: birth
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let {firstname, lastname, email, title, date, phone} = this.state;

        this._validate(firstname, lastname, email, title, date, phone);
    }

    finishSubmit(){
        console.log(this.state);
        let validation = this.state.isValid;
        let isValid = this._formValid();

        console.log(validation);

        if (isValid){
            console.log('Valid form!');
            let contact = {
                lastname: this.state.lastname,
                firstname: this.state.firstname,
                date: this.state.date.format(),
                title: this.state.title,
                highschool: this.state.highschool,
                notes: this.state.notes,
                phone: this.state.phone,
                email: this.state.email,
                programmes: this.state.programmes
            }

            // Store it in the local indexed db
            database.storeContact(contact);

            for (let property in validation){
                if (validation.hasOwnProperty(property)){
                    this.setState({
                        isValid: {
                            [property] : false
                        }
                    })
                }
            }

            // Reset the form to not being edited
            this.setState({
                edited: false
            })

            this._clearForm();

        }
    }


    componentDidMount(){
         let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};


         this.setState({
             selected: items.programmes
         })
    }


    render(){
        let { isValid } = this.state;

        // <!--TODO: Add notification-->

        let selected = [];
        let current = this;
        let selectedContent = '';


        this.state.selected.forEach(function(programme, index){
            selected.push(<SelectedProgramme deleteSelectedProgramme={current.deleteSelectedProgramme} programme={programme} key={programme.id} />);
        })

        if (selected.length == 0){
            selectedContent = 
                <div>
                    <p>You have not yet selected any programmes</p>
                    <Link to={`/options`}>
                        <div className="btn-container">
                            <button type="button" className="btn btn-good">Choose programmes</button>
                        </div>
                    </Link>
                </div>
                    
        }
        else {
            selectedContent = selected;
        }


        return(
            <div>
                
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="form-column">
                        <h3>Personal details</h3>
                        <label className={this._getInputStyleName(isValid.title) + ' required'}> 
                        <span className="required">Title</span>
                        <fieldset className="title-radios">
                            <label>
                            <input 
                                className="required"
                                type="radio" 
                                value="miss" 
                                name="title"
                                checked={this.state.title === 'miss'} 
                                onChange={this.handleInputChange} />
                            <span>Miss.</span>
                            </label>
                        
                            <label>
                                <input 
                                    type="radio" 
                                    value="ms" 
                                    name="title"
                                    checked={this.state.title === 'ms'}
                                    onChange={this.handleInputChange} />
                                <span>Ms.</span>
                            </label>
                        
                            <label>
                                <input 
                                    type="radio" value="mrs" 
                                    checked={this.state.title === 'mrs'}
                                    name="title"
                                    onChange={this.handleInputChange} />
                                    <span>Mrs.</span>
                            </label>

                            <label>
                                <input
                                    type="radio" value="mr" 
                                    checked={this.state.title === 'mr'}
                                    name="title"
                                    onChange={this.handleInputChange} />
                                <span>Mr.</span>
                            </label>
                        </fieldset>
                        </label>


                        <label className={this._getInputStyleName(isValid.firstname) + ' required'} >
                            <span className="required">Firstname</span>
                        <input 
                            placeholder="Firstname" name="firstname" type="text" value={this.state.firstname} onChange={this.handleInputChange} />
                        </label>

                        <label className={this._getInputStyleName(isValid.lastname) + ' required'}>
                            <span className="required">Lastname</span>
                        <input placeholder="Lastname" name="lastname" type="text" value={this.state.lastname} onChange={this.handleInputChange} />
                        </label>

                        <label className={this._getInputStyleName(isValid.date) + ' required'}>
                            <span className="required">Date of birth</span>
                            <DatePicker name="date" className="full-date"
                            selected={this.state.date}
                            onChange={this.handleDateChange} 
                            placeholderText="Please select your date of birth"/>
                        </label>
                        


                        <label>
                            Highschool
                        <input placeholder="Highschool" name="highschool" type="text" value={this.state.highscool} onChange={this.handleInputChange} />
                        </label>

                        <label>
                            Notes
                        <textarea placeholder="If you have any comments, please write them here." name="notes" value={this.state.notes} onChange={this.handleInputChange} />
                        </label>

                       
                    </div>

                    <div className="form-column">
                        <h3>Contact details</h3>
                        <label className={this._getInputStyleName(isValid.phone) + ' required'}>
                        <span className="required">Phone</span>
                        <input placeholder="+64 22 376 2349" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                        </label>

                        <label className={this._getInputStyleName(isValid.email) + ' required'}>
                        <span className="required">Email</span>
                        <input placeholder="john@doe.com" name="email" value={this.state.email} onChange={this.handleInputChange} />
                        </label>

                        <h3>Selected Programmes</h3>
                        {<div className="selected-programmes">
                            { selectedContent }
                        </div>}

                        <div className="btn-container">
                            <input disabled={!this.state.edited || !this._formValid} type="submit" className="btn btn-good" value="Submit" />
                        </div>
                         <p>Fields marked with * are required</p>
                    </div>
                    
                 </form>
            </div> 
        );
    }

    deleteSelectedProgramme(id){
        // Delete the programme with id from the selected list in state
        console.log('Deleting selected programme')

        console.log(id);

        let current = this.state.selected.slice();
        let newArray = [];

        for (var i = 0; i < current.length; i++){
            if (current[i].id != id){
                console.log(current[i]);
                newArray.push(current[i]);
            }
        }

        console.log(newArray);

        this.setState({
            selected: newArray
        }, function(){
            console.log("State: ", this.state);
        })
    }
}
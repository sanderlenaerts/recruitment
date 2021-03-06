import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import validator from 'validator';
import { database } from '../services/database';
import { SelectedProgramme } from './selected-programme';
import { Link } from 'react-router-dom';
import { toast} from 'react-toastify';
import PubSub from 'pubsub-js';

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
        return (validator.isLength(value.trim(), 1, 50));
    }

    _validateDate(value){
        if (value){
            return (validator.isBefore(value.format(), moment().format()));
        }
        return false;
        
    }

    _validatePhone(value){
        return (validator.isLength(value.trim(), 1, 50));
    }

    _validateTitle(value){
        return (!validator.isEmpty(value));
    }


    _validate(firstname, lastname, email, title, date, phone) {
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
            selected: []
        })    


        localStorage.setItem('selected-programmes', JSON.stringify({ programmes: []}));
    }

   _formValid(){
        let isValid = true;
        let validation = this.state.isValid;

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

    // Finishing the submit will check if the form is valid 
    // It will structure the contact as wanted by the API and store the contact in database
    
    finishSubmit(){
        let validation = this.state.isValid;
        let isValid = this._formValid();

        if (isValid){
            let contact = {
                lastname: this.state.lastname,
                firstname: this.state.firstname,
                date: this.state.date.format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                title: this.state.title,
                highschool: this.state.highschool,
                notes: this.state.notes,
                phone: this.state.phone,
                email: this.state.email,
                selected1: this.state.selected[0],
                selected2: this.state.selected[1],
                selected3: this.state.selected[2]
            }

            // Store it in the local indexed db
            database.storeContact(contact)
                    .then((success) => {

                        // It will publish an event that will bubble to the header to change the counter
                        PubSub.publish('contacts', 'New contact');

                        for (let property in validation){
                            if (validation.hasOwnProperty(property)){
                                this.setState({
                                    isValid: {
                                        [property] : false
                                    }
                                })
                            }
                        }

                        PubSub.publish('selections', 0);

                        // Reset the form to not edited
                        this.setState({
                            edited: false
                        })

                        // We need to clear out the form
                        this._clearForm();

                        toast(<h3>Successfully stored the new contact.</h3>, {
                            type: 'success',
                            hideProgressBar: true,
                            position: toast.POSITION.TOP_RIGHT
                        })               
                    });

            

        }
    }

    // On mount we need to check if there are programmes selected
    componentDidMount(){
         let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};


         this.setState({
             selected: items.programmes
         })
    }


    render(){
        let { isValid } = this.state;

        let selected = [];
        let current = this;
        let selectedContent = '';

        // If there are selected programmes, we push a SelectedProgramme component for each selected programme
        this.state.selected.forEach(function(programme, index){
            selected.push(<SelectedProgramme deleteSelectedProgramme={current.deleteSelectedProgramme} programme={programme} key={programme.id} />);
        })
        // If no programmes are selected, we need to let the user know they have to select some
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
                            <input disabled={!this._formValid} type="submit" className="btn btn-good" value="Submit" />
                        </div>
                         <p>Fields marked with * are required</p>
                    </div>
                    
                 </form>
            </div> 
        );
    }

    // Delete method to remove the programme from the list of selected programmes
    deleteSelectedProgramme(id){
        // Delete the programme with id from the selected list in state

        let current = this.state.selected.slice();
        let newArray = [];

        for (var i = 0; i < current.length; i++){
            if (current[i].id != id){
                newArray.push(current[i]);
            }
        }

        this.setState({
            selected: newArray
        }, () => {
            PubSub.publish('selections', newArray.length);
        })
    }
}
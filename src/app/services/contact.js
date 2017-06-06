import database from './database';
import 'whatwg-fetch';

// const route = "https://" + process.env.build + ".op.ac.nz";

const route = 'http://10.110.4.12:3000';

const contacts  = {

    flushContacts: function(){
        let promise = new Promise((resolve, reject) => {
            console.log(route);

            let errors = [];

            // We get all the contacts that are locally stored in indexedDB using Dexie
            database.getContacts().then((agents) => {

                // We loop over the contacts
                for (var i = 0; i < agents.length; i++){
                    let contact = agents[i];

                    let data = {
                        DateOfBirth: contact.date,
                        Email: contact.email,
                        FirstName: contact.firstname,
                        LastName: contact.lastname,
                        Notes: contact.notes || '',
                        HighSchool: contact.highschool || '',
                        PhoneNumber: contact.phone,
                        Title: contact.title,
                        InterestedTitle1: contact.programmes[0]? contact.programmes[0].name : '',
                        InterestedTitle2: contact.programmes[1]? contact.programmes[1].name : '',
                        InterestedTitle3: contact.programmes[2]? contact.programmes[2].name : ''
                    }

                    // We convert our object literal to a querystring that is expected of the PHP API
                    let urlParameters = Object.keys(data).map((i) => i+'='+data[i]).join('&').replace(/ /g,"%20");;


                    // We send a POST request to the API for each contact
                    fetch(route + "/api/v1/AgentEnquiry", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        mode: 'cors',
                        body: urlParameters
                    }).then((d) => {
                        // Successfull POST, so the local contact can be removed
                        database.removeContact(contact.id);
                        
                        // Check if this is the last of the contacts
                        // i instead of i+1 because counter has already gone up
                        // If the last contact, check if there were any errors
                        // If errors, reject, else resolve 
                        if (i == agents.length){
                            console.log(i);
                            if(errors.length > 0) {
                                reject(errors)
                            }
                            else {
                                resolve('No errors, all contacts were flushed');
                            }
                        }

                    }, error => {

                        // Push the failed contact to the array of errors
                        errors.push(contact);


                        // Check if this is the last of the contacts
                        // i instead of i+1 because counter has already gone up
                        // If the last contact, check if there were any errors
                        // If errors, reject, else resolve 
                        if (i == agents.length){
                            if(errors.length > 0) {
                                reject(errors)
                            }
                            else {
                                resolve('No errors, all contacts were flushed');
                            }
                        }
                    })
                }
            })
        })
        return promise;
        
    }
}

module.exports = contacts;
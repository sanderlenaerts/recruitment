import database from './database';
import 'whatwg-fetch';

// const route = "https://" + process.env.build + ".op.ac.nz";

const route = 'http://10.110.4.12:3000';

const contacts  = {

    flushContacts: function(){
        let promise = new Promise((resolve, reject) => {
            console.log(route);

            let errors = [];

            database.getContacts().then((agents) => {
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

                    console.log(data);

          
                    let urlParameters = Object.keys(data).map((i) => i+'='+data[i]).join('&').replace(/ /g,"%20");;

                    console.log(urlParameters);

                    fetch(route + "/api/v1/AgentEnquiry", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        mode: 'cors',
                        body: urlParameters
                    }).then((d) => {
                        console.log('Success ', d);
                        //TODO: Remove from local database
                        database.removeContact(contact.id).then((success) => {
                            console.log("Deleted from dexie db", success);
                        })
                        console.log(i);
                        if (i == agents.length){
                            console.log(i);
                            if(errors.length > 0) {
                                console.log('ERRORS');
                                reject(errors)
                            }
                            else {
                                console.log('SUCCESS');
                                resolve('No errors, all contacts were flushed');
                            }
                        }

                    }, error => {
                        console.log(i);
                        errors.push(contact);
                        if (i == agents.length){
                            console.log(i);
                            if(errors.length > 0) {
                                console.log('ERRORS');
                                reject(errors)
                            }
                            else {
                                console.log('SUCCESS');
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
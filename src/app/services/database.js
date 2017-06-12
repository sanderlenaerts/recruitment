
import 'whatwg-fetch';

import db from './db';

 const database  = {

    // Initialize the db
    // Set the version
    // Initialize what kind of data is expected
    init: function(){
        // db.version(1).stores({
        //     studyareas: 'ID,Description,Title,Content,IPadHidden,ParentID,Tags,Terms,RelatedPages,ID',
        //     programmes: 'ID,Title,DescLocation,DescDuration,DescLevel,DescStart,Content,ParentID,Type',
        //     contacts: '++id, title, firstname, lastname, date, highschool, notes, phone, email, programmes'
        // });

        // db.table('studyareas').put({
        //     ID: 1,
        //     Title: 'Sander'
        // })
        console.log('Init and added');
    },
    
    // Fetch for both the programmes and study options
    // Store them on success in the indexed db
    fetchAll(){
        let programmes = this.fetchAllProgrammes();
        let areas = this.fetchStudyAreas();
        let promise = new Promise((resolve, reject) => {

            Promise.all([programmes, areas])
            .then(values => {
                console.log(values);
                db.transaction('rw', db.studyareas, db.programmes, () => {
                    db.studyareas.bulkPut(values[1].items);
                    db.programmes.bulkPut(values[0].items);
                }).then((result) => {
                    resolve(values);
                })

                
            }, error => {
                reject(error);
            })

        })

        return promise;
    },

    // Remove a contact based on the ID given from the indexed db
    removeContact(id){
        var promise = new Promise((resolve, reject) => {
            db.contacts
                .delete(id)
                .then((success) => {
                    resolve('Successfully deleted');
                }, (error) => {
                    reject('Could not store contact');            
                })
        })

        return promise;
    },

    // Store a new contact in the local indexed db when form is submitted
    storeContact(contact){
        
        var promise = new Promise((resolve, reject) => {
            db.transaction('rw', 'contacts', function(contacts, trans){
                contacts.put(contact)
            }).then((success) => {
                resolve('Successfully stored');
            }, (error) => {
                reject('Could not store contact');            
            })
        })

        return promise;
        
    },

    // Get a certain study area/option based on the id given
    getStudyArea: function(id){
        var promise = new Promise((resolve, reject) => {
            
            // Connect to the indexedDB using Dexie
            db.open().then((data) => {
                data.studyareas.get(id)
                .then((option) => {

                    //If nothing was found, try fetching the data from remote
                    if (option) resolve(option);
                    else database
                        .fetchAll()
                        .then((values) => { return filterArea(id, values[1].items)})
                        .then(
                            (value) => resolve(value), 
                            (error) => reject("No content was found"));
                    
                    
                }, (error) =>  reject('Option not found'))
            })
        });

        return promise;
    },

    // Get all the study areas/options
    getStudyAreas: function(){

        var promise = new Promise((resolve, reject) => {
            
            // Connect to the indexedDB using Dexie
            console.log('Getting studyareas - opening db')
            db.open()
                .then((data) => {
                    data.studyareas
                        .toArray()
                        .then((areas) => {
                            if (areas.length == 0){
                                database
                                    .fetchAll()
                                    .then(
                                        (values) => resolve(values[1].items), 
                                        (error) =>  {
                                            reject("No study area was found")
                                        })
                            }
                            else {
                                resolve(areas);
                            }
                        })
                    });
        })

        return promise;
    },

    // Get all the programmes with a certain parent id
    // This means all programmes under a certain study area
    getProgrammes: function(id){

        let programmes = [];

        var promise = new Promise((resolve, reject) => {
            
            // Connect to the indexedDB using Dexie
            db.open()
                .then((data) => {
                    data.table('programmes')
                        .where('ParentID')
                        .equals(id)
                        .each((programme) => {
                            programmes.push(programme)
                        })
                        .then(() => {
                            let counter = data.programmes.count();
                            counter.then(count => {
                                
                                    if (programmes.length == 0 && count == 0){
                                        database
                                            .fetchAll()
                                            .then(values => { 
                                                
                                                database.getProgrammes(id)
                                                    .then((data) => {
                                                        resolve(data);
                                                    })
                                            }, (error) =>  {
                                                reject("No programmes found")
                                            })
                                            
                                    }
                                    else {
                                        resolve(programmes);
                                    }
                                })
                            
                        }, (error) => reject("No programmes found"))
                    });
        })

        return promise;

    },


    // Get a certain programme based on id
    getProgrammeWithId: function(id){

        var promise = new Promise(
            function(resolve, reject){
                // Connect to the indexedDB using Dexie
                db.open()
                    .then((data) => data.programmes.get(id))
                    .then((programme) => {
                        if (programme) {
                            resolve(programme);
                        }
                        else {
                            database.fetchAll()
                                    .then(() => {
                                        database
                                            .getProgrammeWithId(id)
                                            .then((programme) => resolve(programme));
                                    }, (error) => {
                                        reject('Programme not found');
                                    })
                        }
                        
                    }, (error) => reject('Programme not found'))
                    
        })
        return promise;
    },

    // Fetch to GET all the programmes from the API
    fetchAllProgrammes: function(){
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                fetch("https://www.op.ac.nz/api/v1/ProgrammeInformationPage.json?fields=ID,Title,DescLocation,DescDuration,DescLevel,DescStart,Content,ParentID,Type", {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    }
                })
                .then(response => response.json())
                .then(response => {
                    //storeProgrammes(response);
                    resolve(response);
                }, error => {
                    console.log(error);
                    reject(new Error('Failed to fetch and store new data'));
                });
            }
        );

        return promise;
    },

     // Fetch to GET all the programmes from the API
     // Only return the programmes that have the 'id' as a parentID
     fetchProgrammes: function(id){
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                fetch("https://www.op.ac.nz/api/v1/ProgrammeInformationPage.json", {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    }
                })
                .then(response => response.json())
                .then(response => {
                    //storeProgrammes(response);
                    var filtered = response.items.filter((programme) => {
                        return programme.ParentID == id
                    })

                    resolve(filtered);
                }, error => {
                    reject(new Error('Failed to fetch and store new programmes'));
                });
            }
        );

        return promise;
    },

    // Fetch all the study areas/options from the API
     fetchStudyAreas: function(){
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                // Fetch all the study programmes and save them in indexedDB
                fetch("https://www.op.ac.nz/api/v1/StudyAreaPage.json?fields=ID,Description,Title,Content,IPadHidden,ParentID", {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    }
                })
                .then(response => response.json())
                .then(response => {
                    //storeStudyAreas(response);


                    resolve(response);
                }, error => {
                    reject(new Error('Failed to fetch and store new study areas'));
                });
            }
        );

        return promise;
    },

    // Get all the contacts from the indexed db
    getContacts: function(){

        let contacts = [];

        var promise = new Promise(
            function(resolve, reject){

                // Connect to the indexedDB using Dexie
                db.open().then((data) => {
                    data.table("contacts")
                        .each((contact) => {
                            contacts.push(contact);
                        })
                        .then(() => {
                            resolve(contacts)
                        }, function(error){
                            reject(new Error('Failed to get the contacts'));
                        });
                })
            }
        );

        return promise;
        
    }
}

// Store the programmes in indexed db (dexie)
var storeProgrammes = function(programmes){
        programmes.items.map(function(data){
            db.transaction('rw', 'programmes', function(programme, trans){
                programme.put({
                    ID: data.ID, 
                    Title: data.Title, 
                    Location: data.DescLocation,
                    Duration: data.DescDuration,
                    Level: data.DescLevel,
                    Start: data.DescStart,
                    Content:data.Content,
                    ParentID: data.ParentID, 
                    Type:data.Type
                })
            })
        })
}

// Store the study areas/options in indexed db (dexie)
var storeStudyAreas = function(options){
        options.items.map(function(data){
            db.transaction('rw', 'studyareas', function(area, trans){
                area.put({
                    ID: data.ID,
                    Description: data.Description,
                    Title: data.Title,
                    Content: data.Content,
                    IPadHidden: data.IPadHidden,
                    ParentID: data.ParentID,
                    Tags: data.Tags,
                    Terms: data.Terms,
                    RelatedPages: data.RelatedPages
                })
            })
        })
    }

let filterArea = function(id, array){
    // Filter through to get the correct study area
    let options = array.filter((area, index) => {
        return area.ID == id;
    })

    // Return the correct study area
    return options[0];
}

// Filter the programmes based on parentID
let filterProgrammes = function(id, array){
    // Filter through to get the correct study area
    let programmes = array.filter((programme, index) => {
        return programme.ParentID == id;
    })

    // Return the correct study area
    return programmes;
}


export {database as database}
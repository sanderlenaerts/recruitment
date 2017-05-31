const dexie = require('dexie');
const db = new dexie('maindb');


 const database  = {

    init: function(){
        console.log('Db init');
        db.version(1).stores({
            studyareas: 'ID,Description,Title,Content,IPadHidden,ParentID,Tags,Terms,RelatedPages,ID',
            programmes: 'ID,Title,Location,Duration,Level,Start,Content,ParentID,Type',
            contacts: '++id, title, firstname, lastname, date, highschool, notes, phone, email, programmes'
        });
    },

    fetchAll(){
        let programmes = this.fetchAllProgrammes();
        let areas = this.fetchStudyAreas();
        let promise = new Promise((resolve, reject) => {

            Promise.all([programmes, areas])
            .then(values => {
                resolve(values);
            }, error => {
                console.log("FETCHALL", error);
                reject(error);
            })

        })

        return promise;
    },

    storeContact(contact){
        
        console.log('Storing: ', contact);

        db.transaction('rw', 'contacts', function(contacts, trans){
            contacts.put(contact)
        })
    },

    getStudyArea: function(id){
        var promise = new Promise((resolve, reject) => {
            
            // Connect to the indexedDB using Dexie
            db.open().then((data) => {
                data.studyareas.get(id)
                .then((option) => {

                    // If nothing was found, try fetching the data from remote
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

    getStudyAreas: function(){

        var promise = new Promise((resolve, reject) => {
            
            // Connect to the indexedDB using Dexie
            db.open()
                .then((data) => {
                    data.studyareas
                        .toArray()
                        .then((areas) => {
                            if (areas.length == 0){
                                database
                                    .fetchAll()
                                    .then(
                                        (values) => resolve(values), 
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
                                console.log('Count: ', count);
                                
                                    if (programmes.length == 0 && count == 0){
                                        // TODO: Filter on parentID
                                        console.log(programmes.length);
                                        database
                                            .fetchAll()
                                            .then(values => { 
                                                console.log('Fetched values');
                                                
                                                database.getProgrammes(id)
                                                    .then((data) => {
                                                        console.log('Jajajaja');
                                                        resolve(data);
                                                    })
                                            }, (error) =>  {
                                                console.log('What', error);
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
                                    })
                        }
                        
                    }, (error) => reject('Programme not found'))
                    
        })


        return promise;

    },

    fetchAllProgrammes: function(){
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                fetch("https://www.op.ac.nz/api/v1/ProgrammeInformationPage.json", {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    }
                })
                .then(response => response.json())
                .then(response => {
                    console.log('Fetching all programmes - SUCCESS');
                    storeProgrammes(response);
                    resolve(response);
                }, error => {
                    console.log('Fetching all programmes - FAIL');
                    reject(new Error('Failed to fetch and store new data'));
                });
            }
        );

        return promise;
    },

     fetchProgrammes: function(id){
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                fetch("https://www.op.ac.nz/api/v1/ProgrammeInformationPage.json", {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    }
                })
                .then(response => response.json())
                .then(response => {
                    console.log('Fetching programmes with id - SUCCESS');
                    storeProgrammes(response);
                    var filtered = response.items.filter((programme) => {
                        return programme.ParentID == id
                    })

                    resolve(filtered);
                }, error => {
                    console.log('Fetching programmes - FAIL');
                    reject(new Error('Failed to fetch and store new programmes'));
                });
            }
        );

        return promise;
    },

     fetchStudyAreas: function(){
        console.log('Fetching study areas');
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                // Fetch all the study programmes and save them in indexedDB
                // TODO: Error handling
                fetch("https://www.op.ac.nz/api/v1/StudyAreaPage.json", {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    }
                })
                .then(response => response.json())
                .then(response => {
                    console.log('Fetching study areas - SUCCESS');
                    storeStudyAreas(response);


                    resolve(response);
                }, error => {
                    console.log('Fetching study areas - FAIL');
                    reject(new Error('Failed to fetch and store new study areas'));
                });
            }
        );

        return promise;
    },

    getContacts: function(){

        let contacts = [];

        var promise = new Promise(
            function(resolve, reject){

                // Connect to the indexedDB using Dexie
                db.open().then((data) => {
                    console.log(data);
                    data.table("contacts")
                        .each((contacts) => {
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

var storeProgrammes = function(programmes){
        console.log("Storing programmes");
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

var storeStudyAreas = function(options){
        console.log('Stroing study areas');
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

let filterProgrammes = function(id, array){
    // Filter through to get the correct study area
    let programmes = array.filter((programme, index) => {
        return programme.ParentID == id;
    })

    // Return the correct study area
    return programmes;
}


    module.exports = database;
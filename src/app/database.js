const dexie = require('dexie');
const db = new dexie('maindb');

module.exports = {

    init: function(){
        console.log('Db init');
        db.version(1).stores({
            studyareas: 'ID,Description,Title,Content,IPadHidden,ParentID,Tags,Terms,RelatedPages,ID',
            programmes: 'programmeID,title,location,duration,level,start,content,parentID,type',
            contacts: '++id, title, firstname, lastname, date, highschool, notes, phone, email, programmes'
        });
    },

    storeContact(contact){
        
        console.log('Storing: ', contact);

        db.transaction('rw', 'contacts', function(contacts, trans){
            contacts.put(contact)
        })
    },

    getStudyAreas: function(){
        let options = [];

        var promise = new Promise(
            function(resolve, reject){

                // Connect to the indexedDB using Dexie
                db.open().then((data) => {

                    // Get the study area table
                    data.table("studyareas")
                        .each((option) => {
                            options.push(option);
                        })
                        .then(() => {
                            data.studyareas.count(function(length){
                                if (length == 0){
                                    reject('No data yet');
                                }
                                resolve(options)
                            });
                        }, function(error){
                            console.log(error);
                            reject(error);
                        })
                })
            }
        );

        return promise;
    },

    getProgrammes: function(id){
        let programmes = [];

        var promise = new Promise(
            function(resolve, reject){
                console.log('What');

                // Connect to the indexedDB using Dexie
                db.open().then((data) => {
                    console.log(data);
                    data.table("programmes")
                        .where("parentID").equals(id)
                        .each((programme) => {
                            programmes.push(programme);
                        })
                        .then(() => {
                            data.programmes.count(function(length){
                                if (length == 0){
                                    reject('No data yet');
                                }
                                resolve(programmes)
                            });
                            
                        }, function(error){
                            console.log(error);
                            reject(error);
                        });
                })
            }
        );

        return promise;
    },

    getProgrammeWithId: function(id){

        var promise = new Promise(
            function(resolve, reject){
                // Connect to the indexedDB using Dexie
                db.open().then((data) => {

                    data.programmes.get(id)
                    .then((programme) => {
                        resolve(programme);
                    }, (error) => reject('Programme not found'))
                    
                })
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
                    storeProgrammes(response);
                    var filtered = response.items.filter((programme) => {
                        return programme.parentID == id
                    })

                    resolve(filtered);
                }, error => {
                    reject(error);
                });
            }
        );

        return promise;
    },

     fetchStudyAreas: function(){
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
                    storeStudyAreas(response);


                    resolve(response);
                }, error => {
                    reject(error);
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
                            reject(error);
                        });
                })
            }
        );

        return promise;
        
    }
}

var storeProgrammes = function(programmes){
        programmes.items.map(function(data){
            db.transaction('rw', 'programmes', function(programme, trans){
                programme.put({
                    programmeID: data.ID, 
                    title: data.Title, 
                    location: data.DescLocation,
                    duration: data.DescDuration,
                    level: data.DescLevel,
                    start: data.DescStart,
                    content:data.Content,
                    parentID: data.ParentID, 
                    type:data.Type
                })
            })
        })
}

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
const dexie = require('dexie');
const db = new dexie('maindb');

module.exports = {
    storeToDatabase: function(programmes){
        db.version(1).stores({
            programmes: 'programmeID,title,location,duration,level,start,content,parentID,type'
        });

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
    },


}
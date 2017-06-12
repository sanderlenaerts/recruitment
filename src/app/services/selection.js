const selection  = {

    // Get the index in local storage of the selected programme
    getIndex: function(array, id){
        for (let i = 0; i < array.length; i++){
            if (array[i].id == id){
                return i;
            }
        }
        return -1;
    },

    // Remove a programme from localstorage
    remove: function(id){
        let promise = new Promise((resolve, reject) => {

            // Get the programmes saved as selected in localstorage
            let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};

            // Get the correct index in the localstorage item
            let index = selection.getIndex(items.programmes, id);

            // If the item exists, remove it from that array and save it back into localstorage
            if (index >= 0){
                items.programmes.splice(index, 1);
                localStorage.setItem('selected-programmes', JSON.stringify(items));
                resolve({
                    length: items.programmes.length
                });
            }
        })

        return promise;
    },

    removeAll(){
        let promise = new Promise((resolve, reject) => {

            // Get the programmes saved as selected in localstorage
            let items =  { programmes: []};
            localStorage.setItem('selected-programmes', JSON.stringify(items));
        })

        return promise;
    },

    // Get all the programmes from localstorage
    get: function(){
        let promise = new Promise((resolve, reject) => {
             let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};
             resolve(items);
        })

        return promise;
            

    },

    // Save a programme in localstorage
    select: function(id, name){
        let promise = new Promise((resolve, reject) => {

            // Get the selected programmes or create a new json object if no item exists yet
            let items = JSON.parse(localStorage.getItem('selected-programmes')) || { programmes: []};

            items.programmes.push({
                id: id,
                name: name
            })

            localStorage.setItem('selected-programmes', JSON.stringify(items));
            resolve({
                length: items.programmes.length
            });
        })

        return promise;
    }
}

module.exports = selection;
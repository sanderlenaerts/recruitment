import React from 'react';
import dexie from 'dexie';

import { Programme } from './programme';
import { ProgrammeFilter } from './programme-filter';

const db = new dexie('maindb');
let ID = '112';

export class ProgrammeList extends React.Component {
    constructor(){
        super();
        this.state = {
            items: [],
            type: 'Bachelor'
        }

        this.sendFilter = this.sendFilter.bind(this);
    }

    render(){
        let programmes = [];
        this.state.items.filter(
            (programme) => {
                return programme.type == this.state.type
            } 
        )
        .forEach(function(programme, index){
            programmes.push(<Programme programme={programme} key={index} />);
        })


        return(
            <div>
                <h1>Study option programmes</h1>
                <ProgrammeFilter sendFilter={this.sendFilter} />
                <div id="list">
                    { programmes }
                </div>
                <div id="info">

                </div>
            </div>
            
        );
    }

    sendFilter(data){
        console.log('Filter received: ', data);
        this.setState({
            type: data
        })
        console.log('Filter changed: ', this.state)
    }

    componentDidMount(){
        let items = [];

        db.open().then((data) => {
            data.table("programmes")
                .where("parentID").equals(ID)
                .each((programme) => {
                    items.push(programme);
                })
                .then(() => {
                    this.setState({items: items})
                });
        })
        
    }

}
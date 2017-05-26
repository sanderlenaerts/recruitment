
import React from 'react';

import { Switch, Route } from 'react-router-dom'; 

import { ProgrammeList } from './programme-list';
import { ProgrammeDetails } from './programme-details';


export const ProgrammeContainer = () => (
  <Switch>
    <Route exact path='/options/:snumber/programmes' component={ProgrammeList}/>
    <Route path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/> 
  </Switch>
)


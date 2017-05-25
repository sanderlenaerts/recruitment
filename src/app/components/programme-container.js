
import React from 'react';

import { Switch, Route } from 'react-router-dom'; 

import { ProgrammeList } from './programme-list';
import { ProgrammeDetails } from './programme-details';


export const ProgrammeContainer = () => (
  <Switch>
    <Route exact path='/programmes' component={ProgrammeList}/>
    <Route exact path='/programmes/:number' component={ProgrammeDetails}/> 
  </Switch>
)


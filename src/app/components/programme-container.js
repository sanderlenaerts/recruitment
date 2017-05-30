
import React from 'react';

import { Switch, Route } from 'react-router-dom'; 

import { ProgrammeList } from './programme-list';
import { ProgrammeDetails } from './programme-details';
import { NotFound } from './not-found';


export const ProgrammeContainer = () => (
  <Switch>
    <Route exact path='/options/:snumber/programmes' component={ProgrammeList}/>
    <Route exact path='/options/:snumber/programmes/:pnumber' component={ProgrammeDetails}/> 
    <Route path="/options/:snumber/programmes/**/**" component={NotFound}/>
  </Switch>
)


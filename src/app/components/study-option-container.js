import React from 'react';

import { Switch, Route } from 'react-router-dom'; 

import { StudyOptionList } from './study-option-list';
import { ProgrammeContainer } from './programme-container';


export const StudyOptionContainer = () => (
  <Switch>
    <Route exact path='/options' component={StudyOptionList}/>
    <Route path='/options/:snumber/programmes' component={ProgrammeContainer}/>
  
  </Switch>
)
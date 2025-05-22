import React from 'react';
import classes from './MapButton.css';

const mapbutton = (props) => (
  <button className={[classes.regular]} onClick={props.clicked}>
    {props.children}
  </button>
);

export default mapbutton;

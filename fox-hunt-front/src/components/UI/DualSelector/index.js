import React from 'react';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'font-awesome/css/font-awesome.css';
import DualListBox from 'react-dual-listbox';

const dualSelectorWidget = ({ selected, options, onChange }) => (
  <DualListBox
    selected={selected}
    options={options}
    showHeaderLabels
    onChange={onChange}
  />
);

export default dualSelectorWidget;

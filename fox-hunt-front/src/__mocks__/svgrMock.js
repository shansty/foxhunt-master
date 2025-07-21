// import React from 'react';
// export default 'SvgrURL';
// export const ReactComponent = () => 'div';
// src/__mocks__/svgrMock.js
import * as React from 'react';
const SvgrMock = React.forwardRef((props, ref) => <svg {...props} ref={ref} />);
export const ReactComponent = SvgrMock;
export default SvgrMock;

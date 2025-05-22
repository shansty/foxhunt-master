declare module '*.scss';

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: any;
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module 'shamos-hoey' {
  const content: any;
  export default content;
}

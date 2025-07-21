declare module '*.scss';

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: any;
  const content: any;
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module 'shamos-hoey' {
  const content: any;
  export default content;
}

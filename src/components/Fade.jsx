import { CSSTransition } from 'react-transition-group';
import React from 'react';

const Fade = ({ children, ...props }) => (
  <CSSTransition {...props} timeout={500} classNames="fade">
    {children}
  </CSSTransition>
);

export default Fade;

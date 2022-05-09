import React from 'react';
import { Col } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import img from '../../assets/lil-loading-skull.gif';

const PreLaunchPage = () => {
  return (
    <Col sm={2} className="m-auto">
      <Image  src={img} fluid />
    </Col>
  );
};

export default PreLaunchPage;

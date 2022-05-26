import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from './NouniversePage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Image, Button } from 'react-bootstrap';
import lilNounsReading from '../../assets/nouniverse/LilNounsReading.gif';

import altnouns from '../../assets/nouniverse/LilNounsReadingAltNouns.png';
import boneys from '../../assets/nouniverse/LilNounsReadingBoneys.png';
import borednoungang from '../../assets/nouniverse/LilNounsReadingBoredNounGang.png';
import gnars from '../../assets/nouniverse/LilNounsReadingGnarsDAO.png';
import hypercosplay from '../../assets/nouniverse/LilNounsReadingHyperCosplay.png';
import lostnouns from '../../assets/nouniverse/LilNounsReadingLostNouns.png';
import nouncats from '../../assets/nouniverse/LilNounsReadingNounCats.png';
import nounpunks from '../../assets/nouniverse/LilNounsReadingNounpunks.png';
import nounsdao from '../../assets/nouniverse/LilNounsReadingNouns.png';
import sharkdao from '../../assets/nouniverse/LilNounsReadingSharkDAO.png';

const NouniversePage = () => {
  const { id } = useParams<{ id: string }>();

  const [img, setImage] = useState(lilNounsReading);
  const [title, setTitle] = useState('Nouniverse');
  const [isNouniverseProject, setIsNouniverseProject]  = useState(true);

  useEffect(() => {
    switch (id) {
      case "altnouns": 
      setImage(altnouns)
      setTitle("Alt Nouns")
      break;

      case "boneys": 
      setImage(boneys)
      setTitle("Boneys")
      break;

      case "borednoungang": 
      setImage(borednoungang)
      setTitle("Bored Noun Gang")
      break;

      case "gnars": 
      setImage(gnars)
      setTitle("Gnars DAO")
      break;

      case "hypercosplay": 
      setImage(hypercosplay)
      setTitle("Hyper Cosplay")
      break;

      case "lostnouns": 
      setImage(lostnouns)
      setTitle("Lost Nouns")
      break;

      case "nouncats": 
      setImage(nouncats)
      setTitle("Noun Cats")
      break;

      case "nounpunks": 
      setImage(nounpunks)
      setTitle("Noun Punks")
      break;

      case "nounsdao": 
      setImage(nounsdao)
      setTitle("Nouns DAO")
      break;

      case "sharkdao": 
      setImage(sharkdao)
      setTitle("Shark DAO")
      break;
    
      default:
        setIsNouniverseProject(false)
        // setTitle("Nouniverse POAP")
        // setTitle("Nouniverse")
        break;
    }
  }, [id])
  


  return (
    <Section fullWidth={true} className={classes.nounersPage}>
      <Col lg={{ span: 6, offset: 3 }}>
        <Row className={classes.headerRow}>
          <span>Nouniverse</span>
          <h1>A Lil Nounish Welcome to {title}</h1>
        </Row>

        <Row style={{ marginBottom: '0rem' }}>
          <Image src={img} fluid />
        </Row>
        <br />
        <br />

        <Row className={classes.pictureCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span>Feels ⌐◨-◨, man</span>
            </Row>
            <Row>
              <Col>
                {!isNouniverseProject? (
                  "Lil Nouns wouldn't be where it is today if it wasn't for the inspirational and welcoming nature of all nouniverse communities. As a thank you, we've attributed dedicated server roles for most communities. Self-assign and show your nounish affinity! They may even come with their own POAP 👀"
                ): (
                  `Lil Nouns wouldn't be where it is today if it wasn't for the inspirational and welcoming nature of nouniverse communities like ${title}. As a thank you, we've attributed a dedicated server role for all ${title} members. Self-assign and show your nounish affinity! They may even come with their own commemorative Lil Nouns x ${title} POAP 👀`
                  )}
              </Col>
            </Row>
          </Col>

          <Col className={classes.treasuryInfoText}>
            <div className={classes.verifyButtonWrapper}>
              <a href={`https://discord.gg/xjARUcB3tJ`}>
                <Button className={classes.generateBtn}>Join Discord</Button>
              </a>
            </div>
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default NouniversePage;

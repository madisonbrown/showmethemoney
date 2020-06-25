import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  withRouter,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../components/style/device';
import Session from '../Session.js';
import Official from '../components/Official.jsx';
import Logo from '../components/Logo.jsx';
import OfficialDetails from '../components/OfficialDetails.jsx';
import { access } from '../util';

const ElectionLink = ({ details }) => {
  const ButtonsWrapepr = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 15px 10px;
  `;
  ButtonsWrapepr.displayName = 'ButtonsWrapper';

  const LinkWrapper = styled.div`
    a {
      display: flex;
      justify-content: flex-end;
      color: blue;
      text-decoration: none;
    }
  `;
  LinkWrapper.displayName = 'LinkWrapper';

  const ElectionsButton = styled.button`
    width: 100px;
    padding: 5px 0px 5px 0px;
    font-size: 1em;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    background-color: red;
    color: white;
  `;
  ElectionsButton.displayName = 'ElectionsButton';

  const [elections, setElections] = useState(null);

  useEffect(() => {
    Session.getElections()
      .then((data) => setElections(data))
      .catch((err) => setElections(undefined));
  }, []);

  const linkTo = {
    pathname: '/elections',
    state: elections,
  };

  return (
    <ButtonsWrapepr>
      <LinkWrapper>
        <Link to={details ? '/officials' : '/'}>
          <ElectionsButton>Back</ElectionsButton>
        </Link>
      </LinkWrapper>
      {elections ? (
        <LinkWrapper>
          <Link to={linkTo}>
            <ElectionsButton>Elections</ElectionsButton>
          </Link>
        </LinkWrapper>
      ) : null}
    </ButtonsWrapepr>
  );
};

const Grid = (props) => {
  let { id } = useParams();

  const OfficialsHeader = styled.h2`
    display: flex;
    justify-content: center;
    color: #00100b;
    font-size: 2.2em;
    margin-bottom: 0px;
    font-family: -apple-system;
  `;
  OfficialsHeader.displayName = 'OfficialsHeader';

  const OfficialsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    font-family: -apple-system;
    @media ${device.laptop} {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
    }
  `;
  OfficialsWrapper.displayName = 'OfficialsWrapper';

  const [data, setData] = useState(null);

  useEffect(() => {
    Session.getOfficals()
      .then((data) => setData(data))
      .catch((err) => setData(undefined));
  }, []);

  if (data === null) {
    return <h1>Loading...</h1>;
  }

  const officials = data.officials;
  const state = access(data).normalizedInput.state('');

  if (!officials || !officials.length) {
    return <h1>An error occurred.</h1>;
  }

  if (id !== undefined) {
    return (
      <OfficialsWrapper>
        <OfficialDetails
          {...officials[id]}
          key={`official${id}`}
          state={state}
        />
      </OfficialsWrapper>
    );
  }

  const children = officials
    .map((props, id) => (
      <Official {...props} key={`official${id}`} officialId={id} />
    ))
    .reverse();

  return (
    <div>
      <OfficialsHeader>Your Elected Officials</OfficialsHeader>
      <OfficialsWrapper>{children}</OfficialsWrapper>
    </div>
  );
};

const Profile = (props) => {
  return <h3>You selected {props.name}.</h3>;
};

const Officials = (props) => {
  const { path } = useRouteMatch();

  return (
    <div>
      <Logo />
      <Switch>
        <Route exact path={path}>
          <ElectionLink address={Session.address} />
          <Grid officials={props.location.state} />
        </Route>
        <Route path={`${path}/:id`}>
          <ElectionLink address={Session.address} details={true} />
          <Grid officials={props.location.state} />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(Officials);

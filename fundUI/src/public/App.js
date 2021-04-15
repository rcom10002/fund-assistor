import React, { Component } from 'react';
import './App.css';

import { LineChart, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';


import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Form, FormControl, Button } from 'react-bootstrap';

import data from './FundData'
import ServiceBroker from './ServiceBroker'
import CockpitPanelModalWindow from './CockpitPanelModalWindow'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fundCode: 161725,
      fundData: data.fundData,
      fundDataSize: 99,
    };

    console.log(this.state.fundData)

    this.showCockpitPanel = this.showCockpitPanel.bind(this);
    this.retrieveFundDetail = this.retrieveFundDetail.bind(this);
    this.setFundCode = this.setFundCode.bind(this);
    this.setFundDataSize = this.setFundDataSize.bind(this);
  }

  showCockpitPanel() {
    this.setState({ isCockpitPanelShown: true })
  }

  retrieveFundDetail() {
    console.log(['ServiceBroker', ServiceBroker])
    ServiceBroker.getFundDetail(
      this.state.fundCode,
      this.state.fundDataSize,
      (v) => {
        console.log(['test', v]);
        this.setState({ fundData: v })
      })
  }

  setFundCode(event) {
    console.log(event.target.value)
    this.setState({ fundCode: event.target.value });
  }

  setFundDataSize(event) {
    console.log(event.target.value)
    this.setState({ fundDataSize: event.target.value });
  }

  render() {
    return (
      <Container fluid={true} className="Container">
        <Row>
          <Col>
            <Navbar bg="light" expand={true}>
              <Navbar.Brand href="#home">Your Fund Assistor</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#home" onSelect={this.showCockpitPanel}>Cockpit</Nav.Link>
                  <Nav.Link href="#link">Settings</Nav.Link>
                  <NavDropdown title="Recent" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form inline>
                  <FormControl type="text" placeholder="Data Size" className="mr-sm-2" value={this.state.fundDataSize} onChange={this.setFundDataSize} />
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" value={this.state.fundCode} onChange={this.setFundCode} />
                  <Button variant="outline-primary" onClick={this.retrieveFundDetail}>Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>



        <Row>
          <Col>
            <CockpitPanelModalWindow isCockpitPanelShown={this.state.isCockpitPanelShown} />
          </Col>
        </Row>



        <Row>
          <Col>
            <RechartsDemo fundData={this.state.fundData} />
          </Col>
        </Row>
      </Container>
    );
  }
}

class RechartsDemo extends Component {
  constructor(props) {
    console.log(['props', props])
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container fluid={true}>
        <Row>
          <Col>
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={this.props.fundData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                width={500}
                height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="FSRQ" reversed={true} angle={36} interval={3} tickMargin={15} />
                <YAxis type="number" domain={[dataMin => (dataMin * 0.99).toFixed(3), dataMax => (dataMax * 1.01).toFixed(3)]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="PERIODICAL_MAX_LJJZ" stroke="blue" />
                <Line type="monotone" dataKey="LJJZ" stroke="#82ca9d" />
                <Line type="monotone" dataKey="PERIODICAL_MIN_LJJZ" stroke="red" />
              </ComposedChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={this.props.fundData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                width={500}
                height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="FSRQ" reversed={true} angle={36} interval={3} tickMargin={15} />
                <YAxis
                  type="number"
                  domain={[dataMin => (dataMin * 0.99).toFixed(3), dataMax => (dataMax * 1.01).toFixed(3)]}
                  tickFormatter={(value, index) => `${(value - 0).toFixed(2)}%`}
                />
                <Tooltip />
                <Legend />
                <Line type="basis" dataKey="PERIODICAL_1W_JZZZL" stroke="blue" />
                <Line type="basis" dataKey="PERIODICAL_2W_JZZZL" stroke="#82ca9d" />
                <Line type="basis" dataKey="PERIODICAL_3W_JZZZL" stroke="red" />
                <Brush dataKey="FSRQ" reversed={true} interval={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Container>
    );
  }
}


export default App;



// https://react-bootstrap.github.io/
// https://recharts.org/en-US
// https://reactjs.org/docs/hello-world.html


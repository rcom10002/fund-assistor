import 'regenerator-runtime/runtime'
import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Form, FormControl, Dropdown, ButtonGroup, Button, SplitButton, DropdownButton, Badge, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

import FundDataServiceBroker from './FundDataServiceBroker'
import FundCharts from './FundCharts'
import FundRecents from './FundRecents'
import CockpitPanelModalWindow from './CockpitPanelModalWindow'
import ConfirmationDialog from './ConfirmationDialog'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fundCode: "", fundStatisticalPeriod: "", fundDataLength: "", todayMockPercentage: 0, fundName: "",
      fundData: "", token: "cbabca3e-ca05-4953-bc65-124db8c839dd-woody", recents: [],
      showRecentDeletionConfirmationDialog: false, recentDeletionConfirmationDialogContext: {}
    };

    this.showCockpitPanel = this.showCockpitPanel.bind(this);
    this.refreshRecents = this.refreshRecents.bind(this);
    this.setSelectedRecent = this.setSelectedRecent.bind(this);
    this.showRecentDeletionConfirmationDialog = this.showRecentDeletionConfirmationDialog.bind(this);
    this.closeRecentDeletionConfirmationDialog = this.closeRecentDeletionConfirmationDialog.bind(this);
    this.deleteRecent = this.deleteRecent.bind(this);
    this.setTodayMockPercentage = this.setTodayMockPercentage.bind(this);
    this.setFundStatisticalPeriod = this.setFundStatisticalPeriod.bind(this);
    this.setFundDataLength = this.setFundDataLength.bind(this);
    this.setFundCode = this.setFundCode.bind(this);
    this.retrieveFundDetail = this.retrieveFundDetail.bind(this);
  }

  componentDidMount() {
    console.log(["componentDidMount ... ... ... ... ... ..."])
    this.refreshRecents()
  }

  async refreshRecents() {
    await FundDataServiceBroker.getRecents(
      this.state.token,
      (recents) => {
        Object.keys(recents).forEach((key) => { const e = recents[key]; e.todayMockPercentage = e.todayMockPercentage || 0; });
        console.log("getRecents", recents);
        this.setState({ recents });
      }
    );
  }

  showCockpitPanel() {
    this.setState({ isCockpitPanelShown: true })
  }

  async retrieveFundDetail() {
    console.log(["retrieving ...", this.state])
    await FundDataServiceBroker.getFundDetail(
      this.state.token,
      this.state.fundCode,
      this.state.fundStatisticalPeriod,
      this.state.fundDataLength,
      this.state.todayMockPercentage,
      (fundData) => {
        console.log(["retrieving ... set fundData", fundData])
        this.setState({ fundData });
      }
    );
    await FundDataServiceBroker.getRecents(
      this.state.token,
      (recents) => {
        console.log(["retrieving ... set fundDate/recents"])
        this.setState({ recents });
      }
    );
    let fundName = this.state.recents[this.state.fundCode].name
    this.setState({ fundName });
  }

  setSelectedRecent(fundCode, fundDataLength, fundStatisticalPeriod, todayMockPercentage, fundName) {
    this.setState({ fundCode, fundDataLength, fundStatisticalPeriod, todayMockPercentage, fundName }, this.retrieveFundDetail);
  }

  showRecentDeletionConfirmationDialog(fundCode) {
    let bodyText = fundCode + "-" + this.state.recents[fundCode].name
    this.setState({ showRecentDeletionConfirmationDialog: true, recentDeletionConfirmationDialogContext: { fundCode, bodyText } })
  }

  closeRecentDeletionConfirmationDialog() {
    this.setState({ showRecentDeletionConfirmationDialog: false })
  }

  async deleteRecent(context) {
    await FundDataServiceBroker.deleteRecent(
      this.state.token,
      context.fundCode,
      this.refreshRecents
    );
    await this.refreshRecents()
    this.closeRecentDeletionConfirmationDialog()
  }

  setTodayMockPercentage(event) {
    this.setState({ todayMockPercentage: event.target.value });
  }

  setFundDataLength(event) {
    this.setState({ fundDataLength: event.target.value });
  }

  setFundStatisticalPeriod(event) {
    this.setState({ fundStatisticalPeriod: event.target.value });
  }

  setFundCode(event) {
    this.setState({ fundCode: event.target.value });
  }

  render() {
    return (
      <Container fluid={true} className="Container">
        <Row>
          <Col>
            <Navbar bg="light" expand={true}>
              <Navbar.Brand>Fund Assistor</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#home" onSelect={this.showCockpitPanel}>Cockpit</Nav.Link>
                  <Nav.Link href="#link">Settings</Nav.Link>
                  <FundRecents recents={this.state.recents} onRencentItemClick={this.setSelectedRecent} onRencentItemDeleteButtonClick={this.showRecentDeletionConfirmationDialog} />
                </Nav>
                <Form inline>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text className="mr-sm-2">{this.state.fundName}</InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Today Mock %</InputGroup.Text>
                      <InputGroup.Text>&#8263;</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl ype="text" placeholder="Today Mock %" className="mr-sm-2" value={this.state.todayMockPercentage || ""} onChange={this.setTodayMockPercentage} />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Statistical Period</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder="Statistical Period" className="mr-sm-2" value={this.state.fundStatisticalPeriod} onChange={this.setFundStatisticalPeriod} style={{ width: 66 }} />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Data Range</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder="Data Range" className="mr-sm-2" value={this.state.fundDataLength} onChange={this.setFundDataLength} style={{ width: 66 }} />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Fund Code</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" placeholder="Fund Code" className="mr-sm-2" value={this.state.fundCode} onChange={this.setFundCode} style={{ width: 88 }} />
                  </InputGroup>
                  <Button variant="primary" onClick={this.retrieveFundDetail}>Search</Button>
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
            <FundCharts fundData={this.state.fundData} />
          </Col>
        </Row>
        <ConfirmationDialog context={this.state.recentDeletionConfirmationDialogContext} show={this.state.showRecentDeletionConfirmationDialog}
          onCancelButtonClick={this.closeRecentDeletionConfirmationDialog}
          onOkButtonClick={this.deleteRecent}
        />
      </Container>
    );
  }
}

export default App;

// https://react-bootstrap.github.io/
// https://recharts.org/en-US
// https://reactjs.org/docs/hello-world.html

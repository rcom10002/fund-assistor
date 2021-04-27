import React, { Component } from 'react';

import { Navbar, Nav, NavDropdown, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

export default class FundRecents extends Component {
    constructor(props) {
      super(props);
      // this.state = { isDeletionConfirmationOpen, textForItemToDelete }
      this.handleRecentSelection = this.handleRecentSelection.bind(this);
      this.handleDeletion = this.handleDeletion.bind(this);
    }
  
    handleRecentSelection(fundCode, specificRecent) {
      console.log(['handleRecentSelection', fundCode, specificRecent])
      this.props.onRencentItemClick(
        fundCode,
        specificRecent.fundDataLength,
        specificRecent.fundStatisticalPeriod,
        specificRecent.todayMockPercentage,
        specificRecent.name
      );
    }
  
    handleDeletion(fundCode) {
      console.log(['handleDeletion', fundCode])  
      this.props.onRencentItemDeleteButtonClick(fundCode)
    }
  
    render() {
      console.log(['recents', this.props.recents])
      const recentItemList = Object.keys(this.props.recents).map((fundCode) =>
        <NavDropdown.Item onClick={(e) => this.handleRecentSelection(fundCode, this.props.recents[fundCode])} href="" key={fundCode}>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Kill This Item</Tooltip>}>
            <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.handleDeletion(fundCode); }}>&#9760;</Button>
          </OverlayTrigger>
          {' '}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Plan Strategy</Tooltip>}>
            <Button variant="outline-info" onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.handleDeletion(fundCode); }}>&#9775;</Button>
          </OverlayTrigger>
          {' '}
          {fundCode} - {this.props.recents[fundCode].name}
        </NavDropdown.Item>
      );
      return (
        <NavDropdown title="Recent" id="basic-nav-dropdown">{recentItemList}</NavDropdown>
      )
    }
  }
  
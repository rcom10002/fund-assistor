import React, { Component } from 'react';

import { Form, FormControl, Modal, ButtonGroup, Button, SplitButton, DropdownButton, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';


export default class ConfirmationDialog extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <Modal
          show={this.props.show}
          onHide={this.props.onCancelButtonClick}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmation for Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you wanna kill {this.props.context.bodyText}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.props.onOkButtonClick(this.props.context) }>Understood</Button>
            <Button variant="secondary" onClick={this.props.onCancelButtonClick}>Close</Button>
          </Modal.Footer>
        </Modal>
      )
    }
  }
  
  
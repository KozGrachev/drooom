import { Button, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import SocketAPIContext from '../api';
import '../style/sessionLink.scss'

import {
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"

import { v4 } from 'uuid';
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom';

export function SessionLink () {
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const roomId = useContext(SocketAPIContext);
  const { isOpen, onOpen, onClose } = useDisclosure()


  useEffect(() => {
    onOpen()
  }, []);

  function copyToClipboard () {
    textAreaRef.current.select();
    document.execCommand('copy');
    setCopySuccess('Copied!');
  };



  return (
    <Router>

      

    </Router>
  )
}

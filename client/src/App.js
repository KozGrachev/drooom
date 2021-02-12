import './style/App.scss';
import { useEffect, useState } from 'react';
import { socket, } from './api'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom';
import Sandbox from './components/Sandbox';
import { v4 } from 'uuid';
import { Button, ButtonGroup, ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { SessionLink } from './components/SessionLink'

function App () {

  const [roomId, setRoomId] = useState();

  useEffect(() => {
    return () => {
      socket.disconnect();
      return socket.emit('leave-room', roomId);

    }
  }, [])

  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: '#505050',
          color: "white",
        },
        a: {
          color: "teal.500",
          _hover: {
            textDecoration: "underline",
          },
        },
      },
    },
  });


  return (
    <ChakraProvider theme={theme}>
      <Router>


        <div className="session-link-btn">
          <ButtonGroup >
            <Button >
              <Link to={`/room/${v4()}`}>Start new</Link>
            </Button>
            <SessionLink />
          </ButtonGroup>
        </div>


        <Switch>
          <Route path="/room/:roomId">
            <Sandbox />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;

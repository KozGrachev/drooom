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
    // socket.on('connect', () => setRoomId(socket.id));
    // socket.on
    return () => {
      socket.disconnect();
      return socket.emit('leave-room', roomId);

    }
  }, [])

  const theme = extendTheme({
    styles: {
      global: {
        // styles for the `body`
        body: {
          bg: '#505050',
          color: "white",
        },
        // styles for the `a`
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
    // <Slider rows={2}>
    <ChakraProvider theme={theme}>
      <Router>


        <ButtonGroup>
          <Button className="session-link-btn">
            <Link to={`/room/${v4()}`}>Start new</Link>
          </Button>

          <SessionLink />

        </ButtonGroup>


        <Switch>
          <Route path="/room/:roomId">
            <Sandbox />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
    // </Slider>
  );
}

export default App;

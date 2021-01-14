import './style/App.scss';
import { Drums } from './components/Drums'
// import {playPause, addLoop} from './tone/main';
import { Lead } from './components/Lead';

function App () {

  return (
    <div className="app-container">
      <Lead  />
      <Drums  />
    </div>
  );
}

export default App;

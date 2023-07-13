import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home/Home';
import { CreationRoom } from './components/CreateRoom/CreationRoom';
import { Sala } from './components/Sala/Sala';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='home' element={<Home />} />
        <Route path='creation-room' element={<CreationRoom />} />
        <Route path='sala/:codigo' element={<Sala />} />
      </Routes>
    </>
  );
}

export default App;

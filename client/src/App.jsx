import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SingleNode from './pages/SingleNode';

const App = () => {
  return (
    <Routes>
      <Route path='/' index element={<HomePage />}></Route>
      <Route path='/single-node' index element={<SingleNode />}></Route>
    </Routes>
  );
};

export default App;

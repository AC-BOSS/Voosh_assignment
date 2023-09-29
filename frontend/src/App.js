import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AddOrder from './pages/AddOrder';
import GetOrder from './pages/GetOrder';

function App() {
	return (
    	<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path='/' element={<GetOrder/>} />
					<Route exact path='/register' element={<SignUp/>} />
					<Route exact path='/login' element={<SignIn/>} />
          <Route exact path='/add-order' element={<AddOrder/>} />
				</Routes>
			</BrowserRouter>
    	</div>
  );
}

export default App;
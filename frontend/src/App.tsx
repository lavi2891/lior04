import React from 'react'
import Register from './components/user/Register'
import Login from './components/user/Login'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import VacationList from './components/vacations/VacationList'
import ManagerVacationList from './components/manage/VacationList'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/vacations' element={<VacationList />} />
                <Route path='/manage' element={<ManagerVacationList />} />
                <Route path='/' element={<Navigate to='/vacations' />} />
            </Routes>
        </Router>
    )
}

export default App

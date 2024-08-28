import React from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from './useAuth';

const PrivateRoute=({element})=>{
    const {user}=useAuth();

    return user?element:<Navigate to='/Login'/>;
};

export default PrivateRoute;
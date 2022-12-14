import React from 'react'
import loadable from '@loadable/component';

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));
const Workspace = loadable(() => import('@layouts/Workspace'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/workspace/:workspace" element={<Workspace />}>
                <Route path="channel/:channel" element={<Channel />} />
                <Route path="dm/:id" element={<DirectMessage />} />
            </Route>
        </Routes>
    )
}

export default App
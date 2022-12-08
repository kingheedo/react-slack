import { getLogin } from '@apis/Login';
import { postLogout } from '@apis/Logout';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { Navigate, useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper } from './styles';
import gravatar from 'gravatar';
import { IUser } from '@pages/typings/db';
import Menu from '@components/Menu';
const Workspace = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isLoading, error, data: loginData, refetch } = useQuery<IUser>(['login'], () => getLogin());
    const navigate = useNavigate();
    const onLogout = () => {
        postLogout().then(() => {
            refetch();
        })
    }

    const onClickUserProfile = () => {
        setShowUserMenu((prev) => (!prev))
    }

    if (loginData) {
        console.log('123', loginData)
    }
    if (!loginData) {
        return <Navigate to='/login' />
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(loginData.email, { s: '28px', d: 'retro' })} alt={loginData.email} />
                        {showUserMenu &&
                            <Menu onCloseModal={onClickUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(loginData.email, { s: '28px', d: 'retro' })} alt={loginData.email} />
                                    <div>
                                        <span id="profile-name">{loginData.email}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>}
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>
                    test
                </Workspaces>
                <Channels>
                    <WorkspaceName>channel</WorkspaceName>
                    <MenuScroll>menuscroll</MenuScroll>
                </Channels>
                <Chats>
                    <Outlet />
                </Chats>
            </WorkspaceWrapper>
        </div>
    )
}

export default Workspace
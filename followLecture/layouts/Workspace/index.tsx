import { getLogin } from '@apis/Login';
import { postLogout } from '@apis/Logout';
import React, { useState, VFC } from 'react'
import { useQuery } from 'react-query';
import { Navigate, useNavigate, useParams } from 'react-router';
import { Outlet } from 'react-router-dom';
import { AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceName, Workspaces, WorkspaceWrapper, WorkspaceModal } from './styles';
import gravatar from 'gravatar';
import { IChannel, IUser } from '@pages/typings/db';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { Button, Label } from '@pages/Login/styles';
import customInput from '@hooks/customInput';
import Modal from '@components/Modal';
import { getChannel, postWorkSpace } from '@apis/Workspace';
import axios from 'axios';
import CreateChannelModal from '@components/CreateChannelModal';

const Workspace: VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

    const { workspace } = useParams<{ workspace: string }>();
    const navigate = useNavigate();

    const { isLoading, error, data: loginData, refetch } = useQuery<IUser>(['login'], () => getLogin());
    const { data: channelData } = useQuery<IChannel[] | null>(['channel'], () => loginData ? getChannel(workspace) : null);

    const [newWorkspace, setNewWorkspace, onChangeNewWorkspace] = customInput('');
    const [newUrl, setNewUrl, onChangeNewUrl] = customInput('');

    const onLogout = () => {
        postLogout().then(() => {
            refetch();
        })
    }

    const onClickUserProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowUserMenu((prev) => (!prev))
    }

    const onClickCreateWorkspace = () => {
        setShowCreateWorkspaceModal(true);
    }
    const onCloseModal = () => {
        setShowCreateWorkspaceModal(false);
        setShowWorkspaceModal(false);
        setShowCreateChannelModal(false);
    }
    const onCreateWorkspace = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        postWorkSpace({ workspace: newWorkspace, url: newUrl })
            .then(() => {
                refetch();
                setShowCreateWorkspaceModal(false);
                setNewWorkspace('');
                setNewUrl('');
            })
            .catch((error) => {
                console.dir(error);
            })
    }

    const toggleWorkspaceModal = () => {
        setShowWorkspaceModal((prev) => !prev);
    }

    const onClickAddChannel = () => {
        setShowCreateChannelModal(true);
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
                            <Menu onCloseModal={onClickUserProfile} style={{ right: 0, top: 38 }}>
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
                    {loginData?.Workspaces.map((ws) => {
                        return (
                            <Link key={ws.id} to={`/workspace/channel/일반`}>
                                <WorkspaceButton>
                                    {ws.name.slice(0, 1).toUpperCase()}
                                </WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>channel</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickAddChannel}>채널 만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>
                        {channelData?.map((v) => {
                            return (
                                <div>
                                    {v.name}
                                </div>
                            )
                        })}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Outlet />
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal} />
        </div>
    )
}

export default Workspace
import { getLogin } from '@apis/Login';
import { getChannel, postChannel } from '@apis/Workspace';
import Modal from '@components/Modal'
import customInput from '@hooks/customInput';
import { Button, Label } from '@pages/Login/styles';
import { IChannel, IUser } from '@pages/typings/db';
import { AxiosError } from 'axios';
import React, { VFC } from 'react'
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
interface ICreateChannelModal {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChannelModal: VFC<ICreateChannelModal> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
    const { isLoading, error, data: loginData, refetch } = useQuery<IUser>(['login'], () => getLogin());
    const { data: channelData, refetch: refetchChannel } = useQuery<IChannel[] | null>(['channel'], () => loginData ? getChannel(workspace) : null);

    const [newChannel, setNewChannel, onChangeNewChannel] = customInput('');

    const { workspace, channel } = useParams();

    const onCreateChannel = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (workspace) {
            postChannel(workspace, { name: newChannel })
                .then(() => {
                    onCloseModal();
                    setNewChannel('');
                    refetchChannel();
                })
                .catch((error: AxiosError) => {
                    console.dir(error);
                    toast.error(error.response?.data, { position: 'bottom-center' });
                })
        }
    }

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널 이름</span>
                    <input id="channel" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
}

export default CreateChannelModal
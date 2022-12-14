import React, { FC } from 'react'
import { CloseModalButton, CreateModal } from './styles';

interface IModal {
    show: boolean;
    onCloseModal: () => void;
}

const Modal: FC<IModal> = ({ show, children, onCloseModal }) => {
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    if (!show) {
        return null;
    }

    return (
        <CreateModal onClick={onCloseModal}>
            <div onClick={stopPropagation}>
                <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
                {children}
            </div>
        </CreateModal>
    )
}

export default Modal
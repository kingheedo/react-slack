import React, { FC, PropsWithChildren } from 'react'
import { CloseModalButton, CreateMenu } from './styles'

interface IProps {
    onCloseModal: () => void;
    closeButton?: boolean;
}
const Menu: FC<IProps> = ({ children, onCloseModal }) => {
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    return (
        <CreateMenu onClick={onCloseModal}>
            <div onClick={stopPropagation}>
                <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
                {children}
            </div>
        </CreateMenu>
    )
}

export default Menu
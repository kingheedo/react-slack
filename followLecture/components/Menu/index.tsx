import React, { CSSProperties, FC, PropsWithChildren } from 'react'
import { CloseModalButton, CreateMenu } from './styles'

interface IProps {
    show?: boolean;
    onCloseModal: (e: React.MouseEvent) => void;
    closeButton?: boolean;
    style?: CSSProperties;
}
const Menu: FC<IProps> = ({ children, show, onCloseModal, style }) => {
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }
    if (!show) {
        return null;
    }
    return (
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
                {children}
            </div>
        </CreateMenu>
    )
}

export default Menu
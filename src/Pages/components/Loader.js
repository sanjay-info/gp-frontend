import React from 'react';
import { Modal } from 'react-bootstrap';
import { RotatingLines } from 'react-loader-spinner'

function Loader({ visible }) {
    return (
        <Modal onShow={true} style={{ background: "transperent" }}>
            <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
            />
        </Modal>
    )
}

export default Loader;
import { useContext } from "react";
import { createPortal } from "react-dom";
import { modalContext } from "@web/context/modal";
import ModalBase from "@web/components/modal/ModalBase";

/**
 * hook to handle display status of new group form modal.
 */
const useModal = () => {

    // state variable to manage modal display status
    const { showModalState, setShowModalState } = useContext(modalContext);


    const showModal = () => {
        setShowModalState(true)
    }

    const hideModal = () => {
        setShowModalState(false)
    }

    /**
     * this function should be called inside render lifecycle of component.
     */
    const ModalPortal = (ModalComponent: JSX.Element): React.ReactPortal | null => {

        const modalDiv = document.getElementById("modal");

        if (modalDiv === null) throw Error("element with id 'modal' not found")

        if (showModalState) return createPortal(<ModalBase close={hideModal}> {ModalComponent} </ModalBase>, modalDiv)

        return null
    }

    return {
        showModal,
        hideModal,
        ModalPortal
    }
}

export default useModal;
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface IContextValue {
    showModalState: boolean
    setShowModalState: Dispatch<SetStateAction<boolean>>
}

/**
 * context api for status of newGroup Form modal display
 */
export const modalContext = createContext<IContextValue>({ showModalState: false, setShowModalState: () => undefined });


/**
 * context api provider for {@link modalContext}
 */
const ModalContextProvider = ({ children }: React.PropsWithChildren) => {
    const [showModalState, setShowModalState] = useState(false);

    return (
        <modalContext.Provider value={{ showModalState, setShowModalState }}>
            {children}
        </modalContext.Provider>
    )
}

export default ModalContextProvider;
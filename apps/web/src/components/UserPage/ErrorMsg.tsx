import styles from "./ErrorMsg.module.css"

interface IFormErrorprops {
    message: string
}

const FormError: React.FC<IFormErrorprops> = ({ message }) => {
    return (
        <p className={styles.error_message}>{message}</p>
    );
}

export default FormError;
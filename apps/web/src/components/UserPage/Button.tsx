import styles from "./Button.module.css"

interface Iprops {
    variant: "filled" | "outline"
    text: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    className?: string
    type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
}

const FormButton: React.FC<Iprops> = ({ variant, text, onClick, className = "", type }) => {

    const variantCSS = variant === "filled" ? styles.filled : styles.outline

    return (
        <button className={`${styles.button} ${variantCSS} ${className}`}
            type={type}
            onClick={onClick || undefined}>
            {text}
        </button>
    );
}

export default FormButton;
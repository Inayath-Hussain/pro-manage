import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import styles from "./common.module.css";
import FormButton from "@web/components/UserPage/Button";
import FormError from "@web/components/UserPage/ErrorMsg";
import FormInput, { IFormInputProps } from "@web/components/UserPage/Input";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { routes } from "@web/routes";
import { loginService } from "@web/services/api/loginService";

const LoginPage = () => {

    const navigate = useNavigate();
    const { signalRef } = useAbortController();

    // schema to validate form values
    const formSchema = z.object({
        email: z.string({ required_error: "email is required" }).email({ message: "Invalid email" }),
        password: z.string({ required_error: "password is required" }).trim().min(8, "should have atleast 8 characters"),
    })
    // interface for form
    type IForm = z.infer<typeof formSchema>


    const initialValues: IForm = {
        email: "",
        password: ""
    }

    // form input values
    const [formState, setFormState] = useState<IForm>({
        email: "",
        password: ""
    })

    // form input errors
    const [formErrors, setFormErrors] = useState<IForm>({
        email: "",
        password: ""
    })

    // form submition error 
    const [submitionError, setSubmitionError] = useState("");


    interface IinputsArray {
        inputKey: keyof IForm
        inputType: IFormInputProps["inputType"]
        placeHolderProp: IFormInputProps["placeHolderProp"]
        required: IFormInputProps["required"]
    }

    // form inputs
    const inputs: IinputsArray[] = [
        { inputKey: "email", inputType: "email", placeHolderProp: "Email", required: true },
        { inputKey: "password", inputType: "password", placeHolderProp: "Password", required: true }
    ]

    /**
     * updates {@link formState} values
     * @param property one of the property name(or key) of {@link formState}
     */
    const handleChange = (property: keyof typeof formState, e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState, [property]: e.target.value })
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // validate fields (formState)
        try {
            await formSchema.parseAsync(formState)

            await loginService(formState, signalRef.current.signal)

            setSubmitionError('')

            navigate(routes.home)
        }
        catch (ex) {
            // if error is a validation error 
            if (ex instanceof z.ZodError) {
                const { email, password } = ex.formErrors.fieldErrors

                setSubmitionError('')

                return setFormErrors({
                    email: email ? email[0] : "",
                    password: password ? password[0] : ""
                })
            }

            // if error is caused due to invalid form input values
            if (typeof ex === "object") {
                return setFormErrors(ex as any)
            }

            setFormErrors(initialValues)
            setSubmitionError(ex as string)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            {/* form header */}
            <h1 className={styles.form_header}>Login</h1>

            <FormError message={submitionError} />

            {inputs.map(inp => (

                <div className={styles.form_input_container} key={inp.inputKey}>
                    <FormInput inputType={inp.inputType} onChange={e => handleChange(inp.inputKey, e)}
                        containerclassName={styles.form_input} required={inp.required} />

                    <FormError message={formErrors[inp.inputKey]} />
                </div>

            ))}


            {/* submit button */}
            <FormButton text="Log in" variant="filled" type="submit"
                className={`${styles.first_button} ${styles.button}`} />


            <p className={styles.text}>Have no account yet?</p>


            {/* register link */}
            <Link to={routes.user.register} className={styles.link}>

                <FormButton text="Register" variant="outline" type="button"
                    className={`${styles.button} ${styles.second_button}`} />

            </Link>

        </form>
    );
}

export default LoginPage;
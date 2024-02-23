import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import styles from "./common.module.css"
import FormButton from "@web/components/UserPage/Button";
import FormError from "@web/components/UserPage/ErrorMsg";
import FormInput, { IFormInputProps } from "@web/components/UserPage/Input";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { routes } from "@web/routes";
import { registerService } from "@web/services/api/registerService";
import { useOnline } from "@web/hooks/useOnline";



const RegisterPage = () => {

    const navigate = useNavigate();
    const { signalRef } = useAbortController();
    const { isOnline } = useOnline();

    // password validation schema
    const passwordSchema = (fieldName: string) => z.string({ required_error: `${fieldName} is required` }).trim().min(8, "should have atleast 8 characters")

    // schema to validate form values
    const formSchema = z.object({
        name: z.string({ required_error: "name is required" }),
        email: z.string({ required_error: "email is required" }).email({ message: "Invalid email" }),
        password: passwordSchema("password"),
        confirmPassword: passwordSchema("confirmPassword"),
    }).refine(({ confirmPassword, password }) => confirmPassword === password, { path: ["confirmPassword"], message: "doesn't match with password" })

    // interface for form
    type IForm = z.infer<typeof formSchema>

    const initialValues: IForm = {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    // form input values
    const [formState, setFormState] = useState<IForm>(initialValues)

    // form input errors
    const [formErrors, setFormErrors] = useState<IForm>(initialValues)

    // to display any form submition errors(like - email is already registered)
    const [submitionError, setSubmitionError] = useState("");

    // loader state for register api call
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!isOnline) setSubmitionError("You are offline")
        else setSubmitionError("")
    }, [isOnline])



    /**
     * updates {@link formState} values
     * @param property one of the property name(or key) of {@link formState}
     */
    const handleChange = (property: keyof IForm, e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState, [property]: e.target.value })
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            // validate form values
            await formSchema.parseAsync(formState)

            // remove if any form input errors from previous submition attempt are present
            setFormErrors(initialValues)

            setLoading(true)

            // register api
            await registerService({ email: formState.email, name: formState.name, password: formState.password }, signalRef.current.signal)

            // remove if any form submition errors from previous attempt are present
            setSubmitionError('')

            // on successful registration navigate to home page
            navigate(routes.home)
        }
        catch (ex) {

            // if error is validation error
            if (ex instanceof z.ZodError) {
                const { name, email, password, confirmPassword } = ex.formErrors.fieldErrors

                // remove if any form submition errors from previous attempt are present
                setSubmitionError('')

                return setFormErrors({
                    name: name ? name[0] : "",
                    email: email ? email[0] : "",
                    password: password ? password[0] : "",
                    confirmPassword: confirmPassword ? confirmPassword[0] : ""
                })
            }


            // if error is caused due to invalid form input values
            else if (typeof ex === "object") {
                return setFormErrors(ex as any)
            }

            else {
                // remove if any form input errors from previous submition attempt are present
                setFormErrors(initialValues)
                setSubmitionError(ex as string)
            }

            setLoading(false)
        }
    }


    interface IinputsArray {
        inputKey: keyof IForm
        inputType: IFormInputProps["inputType"]
        placeHolderProp: IFormInputProps["placeHolderProp"]
        required: IFormInputProps["required"]
    }

    // form inputs
    const inputs: IinputsArray[] = [
        { inputKey: "name", inputType: "name", placeHolderProp: "Name", required: true },
        { inputKey: "email", inputType: "email", placeHolderProp: "Email", required: true },
        { inputKey: "password", inputType: "password", placeHolderProp: "Password", required: true },
        { inputKey: "confirmPassword", inputType: "password", placeHolderProp: "Confirm Password", required: true },
    ]


    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            {/* form header */}
            <h1 className={styles.form_header}>Register</h1>

            <FormError message={submitionError} />


            {inputs.map(inp => (

                <div className={styles.form_input_container} key={inp.inputKey}>
                    <FormInput inputType={inp.inputType} onChange={e => handleChange(inp.inputKey, e)} required={inp.required}
                        containerclassName={styles.form_input} placeHolderProp={inp.placeHolderProp} />

                    <FormError message={formErrors[inp.inputKey]} />
                </div>

            ))}



            {/* submit button */}
            <FormButton text="Register" variant="filled" type="submit"
                className={`${styles.first_button} ${styles.button}`} disabled={!isOnline} loading={loading} />


            <p className={styles.text}>Have an account ?</p>


            {/* login link */}
            <Link to={routes.user.login} className={styles.link}>
                <FormButton text="Log in" variant="outline" type="button"
                    className={`${styles.button} ${styles.second_button}`} disabled={false} />
            </Link>

        </form>
    );
}

export default RegisterPage;
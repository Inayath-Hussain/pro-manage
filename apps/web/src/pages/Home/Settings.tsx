import { useState, Fragment, useEffect } from "react";
import z from "zod";
import FormButton from "@web/components/UserPage/Button";
import FormError from "@web/components/UserPage/ErrorMsg";
import FormInput, { IFormInputProps } from "@web/components/UserPage/Input";
import { useOnline } from "@web/hooks/useOnline";

import styles from "./Settings.module.css"

const SettingsPage = () => {

    const { isOnline } = useOnline();

    const passwordSchema = z.string().trim()

    const formSchmea = z.object({
        name: z.string().trim(),
        oldPassword: passwordSchema,
        newPassword: passwordSchema
    }).superRefine(({ name, newPassword, oldPassword }, ctx) => {


        // if both name and passwords field are empty then issue an error
        if (name === "" && newPassword === "" && oldPassword === "") {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["name", "oldPassword", "newPassword"],
                message: "Atleast Name or passwords should be filled to update"
            })
        }

        // if only one of the password field has value then issue an error
        if (newPassword !== "" || oldPassword !== "") {

            // if newPassword is empty then issue a zod validation error
            if (newPassword === "") ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["newPassword"],
                message: "New Password must be provided"
            })

            // if oldPassword is empty then issue a zod validation error
            if (oldPassword === "") ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["oldPassword"],
                message: "Old Password must be provided"
            })


            // if executor reaches here then it means both oldPassword and newPassword are provided.
            // Now check if both has atleast 8 characters
            if (newPassword!.length < 8) ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 8,
                type: "string",
                inclusive: false,
                path: ["newPassword"],
                message: "Must be atleast 8 letters long"
            })

            if (oldPassword!.length < 8) ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 8,
                type: "string",
                inclusive: false,
                path: ["oldPassword"],
                message: "Must be atleast 8 letters long"
            })


            if (oldPassword === newPassword) ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["newPassword"],
                message: "New password cannot be same as present password"
            })
        }

    })

    type IForm = z.infer<typeof formSchmea>

    const initialValues: IForm = {
        name: "",
        oldPassword: "",
        newPassword: ""
    }

    const [formValues, setFormValues] = useState<IForm>({
        name: "",
        oldPassword: "",
        newPassword: ""
    })


    const [formErrors, setFormErrors] = useState<IForm>({
        name: "",
        oldPassword: "",
        newPassword: ""
    })

    const [submitionError, setSubmitionError] = useState("");

    useEffect(() => {
        if (!isOnline) setSubmitionError("You are offline")
        else setSubmitionError("")
    }, [isOnline])



    /**
     * updates {@link formValues} values
     * @param property one of the property name(or key) of {@link formState}
     */
    const handleChange = (property: keyof IForm, e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [property]: e.target.value })
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            // validate formValues
            await formSchmea.parse(formValues)

            // use update service

            setFormErrors(initialValues)
        }
        catch (ex) {
            if (ex instanceof z.ZodError) {
                const { name, oldPassword, newPassword } = ex.formErrors.fieldErrors

                // zod error with name as key means all the input fields are empty
                if (name) {
                    setFormErrors(initialValues)
                    return setSubmitionError(name[0])
                }

                setSubmitionError("");

                setFormErrors({
                    ...formErrors,
                    oldPassword: oldPassword ? oldPassword[0] : "",
                    newPassword: newPassword ? newPassword[0] : ""
                })
            }
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
        { inputKey: "name", inputType: "name", placeHolderProp: "Name", required: false },
        { inputKey: "oldPassword", inputType: "password", placeHolderProp: "Old Password", required: false },
        { inputKey: "newPassword", inputType: "password", placeHolderProp: "New Password", required: false },
    ]



    return (
        <section className={styles.page_container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.form_header}>Settings</h1>

                <FormError message={submitionError} className={styles.main_error_message} />


                {inputs.map(inp => (
                    <Fragment key={inp.inputKey}>
                        <FormInput inputType={inp.inputType} onChange={e => handleChange(inp.inputKey, e)} required={inp.required}
                            placeHolderProp={inp.placeHolderProp} containerclassName={styles.input_container} />

                        <FormError message={formErrors[inp.inputKey]} />
                    </Fragment>
                ))}


                <FormButton text="Update" type="submit" variant="filled" className={styles.button} disabled={!isOnline} />

            </form>

        </section>
    );
}

export default SettingsPage;
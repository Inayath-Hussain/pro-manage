import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import z from "zod";
import FormButton from "@web/components/UserPage/Button";
import FormError from "@web/components/UserPage/ErrorMsg";
import FormInput, { IFormInputProps } from "@web/components/UserPage/Input";
import { useOnline } from "@web/hooks/useOnline";
import useForm from "@web/hooks/useForm";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { routes } from "@web/routes";
import { userUpdateService } from "@web/services/api/user/userUpdateService";
import { userInfoSelector } from "@web/store/slices/userInfoSlice";

import commonStyle from "./Index.module.css";
import styles from "./Settings.module.css";

import { UserUpdateMiddlewareError } from "@pro-manage/common-interfaces";


const SettingsPage = () => {

    const userInfo = useSelector(userInfoSelector)
    const navigate = useNavigate();

    const { isOnline } = useOnline();
    const { signalRef } = useAbortController();

    const passwordSchema = z.string().trim()

    const formSchmea = z.object({
        name: z.string().trim(),
        oldPassword: passwordSchema,
        newPassword: passwordSchema
    }).superRefine(({ name, newPassword, oldPassword }, ctx) => {

        // function to create zod custom error
        const addCustomIssue = (path: string, message: string) =>
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [path],
                message
            })


        /**
         * function to create zod's "too small issue" for password fields when value's length is less than 8
         *   */
        const addPasswordIssue = (path: string) => {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 8,
                type: "string",
                inclusive: false,
                path: [path],
                message: "Must be atleast 8 letters long"
            })
        }


        // if both name and passwords field are empty then issue an error and return
        if (name === "" && newPassword === "" && oldPassword === "")
            return addCustomIssue("all", "Atleast Name or passwords should be filled to update")

        // if only one of the password field has value then issue an error
        if (newPassword !== "" || oldPassword !== "") {

            // if newPassword is empty then issue a zod validation error
            if (newPassword === "")
                addCustomIssue("newPassword", "New Password must be provided")


            // if oldPassword is empty then issue a zod validation error
            if (oldPassword === "")
                addCustomIssue("oldPassword", "Old Password must be provided")


            // Now check if each of the password fields have atleast 8 characters
            if (newPassword!.length < 8) addPasswordIssue("newPassword")

            if (oldPassword!.length < 8) addPasswordIssue("oldPassword")


            if (oldPassword === newPassword)
                addCustomIssue("newPassword", "New password cannot be same as present password")
        }

    })

    type IForm = z.infer<typeof formSchmea>

    const initialValues: IForm = {
        name: "",
        oldPassword: "",
        newPassword: ""
    }

    const {
        formValues,
        formErrors, setFormErrors,
        submitionError, setSubmitionError,
        loading, setLoading,
        handleChange
    } = useForm({ initialValues })


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            // validate formValues
            await formSchmea.parse(formValues)

            setLoading(true)

            // use update service
            await userUpdateService(formValues, signalRef.current.signal)

            setLoading(false)
            setFormErrors(initialValues)
            setSubmitionError("")

            // toast for successful user updation
        }
        catch (ex) {
            setLoading(false)

            if (ex instanceof z.ZodError) {
                const { oldPassword, newPassword, all } = ex.formErrors.fieldErrors

                // if zod field error contains a key called "all" then it means all the input fields are empty.
                if (all) {
                    setFormErrors(initialValues)
                    return setSubmitionError(all[0])
                }

                // if executor reaches here then password fields did not pass their schema
                setSubmitionError("");

                setFormErrors({
                    ...formErrors,
                    oldPassword: oldPassword ? oldPassword[0] : "",
                    newPassword: newPassword ? newPassword[0] : ""
                })
            }

            // if error is for input values
            else if (ex instanceof UserUpdateMiddlewareError) {
                setFormErrors(ex.errors)
                setSubmitionError("")
            }

            // if unauthorized error(invalid auth tokens)
            else if (ex === false) {
                navigate(routes.user.login)
            }

            else {
                setFormErrors(initialValues)
                setSubmitionError(ex as string)
            }
        }
    }

    interface IinputsArray {
        inputKey: keyof IForm
        inputType: IFormInputProps["inputType"]
        placeHolderProp: IFormInputProps["placeHolderProp"]
        required: IFormInputProps["required"],
        defaultValue?: IFormInputProps["defaultValue"]
    }


    // form inputs
    const inputs: IinputsArray[] = [
        { inputKey: "name", inputType: "name", placeHolderProp: "Name", required: false, defaultValue: userInfo.name },
        { inputKey: "oldPassword", inputType: "password", placeHolderProp: "Old Password", required: false },
        { inputKey: "newPassword", inputType: "password", placeHolderProp: "New Password", required: false },
    ]


    const disabled = userInfo.status !== "success" || !isOnline

    return (
        <section className={commonStyle.page_container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={commonStyle.page_header}>Settings</h1>

                <FormError message={submitionError} className={styles.main_error_message} />


                {inputs.map(inp => (
                    <Fragment key={inp.inputKey}>
                        <FormInput inputType={inp.inputType} onChange={e => handleChange(inp.inputKey, e)} required={inp.required}
                            placeHolderProp={inp.placeHolderProp} containerclassName={styles.input_container} defaultValue={inp.defaultValue} />

                        <FormError message={formErrors[inp.inputKey]} />
                    </Fragment>
                ))}


                <FormButton text="Update" type="submit" variant="filled" className={styles.button}
                    disabled={disabled} loading={loading} />

            </form>

        </section>
    );
}

export default SettingsPage;
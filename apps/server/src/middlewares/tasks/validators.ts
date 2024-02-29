import { IAddTaskBody } from "@pro-manage/common-interfaces";

// import { isDate } from "validator"
import { priorityEnum } from "../../models/task";

interface Valid {
    valid: true
}

interface InValid {
    valid: false
    errorMessage: string
}

export const validateCheckList = (checkList: any): Valid | InValid => {

    /**
     * validates object values in checkList
     */
    const areCheckListObjectsValid = (arr: typeof checkList) => arr.every((list: any) => {

        // if description and done properties are not of valid type
        if (typeof list.description !== "string" || typeof list.done !== "boolean") return false

        const keys = Object.keys(list)
        // if objects in array donot contain valid properties
        if (keys.length !== 2 || !keys.includes("description") || !keys.includes("done")) return false

        return true
    })


    /**
     * validates description property contains a non empty value
     */
    const areDescriptionValuesValid = (arr: IAddTaskBody["checkList"]) => arr.every(({ description }) => description.trim().length > 0)

    switch (true) {
        // if checkList value is falsy
        case (!checkList):
            return { valid: false, errorMessage: "checkList is required" }

        case (!Array.isArray(checkList)):
            return { valid: false, errorMessage: "checkList should be type 'Array'" };

        case (checkList.length === 0):
            return { valid: false, errorMessage: "checkList array cannot be empty" };

        case (!areCheckListObjectsValid(checkList)):
            return {
                valid: false,
                errorMessage: "should contain array of objects with properties 'description' of type string and 'done' of type boolean"
            };

        case (!areDescriptionValuesValid(checkList)):
            return {
                valid: false,
                errorMessage: "description and done are required"
            }
    }

    return { valid: true }
}




export const validatePriority = (priority: any): Valid | InValid => {
    switch (true) {
        // check if priority exists
        case (!priority):
            return { valid: false, errorMessage: "priority is required" };

        // if priority isn't of type string
        case (typeof priority !== "string"):
            return { valid: false, errorMessage: "priority should be type 'string'" }

        // if priority value isn't one of the accepted values
        case (!priorityEnum.includes(priority)):
            return { valid: false, errorMessage: `priority value should be one of '${priorityEnum.join(", ")}'` }

        default:
            return { valid: true }
    }
}
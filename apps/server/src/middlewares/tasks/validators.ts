import { IAddTaskBody } from "@pro-manage/common-interfaces";

// import { isDate } from "validator"
import { priorityEnum, statusEnum } from "@pro-manage/common-interfaces";

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




export const validateTitle = (title: any): Valid | InValid => {
    // check if title exists and is of type string
    switch (true) {
        case (!title):
            return { valid: false, errorMessage: "title is required" }

        case (typeof title !== "string"):
            return { valid: false, errorMessage: "title should be type 'string'" }

        default:
            return { valid: true }
    }
}



/**
 * checks if dueDate exists then it is a valid string
 */
export const validateDueDate = (dueDate: any): Valid | InValid => {
    if (dueDate !== undefined && !(Date.parse(dueDate))) return { valid: false, errorMessage: "Invalid date" }

    return { valid: true }
}





export const validateTaskID = (id: any): Valid | InValid => {
    switch (true) {
        case (!id):
            return { valid: false, errorMessage: "taskId is required" }

        case (typeof id !== "string"):
            return { valid: false, errorMessage: "taskId should be type 'string'" }
    }

    return { valid: true }
}




export const validateStatus = (status: any): Valid | InValid => {
    switch (true) {
        // check if status exists
        case (!status):
            return { valid: false, errorMessage: "status is required" };

        // if priority isn't of type string
        case (typeof status !== "string"):
            return { valid: false, errorMessage: "status should be type 'string'" }

        // if priority value isn't one of the accepted values
        case (!statusEnum.includes(status)):
            return { valid: false, errorMessage: `status value should be one of '${statusEnum.join(", ")}'` }

        default:
            return { valid: true }
    }
}
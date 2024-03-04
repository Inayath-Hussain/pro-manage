export const priorityEnum = ["high", "moderate", "low"] as const
export const statusEnum = ["backlog", "in-progress", "to-do", "done"] as const


export interface IChecklist {
    description: string
    done: boolean
    _id: string
}

/**
 * tasks sent to or recived from server are in this format 
 */
export interface ITaskJSON {
    _id: string
    title: string
    priority: typeof priorityEnum[number]
    status: typeof statusEnum[number]
    checklist: IChecklist[]
    createdAt: string,
    dueDate?: string
}
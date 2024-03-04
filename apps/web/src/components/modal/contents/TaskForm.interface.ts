
export interface IChecklist {
    id: number
    description: string
    done: boolean
}

interface IDoneDetail {
    key: "done"
    value: boolean
}

interface IDescriptionDetail {
    key: "description"
    value: string
}

export type HandleChecklistItemChange = (itemId: number, detail: IDoneDetail | IDescriptionDetail) => void
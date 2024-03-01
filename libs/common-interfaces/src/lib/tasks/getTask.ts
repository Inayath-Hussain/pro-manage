export const getTasksFilterValues = ["day", "week", "month"] as const

export interface IGetTaskQuery {
    filter: typeof getTasksFilterValues[number]
}
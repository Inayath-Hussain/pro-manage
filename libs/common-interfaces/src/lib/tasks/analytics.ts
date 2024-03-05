export interface IAnalytics {
    backlog: number
    progress: number
    todo: number
    done: number
    high: number
    low: number
    moderate: number
    dueDate: number
}


export class TaskAnalytics implements IAnalytics {
    backlog: number;
    done: number;
    dueDate: number;
    high: number;
    low: number;
    moderate: number;
    progress: number;
    todo: number;

    constructor() {
        this.backlog = 0;
        this.progress = 0;
        this.todo = 0
        this.done = 0;

        this.high = 0;
        this.moderate = 0;
        this.low = 0;
        this.dueDate = 0;
    }

    addAnalytics(analytics: any) {
        type IKeys = keyof IAnalytics
        const keys = Object.keys(analytics[0]) as IKeys[]

        keys.forEach(k => {
            if (analytics[0][k].length > 0) this[k] = analytics[0][k][0].count
        })
    }
}
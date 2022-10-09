export type User = {
    id: number,
    email: string,
    nickname: string,
    submissions: number,
    accepted: number,
    wrong_answer: number,
    compilation_error: number,
    time_limit_exceeded: number,
    memory_limit_exceeded: number
}


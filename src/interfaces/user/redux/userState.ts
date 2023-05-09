import { MUser } from "src/models/user/user";

export interface IUserState {
    users: MUser[]
    filteredUsers: MUser[] | null
    currentUser: MUser | undefined
    cursor: string | null
}
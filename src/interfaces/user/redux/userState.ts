import { MUser } from "src/models/user/user";

export interface IUserState {
    users: MUser[];
    filteredUsers: MUser[] | null;
    cursor: string | null;
    currentUser: MUser | undefined;
};
import { MUser } from "src/models/user/user";

export interface IAuth {
    isAuthenticated: boolean,
    user: null | MUser,
    loaded: boolean
}
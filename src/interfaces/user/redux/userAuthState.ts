import { MUser } from "src/models/user/user";

export interface IUserAuthState {
    user: null | MUser,
    deviceId: null | string
}
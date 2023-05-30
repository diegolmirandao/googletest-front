import { IUser } from "./user/user";

export default interface IAuthResponse {
    user: IUser
    deviceId: string
}
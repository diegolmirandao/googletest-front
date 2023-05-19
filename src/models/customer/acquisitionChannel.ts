import { IAcquisitionChannel } from "src/interfaces/customer/acquisitionChannel";

export class MAcquisitionChannel {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(acquisitionChannel: IAcquisitionChannel) {
        this.id = acquisitionChannel.id;
        this.name = acquisitionChannel.name;
        this.createdAt = acquisitionChannel.created_at;
        this.updatedAt = acquisitionChannel.updated_at;
    };
};
import { IImage } from "src/interfaces/image/image";

export class MImage {
    public id: number;
    public path: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(image: IImage) {
        this.id = image.id;
        this.path = image.path;
        this.createdAt = image.created_at;
        this.updatedAt = image.updated_at;
    };
};
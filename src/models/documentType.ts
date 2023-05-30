import { IDocumentType } from "src/interfaces/document-type/documentType";

export class MDocumentType {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(documentType: IDocumentType) {
        this.id = documentType.id;
        this.name = documentType.name;
        this.createdAt = documentType.created_at;
        this.updatedAt = documentType.updated_at;
    };
};
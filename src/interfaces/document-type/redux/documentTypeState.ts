import { MDocumentType } from 'src/models/documentType';

export interface IDocumentTypeState {
    documentTypes: MDocumentType[],
    currentDocumentType: MDocumentType | undefined
}
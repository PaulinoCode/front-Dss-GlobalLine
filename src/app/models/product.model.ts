import { ClientModel } from "./client.model";

export interface ProductModel {
    id?: number;
    asin: string;
    name: string;
    price: number;
    cost: number;

    client?: ClientModel;
    clientId?: number;
}

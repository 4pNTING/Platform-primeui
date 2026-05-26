import { Product } from '../entities/Product';

export interface IProductRepository {
    getProducts(): Promise<Product[]>;
    createProduct(product: Omit<Product, 'id'>): Promise<Product>;
    updateProduct(product: Product): Promise<Product>;
    deleteProduct(id: string): Promise<void>;
}

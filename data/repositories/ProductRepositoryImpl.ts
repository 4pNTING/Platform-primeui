import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { MockProductDataSource } from '../datasources/MockProductDataSource';

export class ProductRepositoryImpl implements IProductRepository {
    private dataSource: MockProductDataSource;

    constructor(dataSource: MockProductDataSource) {
        this.dataSource = dataSource;
    }

    async getProducts(): Promise<Product[]> {
        return this.dataSource.fetchProducts();
    }
}

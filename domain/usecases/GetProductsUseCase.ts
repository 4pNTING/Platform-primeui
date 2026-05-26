import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export class GetProductsUseCase {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(): Promise<Product[]> {
        const products = await this.productRepository.getProducts();
        // business logic: sort products by price ascending
        return products.sort((a, b) => a.price - b.price);
    }
}

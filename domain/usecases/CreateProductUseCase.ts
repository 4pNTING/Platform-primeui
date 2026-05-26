import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export class CreateProductUseCase {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(product: Omit<Product, 'id'>): Promise<Product> {
        // Validation logic can be placed here
        if (!product.name.trim()) {
            throw new Error('Product name cannot be empty');
        }
        if (product.price < 0) {
            throw new Error('Product price cannot be negative');
        }
        return this.productRepository.createProduct(product);
    }
}

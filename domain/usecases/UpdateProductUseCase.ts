import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export class UpdateProductUseCase {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(product: Product): Promise<Product> {
        if (!product.id) {
            throw new Error('Product ID is required for update');
        }
        if (!product.name.trim()) {
            throw new Error('Product name cannot be empty');
        }
        if (product.price < 0) {
            throw new Error('Product price cannot be negative');
        }
        return this.productRepository.updateProduct(product);
    }
}

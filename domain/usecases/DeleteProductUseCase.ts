import { IProductRepository } from '../repositories/IProductRepository';

export class DeleteProductUseCase {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(id: string): Promise<void> {
        if (!id) {
            throw new Error('Product ID is required for deletion');
        }
        return this.productRepository.deleteProduct(id);
    }
}

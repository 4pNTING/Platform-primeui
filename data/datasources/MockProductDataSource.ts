import { Product } from '../../domain/entities/Product';

export class MockProductDataSource {
    private products: Product[] = [
        {
            id: '1',
            name: 'Clean Architecture Course',
            price: 199.99,
            description: 'Learn how to structure your enterprise apps correctly with Clean Architecture.',
            imageUrl: 'https://placehold.co/200x120?text=Clean+Arch'
        },
        {
            id: '2',
            name: 'React 18 Mastery',
            price: 149.50,
            description: 'Advanced patterns in React 18 including server components and suspense.',
            imageUrl: 'https://placehold.co/200x120?text=React+18'
        },
        {
            id: '3',
            name: 'Next.js 13 App Router Guide',
            price: 99.00,
            description: 'The complete handbook to building applications with the Next.js App Router.',
            imageUrl: 'https://placehold.co/200x120?text=Next.js+13'
        }
    ];

    async fetchProducts(): Promise<Product[]> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return [...this.products];
    }

    async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newProduct: Product = {
            ...product,
            id: Math.random().toString(36).substring(2, 9),
            imageUrl: product.imageUrl || 'https://placehold.co/200x120?text=Product'
        };
        this.products.push(newProduct);
        return newProduct;
    }

    async editProduct(product: Product): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const index = this.products.findIndex((p) => p.id === product.id);
        if (index === -1) {
            throw new Error('Product not found');
        }
        this.products[index] = {
            ...product,
            imageUrl: product.imageUrl || 'https://placehold.co/200x120?text=Product'
        };
        return this.products[index];
    }

    async removeProduct(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        this.products = this.products.filter((p) => p.id !== id);
    }
}

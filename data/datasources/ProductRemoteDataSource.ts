import { Product } from '../../domain/entities/Product';

export class ProductRemoteDataSource {
    private apiUrl = '/api/products';

    async fetchProducts(): Promise<Product[]> {
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.message || 'Failed to fetch products from server');
        }
        return response.json();
    }

    async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.message || 'Failed to create product on server');
        }
        return response.json();
    }

    async editProduct(product: Product): Promise<Product> {
        const response = await fetch(this.apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.message || 'Failed to update product on server');
        }
        return response.json();
    }

    async removeProduct(id: string): Promise<void> {
        const response = await fetch(`${this.apiUrl}?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.message || 'Failed to delete product on server');
        }
    }
}

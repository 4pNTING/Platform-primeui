import { useState, useEffect } from 'react';
import { Product } from '../../domain/entities/Product';
import { GetProductsUseCase } from '../../domain/usecases/GetProductsUseCase';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { ProductRemoteDataSource } from '../../data/datasources/ProductRemoteDataSource';
import { getErrorMessage } from '../utils/errorHandler';

// Manual dependency injection setup
const dataSource = new ProductRemoteDataSource();
const repository = new ProductRepositoryImpl(dataSource);
const getProductsUseCase = new GetProductsUseCase(repository);

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await getProductsUseCase.execute();
                setProducts(data);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return { products, loading, error };
};

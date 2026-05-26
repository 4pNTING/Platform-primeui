import { create } from 'zustand';
import { Product } from '../../domain/entities/Product';
import { GetProductsUseCase } from '../../domain/usecases/GetProductsUseCase';
import { CreateProductUseCase } from '../../domain/usecases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../domain/usecases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../domain/usecases/DeleteProductUseCase';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { ProductRemoteDataSource } from '../../data/datasources/ProductRemoteDataSource';
import { getErrorMessage } from '../utils/errorHandler';

// Manual dependency injection setup (Singleton instances)
const dataSource = new ProductRemoteDataSource();
const repository = new ProductRepositoryImpl(dataSource);

const getProductsUseCase = new GetProductsUseCase(repository);
const createProductUseCase = new CreateProductUseCase(repository);
const updateProductUseCase = new UpdateProductUseCase(repository);
const deleteProductUseCase = new DeleteProductUseCase(repository);

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const products = await getProductsUseCase.execute();
            set({ products, loading: false });
        } catch (err: any) {
            set({ error: getErrorMessage(err), loading: false });
        }
    },

    addProduct: async (product) => {
        set({ loading: true, error: null });
        try {
            const newProduct = await createProductUseCase.execute(product);
            set((state) => ({
                products: [...state.products, newProduct].sort((a, b) => a.price - b.price),
                loading: false
            }));
        } catch (err: any) {
            set({ error: getErrorMessage(err), loading: false });
            throw err;
        }
    },

    updateProduct: async (product) => {
        set({ loading: true, error: null });
        try {
            const updatedProduct = await updateProductUseCase.execute(product);
            set((state) => ({
                products: state.products
                    .map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                    .sort((a, b) => a.price - b.price),
                loading: false
            }));
        } catch (err: any) {
            set({ error: getErrorMessage(err), loading: false });
            throw err;
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteProductUseCase.execute(id);
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
                loading: false
            }));
        } catch (err: any) {
            set({ error: getErrorMessage(err), loading: false });
            throw err;
        }
    }
}));

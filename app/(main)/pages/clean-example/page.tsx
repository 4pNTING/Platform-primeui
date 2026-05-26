'use client';

import React from 'react';
import { useProducts } from '../../../../presentation/hooks/useProducts';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

const CleanExamplePage = () => {
    const { products, loading, error } = useProducts();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h4>Clean Architecture Example</h4>
                    <p className="text-muted-color">
                        This page demonstrates a clean separation of concerns. UI calls a Custom Hook, which calls a UseCase, which calls a Repository, which fetches from a Mock DataSource.
                    </p>
                </div>
            </div>

            {loading && (
                <div className="col-12 flex justify-content-center py-5">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
            )}

            {error && (
                <div className="col-12">
                    <Message severity="error" text={error} className="w-full justify-content-start" />
                </div>
            )}

            {!loading && !error && products.map((product) => (
                <div className="col-12 md:col-4" key={product.id}>
                    <Card title={product.name} subTitle={`$${product.price.toFixed(2)}`} className="h-full shadow-2">
                        <div className="flex flex-column gap-3 align-items-center">
                            <img src={product.imageUrl} alt={product.name} className="border-round shadow-1" style={{ maxWidth: '100%' }} />
                            <p className="m-0 text-center">{product.description}</p>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default CleanExamplePage;

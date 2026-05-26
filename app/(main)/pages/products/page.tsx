'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProductStore } from '../../../../presentation/state/useProductStore';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import { Product } from '../../../../domain/entities/Product';

const ProductsPage = () => {
    const { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();

    // Local Component State
    const emptyProduct: Omit<Product, 'id'> & { id?: string } = {
        name: '',
        price: 0,
        description: '',
        imageUrl: ''
    };

    const [product, setProduct] = useState<any>(emptyProduct);
    const [productDialog, setProductDialog] = useState<boolean>(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim()) {
            try {
                if (product.id) {
                    await updateProduct(product as Product);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000
                    });
                } else {
                    await addProduct(product);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000
                    });
                }
                setProductDialog(false);
                setProduct(emptyProduct);
            } catch (err: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.message || 'Operation failed',
                    life: 3000
                });
            }
        }
    };

    const editProduct = (prod: Product) => {
        setProduct({ ...prod });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (prod: Product) => {
        setProduct({ ...prod });
        setDeleteProductDialog(true);
    };

    const executeDeleteProduct = async () => {
        if (product.id) {
            try {
                await deleteProduct(product.id);
                setDeleteProductDialog(false);
                setProduct(emptyProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            } catch (err: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.message || 'Deletion failed',
                    life: 3000
                });
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setProduct((prev: any) => ({
            ...prev,
            [name]: val
        }));
    };

    const onInputNumberChange = (val: number | null, name: string) => {
        setProduct((prev: any) => ({
            ...prev,
            [name]: val || 0
        }));
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    // Templates
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New Product" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const imageBodyTemplate = (rowData: Product) => {
        return (
            <img src={rowData.imageUrl || 'https://placehold.co/100x60?text=No+Image'} alt={rowData.name} className="shadow-2 border-round" width="80" />
        );
    };

    const priceBodyTemplate = (rowData: Product) => {
        return <>{formatCurrency(rowData.price)}</>;
    };

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} loading={loading} />
        </React.Fragment>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={executeDeleteProduct} loading={loading} />
        </React.Fragment>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    {error && <Message severity="error" text={error} className="mb-4 w-full" />}

                    <DataTable
                        value={products}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                        loading={loading && products.length === 0}
                    >
                        <Column field="name" header="Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
                        <Column field="description" header="Description" sortable headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.imageUrl && <img src={product.imageUrl} alt="Preview" width="150" className="mt-0 mx-auto mb-5 block shadow-2 border-round" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !product.name })}
                            />
                            {submitted && !product.name && <small className="p-error">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Price</label>
                            <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e.value, 'price')} mode="currency" currency="USD" locale="en-US" />
                        </div>
                        <div className="field">
                            <label htmlFor="imageUrl">Image URL</label>
                            <InputText id="imageUrl" value={product.imageUrl} onChange={(e) => onInputChange(e, 'imageUrl')} placeholder="https://example.com/image.jpg" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;

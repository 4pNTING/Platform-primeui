import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '../../../domain/entities/Product';

const dbPath = path.join(process.cwd(), 'data', 'db', 'products.json');

// Helper to read database
function readDb(): Product[] {
    try {
        if (!fs.existsSync(dbPath)) {
            // Ensure parent directory exists
            fs.mkdirSync(path.dirname(dbPath), { recursive: true });
            fs.writeFileSync(dbPath, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database file:', error);
        return [];
    }
}

// Helper to write database
function writeDb(products: Product[]) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to database file:', error);
    }
}

export async function GET() {
    const products = readDb();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price, description, imageUrl } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
        }
        if (price === undefined || price < 0) {
            return NextResponse.json({ message: 'Product price must be a positive number' }, { status: 400 });
        }

        const products = readDb();
        const newProduct: Product = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            price: Number(price),
            description: description || '',
            imageUrl: imageUrl || 'https://placehold.co/200x120?text=Product'
        };

        products.push(newProduct);
        writeDb(products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, price, description, imageUrl } = body;

        if (!id) {
            return NextResponse.json({ message: 'Product ID is required for update' }, { status: 400 });
        }
        if (!name || !name.trim()) {
            return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
        }
        if (price === undefined || price < 0) {
            return NextResponse.json({ message: 'Product price must be a positive number' }, { status: 400 });
        }

        const products = readDb();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        products[index] = {
            id,
            name,
            price: Number(price),
            description: description || '',
            imageUrl: imageUrl || 'https://placehold.co/200x120?text=Product'
        };

        writeDb(products);

        return NextResponse.json(products[index]);
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Product ID is required for deletion' }, { status: 400 });
        }

        const products = readDb();
        const initialLength = products.length;
        const filteredProducts = products.filter((p) => p.id !== id);

        if (filteredProducts.length === initialLength) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        writeDb(filteredProducts);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
    }
}

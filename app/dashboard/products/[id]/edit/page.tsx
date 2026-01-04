import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/connect';
import Product from '@/models/Product';
import DashboardContent from '@/components/dashboard/DashboardContent';
import ProductForm from '@/components/forms/ProductForm';

async function getProduct(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <DashboardContent>
      <ProductForm initialData={product} isEdit={true} />
    </DashboardContent>
  );
}


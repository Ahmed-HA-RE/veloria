import ProductForm from '@/app/components/admin/ProductForm';
import { Metadata } from 'next';
import { getProductById } from '@/lib/actions/products';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update Product',
  description: 'Admin panel to update a  product.',
};

const AdminUpdateProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const product = await getProductById(id);

  if (!product) return redirect('/admin/products');

  return (
    <section className='mt-4'>
      <h1 className='font-bold text-3xl mb-6'>Update Product</h1>
      <ProductForm type={'update'} product={product} />
    </section>
  );
};

export default AdminUpdateProductPage;

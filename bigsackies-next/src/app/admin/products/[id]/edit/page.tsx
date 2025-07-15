import prisma from "@/lib/db";
import ProductForm from "../../_components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = parseInt(params.id, 10);
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });
  const categories = await prisma.categories.findMany();

  async function updateProduct(data: any) {
    "use server";
    await prisma.products.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category_id: parseInt(data.categoryId, 10),
      },
    });
    // We would revalidate and redirect here
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      {/* @ts-ignore */}
      <ProductForm
        initialData={product}
        categories={categories}
        onSave={updateProduct}
      />
    </div>
  );
} 
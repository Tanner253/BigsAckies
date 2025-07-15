import prisma from "@/lib/db";
import ProductForm from "../_components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.categories.findMany();

  async function addProduct(data: any) {
    "use server";
    await prisma.products.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category_id: parseInt(data.categoryId, 10),
      },
    });
    // We would revalidate the path here and redirect, but will add later
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      {/* @ts-ignore */}
      <ProductForm categories={categories} onSave={addProduct} />
    </div>
  );
} 
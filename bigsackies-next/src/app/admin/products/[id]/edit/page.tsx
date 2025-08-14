import prisma from "@/lib/db";
import ProductForm from "../../_components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });
  const categories = await prisma.categories.findMany();
  const species = await prisma.species.findMany();

  // Convert Decimal fields to number for client-side consumption
  const productForForm = product ? {
    ...product,
    price: Number(product.price),
  } : null;

  async function updateProduct(data: any) {
    "use server";
    
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      image_url: data.image_url,
      category_id: parseInt(data.categoryId, 10),
      is_animal: data.is_animal,
      stock: data.is_animal ? 0 : parseInt(data.stock, 10),
      species_id: data.is_animal ? parseInt(data.species_id, 10) : null,
      male_quantity: data.is_animal ? parseInt(data.male_quantity, 10) : 0,
      female_quantity: data.is_animal ? parseInt(data.female_quantity, 10) : 0,
      unknown_quantity: data.is_animal ? parseInt(data.unknown_quantity, 10) : 0,
      laid_date: data.is_animal ? data.laid_date : null,
    };

    await prisma.products.update({
      where: { id: productId },
      data: productData,
    });
    // We would revalidate and redirect here
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        initialData={productForForm}
        categories={categories}
        species={species}
        onSave={updateProduct}
      />
    </div>
  );
} 
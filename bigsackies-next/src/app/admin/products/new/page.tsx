import prisma from "@/lib/db";
import ProductForm from "../_components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.categories.findMany();
  const species = await prisma.species.findMany();

  async function addProduct(data: any) {
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

    await prisma.products.create({
      data: productData,
    });
    // We would revalidate the path here and redirect, but will add later
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm categories={categories} species={species} onSave={addProduct} />
    </div>
  );
} 
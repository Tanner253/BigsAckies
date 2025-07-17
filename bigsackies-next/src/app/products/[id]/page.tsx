import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import prisma from "@/lib/db";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock: number | null;
  is_animal: boolean;
  male_quantity: number | null;
  female_quantity: number | null;
  unknown_quantity: number | null;
  categories: {
    name: string;
  } | null;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const productId = parseInt(id, 10);
    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image_url: true,
        stock: true,
        is_animal: true,
        male_quantity: true,
        female_quantity: true,
        unknown_quantity: true,
        categories: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) return null;

    // Convert Decimal to number for client-side serialization
    return {
      ...product,
      price: Number(product.price),
    };
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto pt-24 py-12 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-24 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <span className="text-purple-400 font-semibold">
            {product.categories?.name || "Uncategorized"}
          </span>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-300 text-lg">{product.description}</p>
          <p className="text-3xl font-extrabold text-white">
            ${product.price.toFixed(2)}
          </p>
          <AddToCartButton 
            productId={product.id}
            productName={product.name}
            price={product.price}
            stock={product.stock || 0}
            isAnimal={product.is_animal}
            maleQuantity={product.male_quantity || 0}
            femaleQuantity={product.female_quantity || 0}
            unknownQuantity={product.unknown_quantity || 0}
          />
        </div>
      </div>
    </div>
  );
} 
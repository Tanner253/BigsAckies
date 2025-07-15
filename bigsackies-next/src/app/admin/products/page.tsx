import Link from "next/link";
import prisma from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

async function deleteProduct(id: number) {
  "use server";
  await prisma.products.delete({ where: { id } });
  // We would revalidate here
}

function DeleteProductButton({ id }: { id: number }) {
  return (
    <form action={deleteProduct.bind(null, id)}>
      <Button variant="destructive" size="sm" type="submit">
        Delete
      </Button>
    </form>
  );
}

async function getProducts() {
  const products = await prisma.products.findMany({
    include: {
      categories: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Create New Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.categories?.name || "N/A"}</TableCell>
              <TableCell>${Number(product.price).toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <DeleteProductButton id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
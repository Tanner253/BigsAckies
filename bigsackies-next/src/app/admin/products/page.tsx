import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
import { Package, Plus, Edit3, Trash2, Eye, Sparkles, DollarSign, Archive, Tag, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import ToggleProductButton from "./_components/ToggleProductButton";

async function toggleProductActive(id: number) {
  "use server";
  
  try {
    // Get current product state
    const product = await prisma.products.findUnique({
      where: { id },
      select: { is_active: true, name: true } as any
    });
    
    if (!product) {
      revalidatePath("/admin/products");
      throw new Error("Product not found");
    }
    
    // Toggle the active state
    const newActiveState = !(product as any).is_active;
    
    await prisma.products.update({
      where: { id },
      data: { 
        is_active: newActiveState,
        // If deactivating, also remove from carts
        ...(newActiveState === false && {
          cart_items: {
            deleteMany: {}
          }
        })
      } as any
    });
    
    revalidatePath("/admin/products");
    
    // Return success result instead of redirecting
    return {
      success: true,
      message: `Product ${newActiveState ? 'activated' : 'deactivated'} successfully`,
      newState: newActiveState
    };
    
  } catch (error) {
    console.error("Toggle product active error:", error);
    revalidatePath("/admin/products");
    
    // Return error result instead of redirecting
    return {
      success: false,
      message: `Failed to toggle product status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      newState: null
    };
  }
}

async function getProducts() {
  // TODO: After migration, add where: { is_active: true } to show only active products
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

export default async function AdminProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ message?: string }> 
}) {
  const { message } = await searchParams;
  const products = await getProducts();

  // Calculate summary stats
  const totalProducts = products.length;
  const activeProducts = products.filter(product => {
    if (product.is_animal) {
      return (product.male_quantity || 0) + (product.female_quantity || 0) + (product.unknown_quantity || 0) > 0;
    }
    return (product.stock || 0) > 0;
  }).length;
  
  // Fixed catalog value calculation to account for inventory quantities
  const totalValue = products.reduce((sum, product) => {
    const price = Number(product.price);
    let quantity = 0;
    
    if (product.is_animal) {
      quantity = (product.male_quantity || 0) + (product.female_quantity || 0) + (product.unknown_quantity || 0);
    } else {
      quantity = product.stock || 0;
    }
    
    return sum + (price * quantity);
  }, 0);

  if (products.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan to-nebula-blue rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-nebula-cyan to-nebula-blue p-4 rounded-full">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">No Products Yet</h1>
          <p className="text-stellar-silver/70 text-lg max-w-md mx-auto">
            Start building your catalog by adding your first product or animal.
          </p>
          <Button asChild className="btn-cosmic">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Create First Product
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan to-nebula-blue rounded-full blur-md opacity-50 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-nebula-cyan to-nebula-blue p-3 rounded-full">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">Product Catalog</h1>
              <p className="text-sm sm:text-base text-stellar-silver/80">
                Manage your inventory and animal collection
              </p>
            </div>
          </div>
        </div>
        
        {/* Message Display */}
        {message && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-nebula-cyan/20 to-nebula-blue/20 border border-nebula-cyan/30">
            <p className="text-stellar-silver">{message}</p>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-cyan to-nebula-blue">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-stellar-white">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink">
                <Archive className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Active Products</p>
                <p className="text-2xl font-bold text-stellar-white">{activeProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-gold to-nebula-orange">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Catalog Value</p>
                <p className="text-2xl font-bold text-stellar-white">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Products Grid/Table Hybrid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Your Products</h2>
            <p className="text-base sm:text-lg text-stellar-silver/70">
              A visual overview of your entire catalog
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-nebula-gold" />
              <span className="text-xs sm:text-sm text-stellar-silver/70">Live Inventory</span>
            </div>
            <Button asChild className="btn-cosmic text-sm">
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                New
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan/20 to-nebula-blue/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative card-cosmic rounded-xl overflow-hidden border border-nebula-violet/30 backdrop-blur-xl group-hover:border-nebula-magenta/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                {/* Product Image */}
                <div className="relative aspect-video bg-gradient-to-br from-nebula-deep-purple/30 to-nebula-violet/30 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-nebula-deep-purple/20 to-nebula-violet/20">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-stellar-silver/50 mx-auto mb-2" />
                        <p className="text-stellar-silver/70 text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Product Type Badge */}
                  <div className="absolute top-3 left-3">
                    {product.is_animal ? (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-nebula-gold/20 text-nebula-gold border border-nebula-gold/30 backdrop-blur-sm">
                        Animal
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-nebula-cyan/20 text-nebula-cyan border border-nebula-cyan/30 backdrop-blur-sm">
                        Product
                      </span>
                    )}
                  </div>
                  
                  {/* Product ID */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-space-dark/80 text-stellar-silver backdrop-blur-sm">
                      #{product.id}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-stellar-white line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-stellar-silver/70 text-sm">
                      {product.categories?.name || "Uncategorized"}
                    </p>
                  </div>
                  
                  {/* Price and Stock */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-nebula-gold" />
                      <span className="text-lg font-bold text-nebula-gold">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      {product.is_animal ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-nebula-violet/20 text-nebula-violet px-2 py-1 rounded">
                            M:{product.male_quantity || 0}
                          </span>
                          <span className="text-xs bg-nebula-hot-pink/20 text-nebula-hot-pink px-2 py-1 rounded">
                            F:{product.female_quantity || 0}
                          </span>
                          <span className="text-xs bg-nebula-orange/20 text-nebula-orange px-2 py-1 rounded">
                            U:{product.unknown_quantity || 0}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Archive className="w-4 h-4 text-stellar-silver/70" />
                          <span className={`text-sm font-medium ${
                            (product.stock || 0) > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {product.stock || 0} in stock
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="flex-1 border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white hover:border-nebula-magenta/50 transition-all duration-300"
                    >
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    
                    <ToggleProductButton 
                      id={product.id} 
                      isActive={(product as any).is_active ?? true}
                      onToggle={toggleProductActive}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
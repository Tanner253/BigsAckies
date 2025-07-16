import prisma from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { notFound } from "next/navigation";
import OrderStatusUpdater from "./OrderStatusUpdater";
import { 
  ShoppingCart, 
  User, 
  DollarSign, 
  Calendar, 
  Package, 
  CheckCircle, 
  XCircle,
  Clock,
  Mail,
  Hash,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getOrderDetails(id: number) {
  const order = await prisma.orders.findUnique({
    where: { id },
    include: {
      users: true,
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });
  return order;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  const order = await getOrderDetails(orderId);

  if (!order) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">Order Not Found</h1>
          <p className="text-stellar-silver/70 text-lg max-w-md mx-auto">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="btn-cosmic">
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nebula-orange to-nebula-gold rounded-full blur-md opacity-50 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-nebula-orange to-nebula-gold p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold gradient-text">
                Order #{order.id}
              </h1>
              <p className="text-stellar-silver/80 text-lg">
                Detailed order information and management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-stellar-silver/70">
              <Calendar className="w-4 h-4 text-nebula-cyan" />
              <span>{new Date(order.created_at!).toLocaleDateString()}</span>
            </div>
            <Button asChild variant="outline" className="border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20">
              <Link href="/admin/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-magenta/20 to-nebula-hot-pink/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Card className="relative card-cosmic border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-magenta/10 to-nebula-hot-pink/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <User className="w-5 h-5 text-nebula-magenta" />
                Customer Details
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {order.users?.name?.charAt(0).toUpperCase() || 'G'}
                    </span>
                  </div>
                  <div>
                    <p className="text-stellar-white font-medium">
                      {order.users?.name || "Guest Customer"}
                    </p>
                    <p className="text-stellar-silver/70 text-sm">Customer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-nebula-cyan" />
                  <span className="text-stellar-silver">
                    {order.users?.email || 'No email provided'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-orange/20 to-nebula-gold/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Card className="relative card-cosmic border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-orange/10 to-nebula-gold/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-nebula-gold" />
                Order Summary
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-stellar-silver/70">Status:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-stellar-silver/70">Total:</span>
                  <span className="text-2xl font-bold text-nebula-gold">
                    {formatCurrency(Number(order.total_amount))}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-stellar-silver/70">Payment:</span>
                  <div className="flex items-center gap-2">
                    {order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered' ? 'text-green-400' : 'text-red-400'}>
                      {order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-violet/20 to-nebula-deep-purple/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Card className="relative card-cosmic border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-violet/10 to-nebula-deep-purple/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-nebula-violet" />
                Update Status
              </h3>
            </div>
            <CardContent className="p-6">
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Order Items Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Order Items</h2>
            <p className="text-stellar-silver/70 text-lg">
              Products and quantities in this order
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-nebula-cyan" />
            <span className="text-stellar-silver/70">{order.order_items.length} items</span>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan/20 to-nebula-blue/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Card className="relative card-cosmic border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-cyan/10 to-nebula-blue/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <Package className="w-5 h-5 text-nebula-cyan" />
                Item Details
              </h3>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-nebula-violet/30 hover:bg-nebula-violet/5">
                    <TableHead className="text-stellar-silver font-semibold">Product</TableHead>
                    <TableHead className="text-stellar-silver font-semibold">Quantity</TableHead>
                    <TableHead className="text-stellar-silver font-semibold">Price</TableHead>
                    <TableHead className="text-stellar-silver font-semibold">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="border-b border-nebula-violet/20 hover:bg-nebula-violet/5 transition-colors duration-200"
                    >
                      <TableCell className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-space-dark border border-nebula-violet/30">
                            <Image
                              src={item.products?.image_url || "/placeholder.png"}
                              alt={item.products?.name || "Product Image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-stellar-white font-medium">
                              {item.products?.name}
                            </p>
                            <p className="text-stellar-silver/70 text-sm">
                              Product ID: #{item.products?.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-stellar-white font-medium">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-nebula-orange" />
                          {item.quantity}
                        </div>
                      </TableCell>
                      <TableCell className="text-nebula-gold font-semibold">
                        {formatCurrency(Number(item.price_at_time))}
                      </TableCell>
                      <TableCell className="text-nebula-gold font-bold">
                        {formatCurrency(Number(item.price_at_time) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
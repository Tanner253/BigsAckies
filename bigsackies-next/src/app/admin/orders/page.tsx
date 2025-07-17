import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import { CheckCircle, XCircle, ShoppingCart, Eye, TrendingUp, Users, DollarSign, Calendar, Sparkles } from "lucide-react";

async function getOrders() {
  const orders = await prisma.orders.findMany({
    select: {
      id: true,
      total_amount: true,
      created_at: true,
      users: { select: { name: true, email: true } },
      status: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return orders;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  // Calculate summary stats
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const paidOrders = orders.filter(order => 
    order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid'
  ).length;
  const completionRate = orders.length > 0 ? ((paidOrders / orders.length) * 100).toFixed(1) : 0;

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-orange to-nebula-gold rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-nebula-orange to-nebula-gold p-4 rounded-full">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">No Orders Yet</h1>
          <p className="text-stellar-silver/70 text-lg max-w-md mx-auto">
            When customers place orders, they'll appear here. Start promoting your products!
          </p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-nebula-orange to-nebula-gold rounded-full blur-md opacity-50 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-nebula-orange to-nebula-gold p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">Order Management</h1>
              <p className="text-sm sm:text-base text-stellar-silver/80">
                Track and manage all customer orders
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-gold to-nebula-orange">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-stellar-white">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
          
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-stellar-white">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-cyan to-nebula-blue">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-stellar-white">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Orders Table */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Recent Orders</h2>
            <p className="text-base sm:text-lg text-stellar-silver/70">
              All customer orders and transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-nebula-gold" />
            <span className="text-stellar-silver/70">Live Updates</span>
          </div>
        </div>
        
        <div className="relative group">
          {/* Glow effect for the table */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-orange/20 to-nebula-gold/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative card-cosmic rounded-xl overflow-hidden border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-orange/10 to-nebula-gold/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-nebula-gold" />
                Order History
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-b border-nebula-violet/30 hover:bg-nebula-violet/5">
                    <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Customer</TableHead>
                    <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Email</TableHead>
                    <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Amount</TableHead>
                    <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Date</TableHead>
                    <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className="border-b border-nebula-violet/20 hover:bg-nebula-violet/5 transition-colors duration-200"
                    >
                      <TableCell className="text-stellar-white font-medium px-4 py-3 whitespace-nowrap">
                        {order.users?.name || 'Guest'}
                      </TableCell>
                      <TableCell className="text-stellar-silver px-4 py-3 whitespace-nowrap">
                        {order.users?.email || 'guest@example.com'}
                      </TableCell>
                      <TableCell className="text-nebula-gold font-semibold px-4 py-3 whitespace-nowrap">
                        {formatCurrency(Number(order.total_amount))}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-stellar-silver px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-nebula-cyan" />
                          {new Date(order.created_at!).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-4 py-3 whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white hover:border-nebula-magenta/50 transition-all duration-300"
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-3 h-3 mr-1" />
                            View Order
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
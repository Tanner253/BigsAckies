import prisma from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Users, Mail, ShoppingCart, Star, DollarSign, TrendingUp, Sparkles } from "lucide-react";

async function getUsers() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      orders: { select: { total_amount: true } },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return users.map(user => {
    return {
        ...user,
        orderCount: user.orders.length,
        totalValue: user.orders.reduce((sum, o) => sum + Number(o.total_amount) || 0, 0)
    }
  })
}

export default async function AdminCustomersPage() {
  const users = await getUsers();

  // Calculate summary stats
  const totalCustomers = users.length;
  const activeCustomers = users.filter(user => user.orderCount > 0).length;
  const totalRevenue = users.reduce((sum, user) => sum + user.totalValue, 0);
  const avgOrderValue = activeCustomers > 0 ? totalRevenue / activeCustomers : 0;

  if (users.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink p-4 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">No Customers Yet</h1>
          <p className="text-stellar-silver/70 text-lg max-w-md mx-auto">
            When people create accounts or place orders, they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink rounded-full blur-md opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold gradient-text">Customer Management</h1>
            <p className="text-stellar-silver/80 text-lg">
              Track and understand your customer base
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-stellar-white">{totalCustomers}</p>
              </div>
            </div>
          </div>
          
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-cyan to-nebula-blue">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Active Customers</p>
                <p className="text-2xl font-bold text-stellar-white">{activeCustomers}</p>
              </div>
            </div>
          </div>
          
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
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-violet to-nebula-deep-purple">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Avg. Value</p>
                <p className="text-2xl font-bold text-stellar-white">{formatCurrency(avgOrderValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Customers Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Customer Directory</h2>
            <p className="text-stellar-silver/70 text-lg">
              All registered customers and their activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-nebula-gold" />
            <span className="text-stellar-silver/70">Live Data</span>
          </div>
        </div>
        
        <div className="relative group">
          {/* Glow effect for the table */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-magenta/20 to-nebula-hot-pink/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative card-cosmic rounded-xl overflow-hidden border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-magenta/10 to-nebula-hot-pink/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <Users className="w-5 h-5 text-nebula-magenta" />
                Customer Database
              </h3>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-b border-nebula-violet/30 hover:bg-nebula-violet/5">
                  <TableHead className="text-stellar-silver font-semibold">Name</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Email</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Orders</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Total Value</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="border-b border-nebula-violet/20 hover:bg-nebula-violet/5 transition-colors duration-200"
                  >
                    <TableCell className="text-stellar-white font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-nebula-magenta to-nebula-hot-pink flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-stellar-silver">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-nebula-cyan" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-stellar-white">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-nebula-orange" />
                        <span className="font-medium">{formatNumber(user.orderCount)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-nebula-gold font-semibold">
                      {formatCurrency(user.totalValue)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user.orderCount > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {user.orderCount > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
} 
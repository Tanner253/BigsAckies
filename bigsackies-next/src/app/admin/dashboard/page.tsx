import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Star,
  Crown,
  Sparkles,
  Eye,
  Activity,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getSalesData() {
  const data = await prisma.orders.aggregate({
    _sum: { total_amount: true },
    _count: true,
  });
  return {
    amount: Number(data._sum.total_amount) || 0,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    prisma.users.count(),
    prisma.orders.aggregate({
      _sum: { total_amount: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (Number(orderData._sum.total_amount) || 0) / userCount,
  };
}

async function getProductData() {
  const totalProductCount = await prisma.products.count();
  const activeSuppliesCount = await prisma.products.count({
    where: { is_animal: false, stock: { gt: 0 } },
  });
  const activeAnimalsCount = await prisma.products.count({
    where: {
      is_animal: true,
      OR: [
        { male_quantity: { gt: 0 } },
        { female_quantity: { gt: 0 } },
        { unknown_quantity: { gt: 0 } },
      ],
    },
  });
  const activeCount = activeSuppliesCount + activeAnimalsCount;
  return {
    activeCount,
    inactiveCount: totalProductCount - activeCount,
  };
}

async function getRecentOrders() {
    return prisma.orders.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { users: true }
    });
}

export default async function AdminDashboardPage() {
  const [salesData, userData, productData, recentOrders] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
    getRecentOrders(),
  ]);

  const dashboardMetrics = [
    {
      title: "Total Revenue",
      subtitle: `${formatNumber(salesData.numberOfSales)} Orders`,
      body: formatCurrency(salesData.amount),
      icon: DollarSign,
      gradient: "from-nebula-gold to-nebula-orange",
      glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
      change: "+12.5%",
      changeType: "increase" as const
    },
    {
      title: "Active Customers",
      subtitle: `${formatCurrency(userData.averageValuePerUser)} Avg. Value`,
      body: formatNumber(userData.userCount),
      icon: Users,
      gradient: "from-nebula-magenta to-nebula-hot-pink",
      glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
      change: "+8.2%",
      changeType: "increase" as const
    },
    {
      title: "Active Products",
      subtitle: `${formatNumber(productData.inactiveCount)} Inactive`,
      body: formatNumber(productData.activeCount),
      icon: Package,
      gradient: "from-nebula-cyan to-nebula-blue",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
      change: "+5.3%",
      changeType: "increase" as const
    },
    {
      title: "Recent Activity",
      subtitle: `${recentOrders.length} New Orders`,
      body: "Active",
      icon: Activity,
      gradient: "from-nebula-violet to-nebula-deep-purple",
      glow: "shadow-[0_0_20px_rgba(124,58,237,0.3)]",
      change: "+2.1%",
      changeType: "increase" as const
    },
  ];

  return (
    <div className="space-y-12">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-violet to-nebula-magenta rounded-full blur-md opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-nebula-violet to-nebula-magenta p-3 rounded-full">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold gradient-text">
              Admin Dashboard
            </h1>
            <p className="text-stellar-silver/80 text-lg">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="flex items-center gap-8 text-stellar-silver/70">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-nebula-gold" />
            <span className="text-sm">All metrics trending up</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-nebula-cyan" />
            <span className="text-sm">Business growing strong</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nebula-magenta" />
            <span className="text-sm">New opportunities ahead</span>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <DashboardCard
            key={metric.title}
            title={metric.title}
            subtitle={metric.subtitle}
            body={metric.body}
            Icon={metric.icon}
            gradient={metric.gradient}
            glow={metric.glow}
            change={metric.change}
            changeType={metric.changeType}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Enhanced Recent Orders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Recent Orders</h2>
            <p className="text-stellar-silver/70 text-lg">
              Latest customer transactions and activity
            </p>
          </div>
          <Button asChild className="btn-cosmic">
            <Link href="/admin/orders">
              <Eye className="w-4 h-4 mr-2" />
              View All Orders
            </Link>
          </Button>
        </div>
        
        <div className="relative group">
          {/* Glow effect for the table */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-violet/20 to-nebula-magenta/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative card-cosmic rounded-xl overflow-hidden border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-violet/10 to-nebula-magenta/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-nebula-gold" />
                Recent Activity
              </h3>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-b border-nebula-violet/30 hover:bg-nebula-violet/5">
                  <TableHead className="text-stellar-silver font-semibold">Customer</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Total</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Status</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Date</TableHead>
                  <TableHead className="text-stellar-silver font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="border-b border-nebula-violet/20 hover:bg-nebula-violet/5 transition-colors duration-200"
                  >
                    <TableCell className="text-stellar-white font-medium">
                      {order.users?.name || 'Guest'}
                    </TableCell>
                    <TableCell className="text-nebula-gold font-semibold">
                      {formatCurrency(Number(order.total_amount))}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.status.toLowerCase() === 'succeeded' || order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-stellar-silver">
                      {new Date(order.created_at!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white transition-all duration-300"
                      >
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
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
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
  Icon: React.ElementType;
  gradient: string;
  glow: string;
  change: string;
  changeType: "increase" | "decrease";
  delay?: number;
};

function DashboardCard({
  title,
  subtitle,
  body,
  Icon,
  gradient,
  glow,
  change,
  changeType,
  delay = 0,
}: DashboardCardProps) {
  return (
    <div className="relative group">
      {/* Animated glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${glow}`}></div>
      
      <Card className="relative card-cosmic border border-nebula-violet/30 backdrop-blur-xl overflow-hidden group-hover:border-nebula-magenta/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
          <div className="space-y-1">
            <CardTitle className="text-stellar-white font-semibold text-lg">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-stellar-silver/70 text-sm">
                {subtitle}
              </span>
              <div className="flex items-center gap-1">
                {changeType === "increase" ? (
                  <ArrowUp className="w-3 h-3 text-green-400" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs font-medium ${
                  changeType === "increase" ? "text-green-400" : "text-red-400"
                }`}>
                  {change}
                </span>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="flex items-end justify-between">
            <p className="text-4xl font-bold text-stellar-white">
              {body}
            </p>
            <Sparkles className="w-5 h-5 text-nebula-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
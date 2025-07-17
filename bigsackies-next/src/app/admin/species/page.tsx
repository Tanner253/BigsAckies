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
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import { Settings, Plus, Hash, FileText, Sparkles, Database } from "lucide-react";

async function getSpecies() {
  return prisma.species.findMany({
    orderBy: { name: "asc" },
  });
}

async function addSpecies(data: FormData) {
  "use server";
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  if (!name) return;

  await prisma.species.create({
    data: { name, description },
  });
  revalidatePath("/admin/species");
}

export default async function AdminSpeciesPage() {
  const species = await getSpecies();

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nebula-deep-purple to-nebula-violet rounded-full blur-md opacity-50 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-nebula-deep-purple to-nebula-violet p-3 rounded-full">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">Species Management</h1>
              <p className="text-sm sm:text-base text-stellar-silver/80">
                Define and organize your animal species
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-deep-purple to-nebula-violet">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Total Species</p>
                <p className="text-2xl font-bold text-stellar-white">{species.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card-cosmic p-4 rounded-xl border border-nebula-violet/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-nebula-gold to-nebula-orange">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-stellar-silver/70 text-sm">Status</p>
                <p className="text-2xl font-bold text-stellar-white">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Add Species Form */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Add New Species</h2>
          <p className="text-base sm:text-lg text-stellar-silver/70">
            Create a new species entry for your animal catalog
          </p>
        </div>
        
        <div className="relative group">
          {/* Glow effect for the form */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-deep-purple/20 to-nebula-violet/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <form 
            action={addSpecies} 
            className="relative card-cosmic p-6 rounded-xl border border-nebula-violet/30 backdrop-blur-xl"
          >
            <div className="bg-gradient-to-r from-nebula-deep-purple/10 to-nebula-violet/10 p-4 rounded-lg mb-6 border border-nebula-violet/20">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-nebula-violet" />
                Species Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-stellar-white font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4 text-nebula-cyan" />
                  Species Name
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g., Ackie Monitor" 
                  className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-stellar-white font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-nebula-cyan" />
                  Scientific Name
                </label>
                <Input 
                  id="description" 
                  name="description" 
                  placeholder="e.g., Varanus acanthurus" 
                  className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25" 
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button type="submit" className="btn-cosmic w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Species
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Species Table */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Species Directory</h2>
            <p className="text-base sm:text-lg text-stellar-silver/70">
              All registered species in your system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-nebula-gold" />
            <span className="text-stellar-silver/70">Live Database</span>
          </div>
        </div>
        
        <div className="relative group">
          {/* Glow effect for the table */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-deep-purple/20 to-nebula-violet/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative card-cosmic rounded-xl overflow-hidden border border-nebula-violet/30 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-nebula-deep-purple/10 to-nebula-violet/10 p-4 border-b border-nebula-violet/30">
              <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                <Database className="w-5 h-5 text-nebula-deep-purple" />
                Species Database
              </h3>
            </div>
            
            {species.length === 0 ? (
              <div className="p-12 text-center">
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-nebula-deep-purple to-nebula-violet rounded-full blur-md opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-nebula-deep-purple to-nebula-violet p-3 rounded-full">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold gradient-text">No Species Yet</h3>
                  <p className="text-stellar-silver/70">
                    Add your first species above to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="border-b border-nebula-violet/30 hover:bg-nebula-violet/5">
                      <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">ID</TableHead>
                      <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Species Name</TableHead>
                      <TableHead className="text-stellar-silver font-semibold px-4 py-3 whitespace-nowrap">Scientific Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {species.map((s) => (
                      <TableRow 
                        key={s.id} 
                        className="border-b border-nebula-violet/20 hover:bg-nebula-violet/5 transition-colors duration-200"
                      >
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-nebula-deep-purple to-nebula-violet flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">
                                {s.id}
                              </span>
                            </div>
                            <span className="text-stellar-white font-medium sm:hidden">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-stellar-white font-medium px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-nebula-cyan" />
                            {s.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-stellar-silver px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-nebula-orange" />
                            {s.description || 'N/A'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
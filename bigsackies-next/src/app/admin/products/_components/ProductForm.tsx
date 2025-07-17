"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Package, 
  FileText, 
  DollarSign, 
  Tag, 
  Image as ImageIcon, 
  Archive,
  Sparkles,
  Save,
  X,
  Upload
} from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int("Stock must be a whole number").optional(),
  categoryId: z.string().min(1, "Category is required"),
  is_animal: z.boolean().default(false),
  laid_date: z.string().optional(),
  male_quantity: z.coerce.number().int().min(0).optional(),
  female_quantity: z.coerce.number().int().min(0).optional(),
  unknown_quantity: z.coerce.number().int().min(0).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: any;
  categories: { id: number; name: string }[];
  onSave: (data: ProductFormValues) => Promise<void>;
}

export default function ProductForm({
  initialData,
  categories,
  onSave,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [isAnimal, setIsAnimal] = useState(initialData?.is_animal || false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: Number(initialData.price),
          stock: initialData.stock || 0,
          categoryId: initialData.category_id?.toString(),
          is_animal: initialData.is_animal || false,
          laid_date: initialData.laid_date ? new Date(initialData.laid_date).toISOString().split('T')[0] : "",
          male_quantity: initialData.male_quantity || 0,
          female_quantity: initialData.female_quantity || 0,
          unknown_quantity: initialData.unknown_quantity || 0,
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          categoryId: "",
          is_animal: false,
          laid_date: "",
          male_quantity: 0,
          female_quantity: 0,
          unknown_quantity: 0,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    await onSave(data);
    setIsLoading(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // Here you would typically upload the image to your storage service
        // and update the form with the URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Form Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan to-nebula-blue rounded-full blur-md opacity-50 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-r from-nebula-cyan to-nebula-blue p-3 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              {initialData ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-stellar-silver/80 text-lg">
              {initialData ? 'Update product information' : 'Add a new product to your catalog'}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan/20 to-nebula-blue/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative card-cosmic p-6 rounded-xl border border-nebula-violet/30 backdrop-blur-xl">
                  <div className="bg-gradient-to-r from-nebula-cyan/10 to-nebula-blue/10 p-4 rounded-lg mb-6 border border-nebula-violet/20">
                    <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-nebula-cyan" />
                      Basic Information
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-stellar-white font-medium flex items-center gap-2">
                            <Tag className="w-4 h-4 text-nebula-cyan" />
                            Product Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter product name" 
                              className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-stellar-white font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-nebula-cyan" />
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description" 
                              className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25 min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Price and Stock Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-nebula-gold/20 to-nebula-orange/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative card-cosmic p-6 rounded-xl border border-nebula-violet/30 backdrop-blur-xl">
                  <div className="bg-gradient-to-r from-nebula-gold/10 to-nebula-orange/10 p-4 rounded-lg mb-6 border border-nebula-violet/20">
                    <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-nebula-gold" />
                      Pricing & Inventory
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-stellar-white font-medium flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-nebula-gold" />
                            Price
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00"
                              className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-stellar-white font-medium flex items-center gap-2">
                            <Archive className="w-4 h-4 text-nebula-cyan" />
                            Stock Quantity
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="1" 
                              placeholder="0"
                              className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-nebula-magenta/20 to-nebula-hot-pink/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative card-cosmic p-6 rounded-xl border border-nebula-violet/30 backdrop-blur-xl">
                  <div className="bg-gradient-to-r from-nebula-magenta/10 to-nebula-hot-pink/10 p-4 rounded-lg mb-6 border border-nebula-violet/20">
                    <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                      <Tag className="w-5 h-5 text-nebula-magenta" />
                      Category
                    </h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-stellar-white font-medium">
                          Product Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-space-dark border border-nebula-violet/30 backdrop-blur-xl">
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                                className="text-stellar-white hover:bg-nebula-violet/20 focus:bg-nebula-violet/20 cursor-pointer"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6 lg:row-start-1 lg:col-start-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-nebula-violet/20 to-nebula-deep-purple/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative card-cosmic p-6 rounded-xl border border-nebula-violet/30 backdrop-blur-xl">
                  <div className="bg-gradient-to-r from-nebula-violet/10 to-nebula-deep-purple/10 p-4 rounded-lg mb-6 border border-nebula-violet/20">
                    <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-nebula-violet" />
                      Product Image
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-nebula-violet/30 bg-space-dark/30 overflow-hidden">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-16 h-16 text-stellar-silver/50 mx-auto mb-4" />
                            <p className="text-stellar-silver/70 text-lg font-medium">No Image</p>
                            <p className="text-stellar-silver/50 text-sm">Upload an image to preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="space-y-2">
                      <label className="text-stellar-white font-medium text-sm">
                        Upload Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white transition-all duration-300"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                      <p className="text-stellar-silver/50 text-xs">
                        Supported formats: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animal/Clutch Information Section */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-nebula-gold/20 to-nebula-orange/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative card-cosmic p-6 rounded-xl border border-nebula-gold/30 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-nebula-gold/10 to-nebula-orange/10 p-4 rounded-lg mb-6 border border-nebula-gold/20">
                  <h3 className="text-xl font-semibold text-stellar-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-nebula-gold" />
                    Animal/Clutch Information
                  </h3>
                  <p className="text-stellar-silver/80 mt-2">
                    Configure this product as an animal or clutch
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Animal Product Toggle */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="is_animal"
                        checked={isAnimal}
                        onChange={(e) => setIsAnimal(e.target.checked)}
                        className="w-4 h-4 text-nebula-gold bg-space-dark/50 border-nebula-gold/50 rounded focus:ring-nebula-gold/25 focus:ring-2 transition-all duration-300"
                      />
                    </div>
                    <label htmlFor="is_animal" className="text-stellar-white font-medium cursor-pointer">
                      This is an animal product/clutch
                    </label>
                  </div>

                  {/* Conditional Animal Fields */}
                  {isAnimal && (
                    <div className="space-y-6 transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-stellar-white font-medium flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Male Quantity
                          </label>
                          <FormField
                            control={form.control}
                            name="male_quantity"
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                                placeholder="0"
                                {...field}
                                value={field.value ?? ""}
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-stellar-white font-medium flex items-center gap-2">
                            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                            Female Quantity
                          </label>
                          <FormField
                            control={form.control}
                            name="female_quantity"
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                                placeholder="0"
                                {...field}
                                value={field.value ?? ""}
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-stellar-white font-medium flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            Unknown Gender
                          </label>
                          <FormField
                            control={form.control}
                            name="unknown_quantity"
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                                placeholder="0"
                                {...field}
                                value={field.value ?? ""}
                              />
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-stellar-white font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-nebula-gold rounded-full"></div>
                          Laid Date (for clutches)
                        </label>
                        <FormField
                          control={form.control}
                          name="laid_date"
                          render={({ field }) => (
                            <Input
                              type="date"
                              className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-magenta/50 focus:ring-nebula-magenta/25"
                              {...field}
                              value={field.value ?? ""}
                            />
                          )}
                        />
                        <p className="text-stellar-silver/60 text-sm">
                          Select the date when the clutch was laid (optional)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Helpful Info */}
                  <div className="bg-nebula-gold/10 border border-nebula-gold/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-nebula-gold/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-nebula-gold rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-stellar-white font-medium mb-1">Animal Product Information</h4>
                        <p className="text-stellar-silver/80 text-sm">
                          Enable this option for live animals, eggs, or clutches. You can specify quantities by gender and set a laid date for clutches.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-nebula-violet/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="btn-cosmic w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {initialData ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 
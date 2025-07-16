"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle } from "lucide-react";

interface ToggleProductButtonProps {
  id: number;
  isActive: boolean;
  onToggle: (id: number) => Promise<{ success: boolean; message: string; newState: boolean | null }>;
}

export default function ToggleProductButton({ id, isActive, onToggle }: ToggleProductButtonProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this product?`)) {
      return;
    }
    
    try {
      const result = await onToggle(id);
      
      if (result.success) {
        // Show success message
        alert(result.message);
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        // Show error message
        alert(result.message);
      }
    } catch (error) {
      console.error("Toggle error:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button 
        variant={isActive ? "destructive" : "outline"}
        size="sm" 
        type="submit"
        className={`transition-colors duration-300 ${
          isActive 
            ? "hover:bg-red-500/80" 
            : "hover:bg-green-500/80 border-green-500/30 text-green-400"
        }`}
      >
        {isActive ? (
          <>
            <Trash2 className="w-3 h-3 mr-1" />
            Deactivate
          </>
        ) : (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Activate
          </>
        )}
      </Button>
    </form>
  );
} 
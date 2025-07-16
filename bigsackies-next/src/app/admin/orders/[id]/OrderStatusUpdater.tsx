"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "./actions";
import { CheckCircle, Clock, Truck, Package, XCircle, RefreshCw } from "lucide-react";

interface OrderStatusUpdaterProps {
  orderId: number;
  currentStatus: string;
}

const statusOptions = [
  { 
    value: "pending", 
    label: "Pending", 
    icon: Clock, 
    color: "text-nebula-orange",
    bgColor: "bg-nebula-orange/20",
    borderColor: "border-nebula-orange/30"
  },
  { 
    value: "succeeded", 
    label: "Succeeded", 
    icon: CheckCircle, 
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30"
  },
  { 
    value: "shipped", 
    label: "Shipped", 
    icon: Truck, 
    color: "text-nebula-cyan",
    bgColor: "bg-nebula-cyan/20",
    borderColor: "border-nebula-cyan/30"
  },
  { 
    value: "delivered", 
    label: "Delivered", 
    icon: Package, 
    color: "text-nebula-gold",
    bgColor: "bg-nebula-gold/20",
    borderColor: "border-nebula-gold/30"
  },
  { 
    value: "canceled", 
    label: "Canceled", 
    icon: XCircle, 
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30"
  },
];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);
  };

  const currentStatusOption = statusOptions.find(option => option.value === newStatus);
  const CurrentIcon = currentStatusOption?.icon || Clock;

  return (
    <div className="space-y-4">
      {/* Current Status Display */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-space-dark/50 border border-nebula-violet/30">
        <div className={`p-2 rounded-full ${currentStatusOption?.bgColor} ${currentStatusOption?.borderColor} border`}>
          <CurrentIcon className={`w-4 h-4 ${currentStatusOption?.color}`} />
        </div>
        <div>
          <p className="text-stellar-silver/70 text-sm">Current Status</p>
          <p className={`font-medium ${currentStatusOption?.color}`}>
            {currentStatusOption?.label}
          </p>
        </div>
      </div>

      {/* Status Update Form */}
      <div className="space-y-3">
        <label className="text-stellar-white font-medium text-sm">
          Update to:
        </label>
        
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger className="input-cosmic bg-space-dark/50 border-nebula-violet/30 text-stellar-white">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent className="bg-space-dark border border-nebula-violet/30 backdrop-blur-xl">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-stellar-white hover:bg-nebula-violet/20 focus:bg-nebula-violet/20 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating || newStatus === currentStatus}
          className="w-full btn-cosmic"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Updating Status...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Update Status
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 
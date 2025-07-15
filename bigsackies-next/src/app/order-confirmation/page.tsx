"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (!clientSecret) {
      setError("Could not find payment details.");
      setStatus("error");
      return;
    }

    fetch(`/api/orders?payment_intent_client_secret=${clientSecret}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStatus("error");
        } else {
          setStatus(data.paymentIntent.status);
        }
      })
      .catch(() => {
        setError("An unexpected error occurred.");
        setStatus("error");
      });
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 text-center">
      {status === "pending" && <h1>Processing your order...</h1>}
      {status === "error" && <h1 className="text-red-500">Error: {error}</h1>}
      {status === "succeeded" && (
        <>
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg mb-8">
            Thank you for your order. A confirmation email has been sent.
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </>
      )}
    </div>
  );
} 
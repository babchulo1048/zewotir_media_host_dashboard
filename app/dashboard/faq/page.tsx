"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios";

// Define the type for an individual FAQ item from your API response
interface FaqItem {
  faqId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

// Define the type for the full API response
interface FaqApiResponse {
  success: boolean;
  message: string;
  data: FaqItem[];
}

// Assuming your interceptor is configured elsewhere, this component
// will use a local fetch function for clarity. You can easily
// replace it with a direct call to your imported instance if needed.

const FAQ = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<FaqApiResponse> = await instance.get(
          "/faqs"
        );
        if (response.data.success) {
          setFaqs(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        // More robust error handling
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // --- Render logic based on state ---
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-4">
        <h1 className="text-3xl font-bold text-center mb-6">FAQs</h1>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-6">FAQs</h1>
        <p>Error fetching FAQs: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-start justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl shadow-lg border-2 border-primary-foreground">
        <CardHeader className="text-center pb-4 md:pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <AccordionItem
                  key={faq.faqId}
                  value={faq.faqId}
                  className="border-b"
                >
                  <AccordionTrigger className="text-1xl font-medium text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-muted-foreground p-6">
                No FAQs available at the moment.
              </p>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;

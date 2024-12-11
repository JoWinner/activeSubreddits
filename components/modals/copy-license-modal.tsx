"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FREE_LICENSE = process.env.NEXT_PUBLIC_FREE_LICENSE;

export default function CopyLicenseModal() {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState("");
  const licenseString =  FREE_LICENSE || "";
  const licenseChars = licenseString.split("");

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const nextReset = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      nextReset.setHours(0, 0, 0, 0);

      const difference = nextReset.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown(
        `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
          .toString()
          .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      );
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(licenseString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full" >Free license</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <DialogHeader>
          <DialogTitle>Free License</DialogTitle>
          <DialogDescription>
            Start using Tabinet now with a free license!
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4 mb-6">
          <div className="relative grid grid-cols-6 gap-2">
            {licenseChars.map((char, index) => (
              <div
                key={index}
                className={`flex items-center justify-center rounded-md text-lg font-mono font-semibold h-12 w-12 ${
                  char === "-" ? "bg-transparent" : "bg-[#000] bg-opacity-80"
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 z-10"> 
          <div className="text-center sm:text-right">
            <p className="text-base text-gray-500">Valid for:</p>
            <p className="text-lg font-semibold text-gray-400 font-mono" aria-live="polite">
              {countdown}
            </p>
          </div> <Button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy License</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

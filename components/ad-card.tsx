'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Ad {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface AdCardProps {
  ads: Ad[];
  className?: string;
  startIndex: number;
}

export function AdCard({ ads, className = "", startIndex }: AdCardProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(startIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(interval);
  }, [ads.length]);

  const currentAd = ads[currentAdIndex];

  return (
    <Card className={`p-4 ${className} relative overflow-hidden`}>
      <Badge className="absolute top-2 right-2 bg-orange-500 text-white">Sponsor</Badge>
      <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <img src={currentAd.imageUrl} alt={currentAd.title} className="w-full h-32 object-cover mb-2 rounded" />
        <h3 className="text-lg font-semibold mb-1">{currentAd.title}</h3>
        <p className="text-sm text-muted-foreground">{currentAd.description}</p>
      </div>
    </Card>
  );
}


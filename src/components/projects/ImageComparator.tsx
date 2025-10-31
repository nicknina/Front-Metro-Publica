import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonPair } from '@/data/mockData';

interface ImageComparatorProps {
  pair: ComparisonPair;
}

export const ImageComparator = ({ pair }: ImageComparatorProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">{pair.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {new Date(pair.date).toLocaleDateString('pt-BR')}
        </p>
      </CardHeader>
      <CardContent>
        <div
          className="relative w-full aspect-video rounded-lg overflow-hidden cursor-ew-resize select-none"
          onMouseMove={handleSliderChange}
          onClick={handleSliderChange}
        >
          {/* BIM Render (Background) */}
          <div className="absolute inset-0">
            <img
              src={pair.bimRenderUrl}
              alt="Modelo BIM"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
              Modelo BIM
            </div>
          </div>

          {/* Real Photo (Foreground with clip-path) */}
          <div
            className="absolute inset-0 transition-all duration-100"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={pair.realPhotoUrl}
              alt="Foto Real"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-accent/90 text-accent-foreground px-3 py-1 rounded-md text-sm font-medium">
              Foto Real
            </div>
          </div>

          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-0.5 h-4 bg-foreground"></div>
                <div className="w-0.5 h-4 bg-foreground"></div>
              </div>
            </div>
          </div>
        </div>

        {pair.notes && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Observações:</span> {pair.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

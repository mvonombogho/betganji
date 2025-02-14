import React from 'react';
import { Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardSettingsProps {
  layouts: {
    id: string;
    title: string;
    width: 'full' | 'half' | 'third';
    height: 'small' | 'medium' | 'large';
    visible: boolean;
  }[];
  onLayoutChange: (layouts: any[]) => void;
}

export function DashboardSettings({ layouts, onLayoutChange }: DashboardSettingsProps) {
  const handleVisibilityChange = (id: string, visible: boolean) => {
    const updatedLayouts = layouts.map(layout =>
      layout.id === id ? { ...layout, visible } : layout
    );
    onLayoutChange(updatedLayouts);
  };

  const handleSizeChange = (id: string, width: 'full' | 'half' | 'third') => {
    const updatedLayouts = layouts.map(layout =>
      layout.id === id ? { ...layout, width } : layout
    );
    onLayoutChange(updatedLayouts);
  };

  const handleHeightChange = (id: string, height: 'small' | 'medium' | 'large') => {
    const updatedLayouts = layouts.map(layout =>
      layout.id === id ? { ...layout, height } : layout
    );
    onLayoutChange(updatedLayouts);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open dashboard settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dashboard Settings</SheetTitle>
          <SheetDescription>
            Customize your dashboard layout and visible widgets.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {layouts.map(layout => (
            <div key={layout.id} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{layout.title}</span>
                <Switch
                  checked={layout.visible}
                  onCheckedChange={(checked) => handleVisibilityChange(layout.id, checked)}
                />
              </div>
              
              {layout.visible && (
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={layout.width}
                    onValueChange={(value: any) => handleSizeChange(layout.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="half">Half Width</SelectItem>
                      <SelectItem value="third">Third Width</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={layout.height}
                    onValueChange={(value: any) => handleHeightChange(layout.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
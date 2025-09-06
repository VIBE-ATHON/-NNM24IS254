import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Sparkles, Upload } from 'lucide-react';
import { parseSmartInput, generateGhostText } from '@/lib/aiParser';
import { generateClaimToken } from '@/lib/matcher';
import { LostFoundItem, ParsedInput } from '@/lib/types';
import { toast } from 'sonner';

interface PostingFormProps {
  onSubmit: (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'expiresAt'>) => void;
}

export function PostingForm({ onSubmit }: PostingFormProps) {
  const [smartInput, setSmartInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedInput | null>(null);
  const [isSmartMode, setIsSmartMode] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (smartInput.length > 2) {
      const ghost = generateGhostText(smartInput);
      setGhostText(ghost);
      
      if (smartInput.length > 10) {
        const parsed = parseSmartInput(smartInput);
        setParsedData(parsed);
      }
    } else {
      setGhostText('');
      setParsedData(null);
    }
  }, [smartInput]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSmartSubmit = () => {
    if (!parsedData) {
      toast.error('Please provide more details about the item');
      return;
    }

    const item: Omit<LostFoundItem, 'id' | 'createdAt' | 'expiresAt'> = {
      title: `${parsedData.color ? parsedData.color + ' ' : ''}${parsedData.item}`,
      description: parsedData.description,
      type: smartInput.toLowerCase().includes('found') ? 'found' : 'lost',
      category: parsedData.category,
      color: parsedData.color,
      location: parsedData.location,
      date: parsedData.date,
      imageUrl: imagePreview || undefined,
      imageBlurred: true,
      status: 'active',
      tags: [parsedData.item, parsedData.category, parsedData.color, parsedData.location].filter(Boolean),
      claimToken: generateClaimToken()
    };

    onSubmit(item);
    resetForm();
    toast.success('Item posted successfully!');
  };

  const handleManualSubmit = () => {
    if (!title || !description || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item: Omit<LostFoundItem, 'id' | 'createdAt' | 'expiresAt'> = {
      title,
      description,
      type,
      category: category || 'other',
      color: color || undefined,
      location,
      date: new Date().toISOString().split('T')[0],
      imageUrl: imagePreview || undefined,
      imageBlurred: true,
      status: 'active',
      tags: [title, category, color, location].filter(Boolean),
      claimToken: generateClaimToken()
    };

    onSubmit(item);
    resetForm();
    toast.success('Item posted successfully!');
  };

  const resetForm = () => {
    setSmartInput('');
    setTitle('');
    setDescription('');
    setCategory('');
    setColor('');
    setLocation('');
    setImageFile(null);
    setImagePreview('');
    setParsedData(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Post Lost or Found Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="smart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smart">Smart Posting</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="smart" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smart-input">Describe what you lost or found</Label>
              <div className="relative">
                <Input
                  id="smart-input"
                  placeholder="e.g., Lost black wallet in cafeteria today"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  className="pr-4"
                />
                {ghostText && (
                  <div className="absolute inset-0 pointer-events-none flex items-center">
                    <span className="text-muted-foreground/50 pl-3">
                      {smartInput}{ghostText}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {parsedData && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">AI Parsed Information:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Item: {parsedData.item}</Badge>
                  <Badge variant="secondary">Category: {parsedData.category}</Badge>
                  {parsedData.color && <Badge variant="secondary">Color: {parsedData.color}</Badge>}
                  <Badge variant="secondary">Location: {parsedData.location}</Badge>
                  <Badge variant="secondary">Date: {parsedData.date}</Badge>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Add Photo (Optional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handleSmartSubmit}
              disabled={!parsedData}
              className="w-full"
            >
              Post Item
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Item Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Black Leather Wallet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'lost' | 'found')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., wallet"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g., black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Library"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add Photo (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <Button onClick={handleManualSubmit} className="w-full">
              Post Item
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
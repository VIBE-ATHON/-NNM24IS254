import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Eye, EyeOff, MessageCircle, Clock } from 'lucide-react';
import { LostFoundItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: LostFoundItem;
  onClaimClick: (item: LostFoundItem) => void;
  onImageReveal: (itemId: string) => void;
}

export function ItemCard({ item, onClaimClick, onImageReveal }: ItemCardProps) {
  const [imageRevealed, setImageRevealed] = useState(!item.imageBlurred);

  const handleRevealImage = () => {
    setImageRevealed(true);
    onImageReveal(item.id);
  };

  const getTypeColor = (type: 'lost' | 'found') => {
    return type === 'lost' ? 'destructive' : 'default';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      wallet: '💳',
      phone: '📱',
      keys: '🔑',
      bag: '🎒',
      bottle: '🍼',
      electronics: '💻',
      accessories: '👜',
      documents: '📄',
      other: '❓'
    };
    return icons[category] || '❓';
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getCategoryIcon(item.category)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getTypeColor(item.type)} className="text-xs">
                  {item.type.toUpperCase()}
                </Badge>
                {item.color && (
                  <Badge variant="outline" className="text-xs">
                    {item.color}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {item.imageUrl && (
          <div className="relative">
            <img
              src={item.imageUrl}
              alt={item.title}
              className={`w-full h-48 object-cover rounded-md transition-all duration-300 ${
                imageRevealed ? '' : 'blur-md'
              }`}
            />
            {!imageRevealed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRevealImage}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Reveal Image
                </Button>
              </div>
            )}
            {imageRevealed && item.imageBlurred && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Privacy Protected
                </Badge>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(item.date).toLocaleDateString()}
          </div>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">
            {item.claimToken && (
              <span>Token: {item.claimToken}</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => onClaimClick(item)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {item.type === 'lost' ? 'I Found This' : 'This Is Mine'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
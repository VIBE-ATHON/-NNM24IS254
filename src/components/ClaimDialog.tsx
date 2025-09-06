import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LostFoundItem, ClaimConversation, ClaimMessage } from '@/lib/types';
import { toast } from 'sonner';

interface ClaimDialogProps {
  item: LostFoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  conversation: ClaimConversation | null;
  onSendMessage: (itemId: string, message: string) => void;
  onMarkResolved: (conversationId: string) => void;
}

export function ClaimDialog({
  item,
  isOpen,
  onClose,
  conversation,
  onSendMessage,
  onMarkResolved
}: ClaimDialogProps) {
  const [message, setMessage] = useState('');
  const [claimToken, setClaimToken] = useState('');
  const [step, setStep] = useState<'verify' | 'chat'>('verify');

  useEffect(() => {
    if (isOpen && conversation) {
      setStep('chat');
    } else if (isOpen) {
      setStep('verify');
    }
  }, [isOpen, conversation]);

  const handleStartClaim = () => {
    if (!item) return;
    
    // Verify claim token if item has one
    if (item.claimToken && claimToken !== item.claimToken) {
      toast.error('Invalid claim token. Please check and try again.');
      return;
    }

    // Start conversation
    const initialMessage = item.type === 'lost' 
      ? "Hi! I think I found your item. Can you provide more details to verify?"
      : "Hi! I believe this is my item. Can I provide some details to verify?";
    
    onSendMessage(item.id, initialMessage);
    setStep('chat');
    setMessage('');
    setClaimToken('');
  };

  const handleSendMessage = () => {
    if (!item || !message.trim()) return;

    onSendMessage(item.id, message.trim());
    setMessage('');
  };

  const handleMarkResolved = () => {
    if (!conversation) return;
    onMarkResolved(conversation.id);
    toast.success('Claim marked as resolved!');
    onClose();
  };

  const canSendMessage = conversation && conversation.messageCount < conversation.maxMessages;
  const isConversationExpired = conversation && conversation.messageCount >= conversation.maxMessages;

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {item.type === 'lost' ? '🔍' : '✋'} Claim Item
          </DialogTitle>
          <DialogDescription>
            {item.type === 'lost' 
              ? 'Start a conversation to verify you found this item'
              : 'Start a conversation to verify this is your item'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {item.category === 'wallet' ? '💳' : 
                   item.category === 'phone' ? '📱' : 
                   item.category === 'keys' ? '🔑' : '❓'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.location} • {item.date}</p>
              </div>
            </div>
          </div>

          {step === 'verify' && (
            <div className="space-y-4">
              {item.claimToken && (
                <div className="space-y-2">
                  <Label htmlFor="claim-token">
                    Claim Token {item.type === 'lost' && '(if you have it)'}
                  </Label>
                  <Input
                    id="claim-token"
                    placeholder="Enter claim token (e.g., WLT-ABC123)"
                    value={claimToken}
                    onChange={(e) => setClaimToken(e.target.value.toUpperCase())}
                  />
                  <p className="text-xs text-muted-foreground">
                    {item.type === 'lost' 
                      ? 'The person who found your item may ask for this token'
                      : 'This token was provided when the item was reported lost'
                    }
                  </p>
                </div>
              )}
              
              <Button onClick={handleStartClaim} className="w-full">
                Start Verification Chat
              </Button>
            </div>
          )}

          {step === 'chat' && conversation && (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Verification Chat</Label>
                  <Badge variant={isConversationExpired ? 'destructive' : 'default'}>
                    {conversation.messageCount}/{conversation.maxMessages} messages
                  </Badge>
                </div>
                
                <ScrollArea className="h-48 p-3 border rounded-md">
                  <div className="space-y-3">
                    {conversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromPoster ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-sm ${
                            msg.isFromPoster
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Message Input */}
              {canSendMessage ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    {isConversationExpired ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span>Maximum messages reached. Please coordinate outside the platform.</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Waiting for response...</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Mark as Resolved */}
              {conversation.messageCount > 1 && (
                <Button
                  variant="outline"
                  onClick={handleMarkResolved}
                  className="w-full gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
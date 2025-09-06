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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Brain, 
  Upload, 
  Shield, 
  AlertTriangle,
  MessageCircle,
  Camera
} from 'lucide-react';
import { LostFoundItem, ClaimRequest, UserReputation } from '@/lib/types';
import { validateClaimWithAI, validateClaimToken } from '@/lib/claimValidation';
import { toast } from 'sonner';

interface EnhancedClaimDialogProps {
  item: LostFoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claimRequest: Omit<ClaimRequest, 'id' | 'createdAt'>) => void;
  userReputation?: UserReputation;
}

export function EnhancedClaimDialog({ 
  item, 
  isOpen, 
  onClose, 
  onSubmitClaim,
  userReputation 
}: EnhancedClaimDialogProps) {
  const [step, setStep] = useState<'token' | 'quiz' | 'photo' | 'review'>('token');
  const [claimToken, setClaimToken] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [proofPhoto, setProofPhoto] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      setStep(item?.claimToken ? 'token' : 'quiz');
      setClaimToken('');
      setAnswers([]);
      setProofPhoto('');
      setValidationResult(null);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleTokenSubmit = () => {
    if (!claimToken.trim()) {
      toast.error('Please enter the claim token');
      return;
    }

    if (!validateClaimToken(claimToken, item)) {
      toast.error('Invalid or expired claim token');
      return;
    }

    setStep('quiz');
    toast.success('Token verified! Please answer the verification questions.');
  };

  const handleQuizSubmit = () => {
    const requiredQuestions = item.verificationQuestions?.filter(q => q.isRequired) || [];
    const requiredAnswers = answers.slice(0, requiredQuestions.length);
    
    if (requiredAnswers.some(answer => !answer.trim())) {
      toast.error('Please answer all required questions');
      return;
    }

    // Run AI validation
    const validation = validateClaimWithAI(
      {
        id: '',
        itemId: item.id,
        claimantId: 'current-user',
        claimToken,
        quizAnswers: answers,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      item,
      answers
    );

    setValidationResult(validation);

    if (validation.isValid) {
      setStep('photo');
    } else {
      setStep('review');
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    const claimRequest: Omit<ClaimRequest, 'id' | 'createdAt'> = {
      itemId: item.id,
      claimantId: 'current-user',
      claimToken: claimToken || undefined,
      quizAnswers: answers,
      proofPhotoUrl: proofPhoto || undefined,
      status: validationResult?.isValid ? 'pending' : 'flagged',
      aiValidationScore: validationResult?.score,
      aiValidationFlags: validationResult?.flags
    };

    onSubmitClaim(claimRequest);
    onClose();
    
    if (validationResult?.isValid) {
      toast.success('Claim submitted successfully! The finder will review your request.');
    } else {
      toast.warning('Claim submitted for manual review due to validation concerns.');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      wallet: '💳', phone: '📱', keys: '🔑', bag: '🎒', 
      bottle: '🍼', electronics: '💻', accessories: '👜', 
      documents: '📄', other: '❓'
    };
    return icons[category] || '❓';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Claim Verification
          </DialogTitle>
          <DialogDescription>
            Complete the verification process to claim this item
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {getCategoryIcon(item.category)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.location} • {new Date(item.date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={item.type === 'lost' ? 'destructive' : 'default'}>
                      {item.type.toUpperCase()}
                    </Badge>
                    {item.claimToken && (
                      <Badge variant="outline">Token Required</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Reputation */}
          {userReputation && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {userReputation.isVerifiedClaimant ? 'Verified Claimant' : 'New User'}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {userReputation.reputationScore}/100
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          {step === 'token' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claim-token">Claim Token *</Label>
                <Input
                  id="claim-token"
                  placeholder="Enter claim token (e.g., CLM-ABC123)"
                  value={claimToken}
                  onChange={(e) => setClaimToken(e.target.value.toUpperCase())}
                />
                <p className="text-xs text-muted-foreground">
                  This token was provided when the item was originally posted
                </p>
              </div>
              <Button onClick={handleTokenSubmit} className="w-full">
                Verify Token
              </Button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Verification Questions</h3>
              </div>
              
              {item.verificationQuestions?.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {question.question}
                    {question.isRequired && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </Label>
                  <Textarea
                    placeholder="Please provide detailed answer..."
                    value={answers[index] || ''}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    rows={3}
                  />
                </div>
              ))}
              
              <Button onClick={handleQuizSubmit} className="w-full">
                Submit Answers
              </Button>
            </div>
          )}

          {step === 'photo' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Proof Photo (Optional)</h3>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Upload a photo that helps verify your ownership (e.g., similar item, ID, receipt)
              </p>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('proof-upload')?.click()}
                  className="w-full gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Proof Photo
                </Button>
                <input
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {proofPhoto && (
                  <div className="mt-3">
                    <img
                      src={proofPhoto}
                      alt="Proof"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
                  Skip Photo
                </Button>
                <Button onClick={() => setStep('review')} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'review' && validationResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Validation Results</h3>
              </div>
              
              <Card className={validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {validationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className="font-semibold">
                      Validation Score: {validationResult.score}/100
                    </span>
                  </div>
                  
                  {validationResult.flags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Validation Notes:</p>
                      {validationResult.flags.map((flag: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {flag}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm mt-3">
                    {validationResult.isValid 
                      ? 'Your answers look good! The finder will review your claim.'
                      : 'Some answers need manual review. The finder will verify details with you.'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Button onClick={handleFinalSubmit} className="w-full">
                Submit Claim Request
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
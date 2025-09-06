import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Brain, Clock } from 'lucide-react';
import { LostFoundItem, QuizQuestion } from '@/lib/types';
import { toast } from 'sonner';

interface QuickClaimQuizProps {
  item: LostFoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (itemId: string, passed: boolean, answers: string[]) => void;
}

export function QuickClaimQuiz({ item, isOpen, onClose, onQuizComplete }: QuickClaimQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  if (!item) return null;

  // Generate quiz questions based on item details
  const generateQuestions = (item: LostFoundItem): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];

    // Question 1: Color verification (if item has color)
    if (item.color) {
      questions.push({
        id: '1',
        question: 'What color is this item?',
        type: 'choice',
        options: [item.color, 'black', 'blue', 'red', 'white'].filter((v, i, a) => a.indexOf(v) === i),
        correctAnswer: item.color
      });
    } else {
      // Alternative question about category
      questions.push({
        id: '1',
        question: 'What type of item is this?',
        type: 'choice',
        options: [item.category, 'wallet', 'phone', 'keys', 'bag'].filter((v, i, a) => a.indexOf(v) === i),
        correctAnswer: item.category
      });
    }

    // Question 2: Location or specific detail
    if (item.location) {
      questions.push({
        id: '2',
        question: `Where was this item ${item.type === 'lost' ? 'lost' : 'found'}?`,
        type: 'choice',
        options: [item.location, 'Library', 'Cafeteria', 'Parking Lot', 'Gym'].filter((v, i, a) => a.indexOf(v) === i),
        correctAnswer: item.location
      });
    } else {
      // Fallback question about description
      questions.push({
        id: '2',
        question: 'Can you describe a unique feature of this item?',
        type: 'text',
        correctAnswer: '' // Will be manually verified
      });
    }

    return questions;
  };

  const questions = generateQuestions(item);

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
    } else {
      // Quiz complete - evaluate answers
      const correctAnswers = questions.filter((q, index) => {
        if (q.type === 'text') return true; // Text answers are always considered correct for this demo
        return q.correctAnswer === newAnswers[index];
      }).length;

      const passed = correctAnswers >= questions.length - 1; // Allow 1 wrong answer
      setQuizPassed(passed);
      setQuizComplete(true);
      onQuizComplete(item.id, passed, newAnswers);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer('');
    setQuizComplete(false);
    setQuizPassed(false);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Quick Claim Verification
          </DialogTitle>
          <DialogDescription>
            Answer 2 quick questions to verify this is your item
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {getCategoryIcon(item.category)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.location} • {item.date}</p>
              </div>
            </div>
          </div>

          {!quizComplete ? (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {questions[currentQuestion]?.question}
                </Label>

                {questions[currentQuestion]?.type === 'choice' ? (
                  <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                    {questions[currentQuestion]?.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="capitalize">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Input
                    placeholder="Type your answer..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                  />
                )}
              </div>

              <Button onClick={handleAnswerSubmit} className="w-full">
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              {quizPassed ? (
                <div className="space-y-3">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">Verification Passed!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your answers match the item details. You can now contact the poster.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Next steps:</strong> The item poster will be notified of your claim. 
                      {item.claimToken && ` Use token: ${item.claimToken}`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-700">Verification Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      Your answers don't match the item details. Please try again or contact support.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleRestart}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {quizComplete && quizPassed ? 'Done' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
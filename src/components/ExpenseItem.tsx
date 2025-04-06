
import { ExpenseItem as ExpenseItemType, useExpenseStore } from "@/store/useExpenseStore";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getCategoryIcon } from "@/utils/expense-utils";
import { 
  FileText, 
  DollarSign, 
  Users, 
  Calendar,
  ShoppingBag, 
  Home, 
  Car, 
  Plane, 
  Utensils,
  Film,
  Lightbulb,
  Heart,
  Book
} from "lucide-react";

interface ExpenseItemProps {
  expense: ExpenseItemType;
}

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  const { currentUser } = useExpenseStore();
  
  const userShare = expense.splitDetails.find(split => split.userId === currentUser.id)?.amount || 0;
  const isPayer = expense.paidBy.id === currentUser.id;
  
  const getIcon = () => {
    switch(expense.category) {
      case 'Food':
        return <Utensils className="w-4 h-4" />;
      case 'Transportation':
        return <Car className="w-4 h-4" />;
      case 'Housing':
        return <Home className="w-4 h-4" />;
      case 'Entertainment':
        return <Film className="w-4 h-4" />;
      case 'Utilities':
        return <Lightbulb className="w-4 h-4" />;
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Travel':
        return <Plane className="w-4 h-4" />;
      case 'Healthcare':
        return <Heart className="w-4 h-4" />;
      case 'Education':
        return <Book className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className="expense-card mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {getIcon()}
            </div>
            
            <div>
              <h4 className="font-medium">{expense.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">{expense.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-bold">
              {formatCurrency(expense.amount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(expense.timestamp)}
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{expense.paidBy.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {isPayer ? "You paid" : `${expense.paidBy.name} paid`}
            </span>
          </div>
          
          <div>
            <Badge variant={isPayer ? "outline" : "secondary"} className="text-xs">
              {expense.splitType === 'equal' ? 'Split equally' : 'Custom split'}
            </Badge>
          </div>

          <div className={isPayer && !userShare ? "text-expense-positive font-medium text-sm" : "text-expense-negative font-medium text-sm"}>
            {isPayer && !userShare 
              ? `You get back ${formatCurrency(expense.amount)}`
              : isPayer 
                ? `You get back ${formatCurrency(expense.amount - userShare)}`
                : `You owe ${formatCurrency(userShare)}`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseItem;

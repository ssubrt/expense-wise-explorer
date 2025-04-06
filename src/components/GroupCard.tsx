
import { Link } from "react-router-dom";
import { Group, useExpenseStore } from "@/store/useExpenseStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/expense-utils";
import { Users } from "lucide-react";

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const { calculateBalance, currentUser } = useExpenseStore();
  const balance = calculateBalance(currentUser.id, group.id);

  return (
    <Link to={`/group/${group.id}`}>
      <Card className="expense-card mb-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{group.name}</h3>
            <Badge variant={balance >= 0 ? "outline" : "destructive"}>
              {balance >= 0 ? "You are owed" : "You owe"}
            </Badge>
          </div>
          
          <p className="text-muted-foreground line-clamp-2 mb-2">{group.description}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members.length} members</span>
            <span className="mx-2">•</span>
            <span>Created {formatDate(group.createdAt)}</span>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between">
          <div>
            <span className="text-sm text-muted-foreground">Balance:</span>
          </div>
          <div className={balance >= 0 ? "text-expense-positive font-semibold" : "text-expense-negative font-semibold"}>
            {formatCurrency(Math.abs(balance))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GroupCard;

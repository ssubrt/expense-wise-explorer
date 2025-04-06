
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useExpenseStore, User } from "@/store/useExpenseStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getExpenseCategories, formatCurrency } from "@/utils/expense-utils";
import { useToast } from "@/hooks/use-toast";
import ExpenseItem from "@/components/ExpenseItem";
import { ArrowLeft, Plus, Users, DollarSign, Receipt } from "lucide-react";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, getGroupExpenses, users, currentUser, addExpense, calculateBalance } = useExpenseStore();
  const { toast } = useToast();
  
  const group = groups.find(g => g.id === id);
  const expenses = id ? getGroupExpenses(id) : [];
  const categories = getExpenseCategories();
  
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  
  if (!group) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }
  
  const totalGroupBalance = calculateBalance(currentUser.id, group.id);
  
  const handleAddExpense = () => {
    if (!title.trim() || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid expense details",
        description: "Please enter a valid title and amount",
        variant: "destructive",
      });
      return;
    }
    
    const numAmount = parseFloat(amount);
    const payer = users.find(u => u.id === paidBy) || currentUser;
    
    let splitDetails: { userId: string; amount: number }[];
    
    if (splitType === "equal") {
      const perPersonAmount = numAmount / group.members.length;
      splitDetails = group.members.map(member => ({
        userId: member.id,
        amount: member.id === payer.id ? 0 : perPersonAmount,
      }));
    } else {
      // Validate custom splits
      let totalSplit = 0;
      const splits: { userId: string; amount: number }[] = [];
      
      for (const memberId of group.members.map(m => m.id)) {
        const splitAmount = parseFloat(customSplits[memberId] || "0");
        
        if (isNaN(splitAmount) || splitAmount < 0) {
          toast({
            title: "Invalid split amount",
            description: "All split amounts must be valid numbers",
            variant: "destructive",
          });
          return;
        }
        
        totalSplit += splitAmount;
        splits.push({ userId: memberId, amount: splitAmount });
      }
      
      if (Math.abs(totalSplit - numAmount) > 0.01) {
        toast({
          title: "Invalid splits",
          description: "The sum of splits must equal the total amount",
          variant: "destructive",
        });
        return;
      }
      
      splitDetails = splits;
    }
    
    addExpense({
      groupId: group.id,
      title,
      description,
      category,
      amount: numAmount,
      paidBy: payer,
      splitType,
      splitDetails,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setAmount("");
    setPaidBy(currentUser.id);
    setSplitType("equal");
    setCustomSplits({});
    setIsAddingExpense(false);
    
    toast({
      title: "Expense added",
      description: "Your expense has been added to the group",
    });
  };
  
  const initializeCustomSplits = () => {
    const splits: Record<string, string> = {};
    if (splitType === "custom") {
      const perPersonAmount = (parseFloat(amount) || 0) / group.members.length;
      group.members.forEach(member => {
        splits[member.id] = member.id === paidBy ? "0" : perPersonAmount.toFixed(2);
      });
    }
    setCustomSplits(splits);
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-3">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        <div>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
      </div>
      
      <Card className="mb-6 bg-gradient-to-r from-primary to-secondary text-white">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-2">Group Balance</h2>
          <div className="text-3xl font-bold">
            {totalGroupBalance >= 0 
              ? `You are owed ${formatCurrency(totalGroupBalance)}`
              : `You owe ${formatCurrency(Math.abs(totalGroupBalance))}`
            }
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Group Members</h3>
        <div className="flex flex-wrap gap-2">
          {group.members.map(member => (
            <div 
              key={member.id} 
              className="flex items-center p-2 rounded-lg bg-muted/50"
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {member.id === currentUser.id ? `${member.name} (you)` : member.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        
        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Add an expense to split with your group members
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Dinner" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Dinner at Italian restaurant"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="amount" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="paidBy">Paid By</Label>
                <Select value={paidBy} onValueChange={setPaidBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {group.members.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.id === currentUser.id ? `${member.name} (you)` : member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Split Type</Label>
                <RadioGroup 
                  value={splitType} 
                  onValueChange={value => {
                    setSplitType(value as "equal" | "custom");
                    if (value === "custom" && amount) {
                      initializeCustomSplits();
                    }
                  }}
                  className="flex"
                >
                  <div className="flex items-center space-x-2 mr-4">
                    <RadioGroupItem value="equal" id="equal" />
                    <Label htmlFor="equal" className="cursor-pointer">Equal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {splitType === "custom" && (
                <div className="grid gap-3 p-3 border rounded-md">
                  <Label className="text-sm">Custom Split Amounts</Label>
                  
                  {group.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <span className="text-sm">
                        {member.id === currentUser.id ? `${member.name} (you)` : member.name}
                      </span>
                      <div className="relative w-24">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input 
                          value={customSplits[member.id] || "0"} 
                          onChange={e => setCustomSplits({
                            ...customSplits,
                            [member.id]: e.target.value
                          })}
                          className="pl-7 h-8 text-sm"
                          disabled={member.id === paidBy}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingExpense(false)}>Cancel</Button>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {expenses.length === 0 ? (
        <div className="text-center py-10">
          <Receipt className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-xl font-medium">No Expenses Yet</h3>
          <p className="text-muted-foreground mt-2">Add your first expense to get started</p>
          <Button 
            className="mt-4"
            onClick={() => setIsAddingExpense(true)}
          >
            Add an Expense
          </Button>
        </div>
      ) : (
        <div>
          {expenses
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(expense => (
              <ExpenseItem key={expense.id} expense={expense} />
            ))}
        </div>
      )}
    </div>
  );
};

export default GroupDetails;

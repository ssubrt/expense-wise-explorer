
import { useState } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/expense-utils";
import GroupCard from "@/components/GroupCard";
import { Plus, Users } from "lucide-react";

const Index = () => {
  const { groups, users, currentUser, addGroup, calculateBalance } = useExpenseStore();
  const { toast } = useToast();
  
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUser.id]);
  
  const totalBalance = calculateBalance(currentUser.id);

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMembers.length < 2) {
      toast({
        title: "More members required",
        description: "You need at least one other person in the group",
        variant: "destructive",
      });
      return;
    }
    
    const groupMembers = users.filter(user => selectedMembers.includes(user.id));
    
    const groupId = addGroup({
      name: groupName,
      description: groupDescription,
      members: groupMembers,
    });
    
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([currentUser.id]);
    setIsCreatingGroup(false);
    
    toast({
      title: "Group created",
      description: "Your new group has been created successfully",
    });
  };
  
  const toggleMember = (userId: string) => {
    if (userId === currentUser.id) return; // Can't remove yourself
    
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">ExpenseWise</h1>
          <p className="text-muted-foreground">Track and split expenses with friends</p>
        </div>
        <Avatar>
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
      </div>
      
      <Card className="mb-6 bg-gradient-to-r from-primary to-secondary text-white">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-2">Total Balance</h2>
          <div className="text-3xl font-bold">
            {totalBalance >= 0 
              ? `You are owed ${formatCurrency(totalBalance)}`
              : `You owe ${formatCurrency(Math.abs(totalBalance))}`
            }
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Groups</h2>
        
        <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group to track and split expenses with friends.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input 
                  id="name" 
                  value={groupName} 
                  onChange={e => setGroupName(e.target.value)} 
                  placeholder="Trip to Paris" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  value={groupDescription} 
                  onChange={e => setGroupDescription(e.target.value)} 
                  placeholder="Weekend trip to Paris with friends" 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Group Members</Label>
                <div className="border rounded-md p-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {users.map(user => (
                      <div 
                        key={user.id} 
                        onClick={() => toggleMember(user.id)}
                        className={`px-3 py-1 rounded-full text-sm flex items-center cursor-pointer ${
                          selectedMembers.includes(user.id) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } ${user.id === currentUser.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        <span>{user.name}</span>
                        {user.id === currentUser.id && <span className="ml-1 text-xs">(you)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {groups.length === 0 ? (
        <div className="text-center py-10">
          <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-xl font-medium">No Groups Yet</h3>
          <p className="text-muted-foreground mt-2">Create your first group to get started</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsCreatingGroup(true)}
          >
            Create a Group
          </Button>
        </div>
      ) : (
        <div>
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;

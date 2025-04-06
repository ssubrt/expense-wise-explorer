
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from "./pages/Index";
import GroupDetails from "./pages/GroupDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const Stack = createStackNavigator();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NavigationContainer>
        <Stack.Navigator id="AppNavigator" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Index" component={Index} />
          <Stack.Screen name="GroupDetails" component={GroupDetails} initialParams={{ id: undefined }} />
          <Stack.Screen name="NotFound" component={NotFound} />
        </Stack.Navigator>
      </NavigationContainer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

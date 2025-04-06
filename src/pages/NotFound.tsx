
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigation } from '@react-navigation/native';

const NotFound = () => {
  const navigation = useNavigation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Button onPress={() => navigation.navigate("Index")}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

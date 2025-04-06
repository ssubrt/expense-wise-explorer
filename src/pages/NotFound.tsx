
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text, View } from 'react-native';

const NotFound = () => {
  const navigation = useNavigation();
  
  return (
    <View style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <View style={{ alignItems: 'center' }}>
        <AlertCircle style={{ width: 48, height: 48, color: '#6200EE', marginBottom: 16 }} />
        <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 16 }}>404</Text>
        <Text style={{ fontSize: 20, color: '#4b5563', marginBottom: 24 }}>Oops! Page not found</Text>
        <Button 
          onClick={() => navigation.navigate('Index')}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Return to Home
        </Button>
      </View>
    </View>
  );
};

export default NotFound;

import { RestaurantApp } from '../components/RestaurantApp';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RestaurantProvider } from '@/contexts/RestaurantContext';

const Index = () => {
  // Debug: Add a console log to verify this component is being used
  console.log('✅ Index.tsx is being rendered - Real dashboard should load');
  
  return (
    <ThemeProvider>
      <RestaurantProvider>
        <div style={{ minHeight: '100vh' }}>
          <RestaurantApp />
        </div>
      </RestaurantProvider>
    </ThemeProvider>
  );
};

export default Index;

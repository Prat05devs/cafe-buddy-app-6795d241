import { RestaurantApp } from '../components/RestaurantApp';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RestaurantProvider } from '@/contexts/RestaurantContext';

const Index = () => {
  return (
    <ThemeProvider>
      <RestaurantProvider>
        <RestaurantApp />
      </RestaurantProvider>
    </ThemeProvider>
  );
};

export default Index;

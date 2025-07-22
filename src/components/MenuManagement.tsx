import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  UtensilsCrossed
} from 'lucide-react';
import { MenuItem, Category } from '@/types/restaurant';

interface MenuManagementProps {
  items: MenuItem[];
  categories: Category[];
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({
  items,
  categories,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailability
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.id] = filteredItems.filter(item => item.category === category.id);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-muted-foreground">Manage your restaurant's menu items</p>
        </div>
        <Button onClick={onAddItem} size="lg" className="w-full sm:w-auto">
          <Plus className="h-5 w-5 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Menu Items by Category */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, 1fr)` }}>
          <TabsTrigger value="all">All Items ({items.length})</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name} ({groupedItems[category.id]?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MenuItemsView 
            items={filteredItems} 
            viewMode={viewMode}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onToggleAvailability={onToggleAvailability}
          />
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <MenuItemsView 
              items={groupedItems[category.id] || []} 
              viewMode={viewMode}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onToggleAvailability={onToggleAvailability}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface MenuItemsViewProps {
  items: MenuItem[];
  viewMode: 'grid' | 'list';
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
}

const MenuItemsView: React.FC<MenuItemsViewProps> = ({
  items,
  viewMode,
  onEdit,
  onDelete,
  onToggleAvailability
}) => {
  if (items.length === 0) {
    return (
      <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-12 text-center">
        <div className="text-muted-foreground">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No menu items found</p>
        </div>
      </Card>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
            onToggleAvailability={() => onToggleAvailability(item.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <MenuItemRow
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
          onToggleAvailability={() => onToggleAvailability(item.id)}
        />
      ))}
    </div>
  );
};

const MenuItemCard: React.FC<{
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}> = ({ item, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <Card className={`bg-gradient-glass backdrop-blur-md border-glass-border overflow-hidden hover:shadow-medium transition-all duration-300 ${
      !item.available ? 'opacity-75' : ''
    }`}>
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="h-12 w-12 text-primary/50" />
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
          <Badge variant={item.available ? 'success' : 'secondary'}>
            {item.available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{item.price}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleAvailability}
              className="h-8 w-8"
            >
              {item.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const MenuItemRow: React.FC<{
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}> = ({ item, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <Card className={`bg-gradient-glass backdrop-blur-md border-glass-border p-4 ${
      !item.available ? 'opacity-75' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-lg flex items-center justify-center">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <ImageIcon className="h-6 w-6 text-primary/50" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <Badge variant={item.available ? 'success' : 'secondary'}>
                {item.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {item.description || 'No description available'}
            </p>
            <span className="text-lg font-bold text-primary">₹{item.price}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAvailability}
          >
            {item.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
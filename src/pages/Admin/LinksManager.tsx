import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from '@/types';
import { toast } from 'sonner';

const initialJobs: Link[] = [
  {
    id: '1',
    title: 'Software Engineer - Google',
    url: 'https://careers.google.com',
    description: 'Join Google as a Software Engineer and work on cutting-edge technology projects.',
    category: 'jobs',
    subcategory: 'private',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

const initialEducation: Link[] = [
  {
    id: '1',
    title: 'MIT Computer Science Program',
    url: 'https://web.mit.edu/admissions/',
    description: 'World-class computer science education with cutting-edge research opportunities.',
    category: 'education',
    subcategory: 'regular',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

const initialResources: Link[] = [
  {
    id: '1',
    title: 'Khan Academy',
    url: 'https://www.khanacademy.org',
    description: 'Free online courses and educational resources for all subjects and grade levels.',
    category: 'resources',
    subcategory: 'website',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

export default function LinksManager() {
  const [jobs, setJobs] = useLocalStorage<Link[]>('jobs', initialJobs);
  const [education, setEducation] = useLocalStorage<Link[]>('education', initialEducation);
  const [resources, setResources] = useLocalStorage<Link[]>('resources', initialResources);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [activeCategory, setActiveCategory] = useState('jobs');
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    subcategory: ''
  });

  const getLinks = (category: string) => {
    switch (category) {
      case 'jobs': return jobs;
      case 'education': return education;
      case 'resources': return resources;
      default: return [];
    }
  };

  const setLinks = (category: string, links: Link[]) => {
    switch (category) {
      case 'jobs': setJobs(links); break;
      case 'education': setEducation(links); break;
      case 'resources': setResources(links); break;
    }
  };

  const getSubcategories = (category: string) => {
    switch (category) {
      case 'jobs': return ['private', 'government', 'internship'];
      case 'education': return ['regular', 'distance', 'certification'];
      case 'resources': return ['website', 'app'];
      default: return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url || !formData.description || !formData.subcategory) {
      toast.error('Please fill all fields');
      return;
    }

    const currentLinks = getLinks(activeCategory);
    
    if (editingLink) {
      const updatedLinks = currentLinks.map(link =>
        link.id === editingLink.id
          ? { ...link, ...formData, updatedAt: new Date().toISOString() }
          : link
      );
      setLinks(activeCategory, updatedLinks);
      toast.success('Link updated successfully');
    } else {
      const newLink: Link = {
        id: Date.now().toString(),
        ...formData,
        category: activeCategory,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLinks(activeCategory, [newLink, ...currentLinks]);
      toast.success('Link added successfully');
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '', subcategory: '' });
    setEditingLink(null);
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      subcategory: link.subcategory
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const currentLinks = getLinks(activeCategory);
    const updatedLinks = currentLinks.filter(link => link.id !== id);
    setLinks(activeCategory, updatedLinks);
    toast.success('Link deleted successfully');
  };

  const toggleStatus = (id: string) => {
    const currentLinks = getLinks(activeCategory);
    const updatedLinks = currentLinks.map(link =>
      link.id === id ? { ...link, isActive: !link.isActive } : link
    );
    setLinks(activeCategory, updatedLinks);
    toast.success('Link status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Links Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter link title"
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="subcategory">Category</Label>
                <Select value={formData.subcategory} onValueChange={(value) => setFormData({ ...formData, subcategory: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubcategories(activeCategory).map(sub => (
                      <SelectItem key={sub} value={sub}>
                        {sub.charAt(0).toUpperCase() + sub.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLink ? 'Update' : 'Add'} Link
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid gap-4">
            {getLinks(activeCategory).map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                        <Badge variant={link.isActive ? 'default' : 'secondary'}>
                          {link.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {link.subcategory}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{link.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(link.id)}
                      >
                        {link.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this link? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(link.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
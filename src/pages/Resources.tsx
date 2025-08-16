import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Globe, Smartphone, Star } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from '@/types';

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
  },
  {
    id: '2',
    title: 'Duolingo',
    url: 'https://www.duolingo.com',
    description: 'Language learning app with gamified lessons for over 30 languages.',
    category: 'resources',
    subcategory: 'app',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Coursera',
    url: 'https://www.coursera.org',
    description: 'Online platform offering courses from top universities and companies worldwide.',
    category: 'resources',
    subcategory: 'website',
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'LinkedIn Learning',
    url: 'https://www.linkedin.com/learning',
    description: 'Professional development platform with courses on business, technology, and creative skills.',
    category: 'resources',
    subcategory: 'website',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    title: 'Notion',
    url: 'https://www.notion.so',
    description: 'All-in-one workspace app for notes, tasks, wikis, and databases.',
    category: 'resources',
    subcategory: 'app',
    isActive: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: '6',
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Web-based platform for version control and collaboration for software development.',
    category: 'resources',
    subcategory: 'website',
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: '7',
    title: 'Evernote',
    url: 'https://evernote.com',
    description: 'Note-taking app for organizing documents, web clippings, and handwritten notes.',
    category: 'resources',
    subcategory: 'app',
    isActive: true,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15'
  },
  {
    id: '8',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: 'Q&A platform for programmers and developers to find solutions to coding problems.',
    category: 'resources',
    subcategory: 'website',
    isActive: true,
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  }
];

export default function Resources() {
  const [resources] = useLocalStorage<Link[]>('resources', initialResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || resource.subcategory === activeTab;
    return matchesSearch && matchesCategory && resource.isActive;
  });

  const getSubcategoryColor = (subcategory: string) => {
    switch (subcategory) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'app': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Useful Resources</h1>
          <p className="text-gray-600 mb-6">
            Discover helpful websites and applications to boost your productivity and learning
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="website">Websites</TabsTrigger>
              <TabsTrigger value="app">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getSubcategoryColor(resource.subcategory)}>
                          {resource.subcategory === 'website' ? (
                            <div className="flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              Website
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Smartphone className="h-3 w-3 mr-1" />
                              App
                            </div>
                          )}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Added {new Date(resource.createdAt).toLocaleDateString()}
                        </div>
                        <Button size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Visit
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No resources found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
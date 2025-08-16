import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, GraduationCap, Clock, Users } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from '@/types';

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
  },
  {
    id: '2',
    title: 'IGNOU Distance Learning',
    url: 'https://ignou.ac.in',
    description: 'Flexible degree programs through distance education from Indira Gandhi National Open University.',
    category: 'education',
    subcategory: 'distance',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Google Cloud Certification',
    url: 'https://cloud.google.com/certification',
    description: 'Professional cloud certification to advance your career in cloud computing.',
    category: 'education',
    subcategory: 'certification',
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Harvard Online Courses',
    url: 'https://online-learning.harvard.edu',
    description: 'Access Harvard University courses online with flexible scheduling options.',
    category: 'education',
    subcategory: 'regular',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    title: 'Open University UK',
    url: 'https://www.open.ac.uk',
    description: 'Distance learning degrees and qualifications from the UK\'s largest university.',
    category: 'education',
    subcategory: 'distance',
    isActive: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: '6',
    title: 'AWS Certification Program',
    url: 'https://aws.amazon.com/certification/',
    description: 'Industry-recognized certifications to validate your cloud expertise.',
    category: 'education',
    subcategory: 'certification',
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  }
];

export default function Education() {
  const [education] = useLocalStorage<Link[]>('education', initialEducation);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredEducation = education.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || item.subcategory === activeTab;
    return matchesSearch && matchesCategory && item.isActive;
  });

  const getSubcategoryColor = (subcategory: string) => {
    switch (subcategory) {
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'distance': return 'bg-green-100 text-green-800';
      case 'certification': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Educational Opportunities</h1>
          <p className="text-gray-600 mb-6">
            Explore regular admissions, distance learning programs, and professional certifications
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search educational programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="regular">Regular Admission</TabsTrigger>
              <TabsTrigger value="distance">Distance Learning</TabsTrigger>
              <TabsTrigger value="certification">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEducation.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getSubcategoryColor(item.subcategory)}>
                          {item.subcategory === 'regular' ? 'Regular Admission' : 
                           item.subcategory === 'distance' ? 'Distance Learning' : 
                           'Certification'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Flexible</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Open</span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Learn More
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEducation.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No educational programs found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
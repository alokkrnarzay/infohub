import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link } from '@/types';

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
  },
  {
    id: '2',
    title: 'Civil Services Examination - UPSC',
    url: 'https://upsc.gov.in',
    description: 'Apply for Indian Administrative Service and other central government positions.',
    category: 'jobs',
    subcategory: 'government',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Marketing Intern - Microsoft',
    url: 'https://careers.microsoft.com/students',
    description: 'Summer internship opportunity in marketing department at Microsoft.',
    category: 'jobs',
    subcategory: 'internship',
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Data Analyst - Amazon',
    url: 'https://amazon.jobs',
    description: 'Analyze large datasets and provide insights for business decisions.',
    category: 'jobs',
    subcategory: 'private',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    title: 'Banking Jobs - SBI',
    url: 'https://sbi.co.in/careers',
    description: 'Various positions available in State Bank of India branches across the country.',
    category: 'jobs',
    subcategory: 'government',
    isActive: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: '6',
    title: 'Web Development Intern - Startup',
    url: 'https://internshala.com',
    description: 'Learn web development while working on real projects in a fast-paced startup environment.',
    category: 'jobs',
    subcategory: 'internship',
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  }
];

export default function Jobs() {
  const [jobs] = useLocalStorage<Link[]>('jobs', initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || job.subcategory === activeTab;
    return matchesSearch && matchesCategory && job.isActive;
  });

  const getSubcategoryColor = (subcategory: string) => {
    switch (subcategory) {
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'government': return 'bg-green-100 text-green-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-gray-600 mb-6">
            Discover the latest job openings, government positions, and internship opportunities
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="private">Private Jobs</TabsTrigger>
              <TabsTrigger value="government">Government Jobs</TabsTrigger>
              <TabsTrigger value="internship">Internships</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getSubcategoryColor(job.subcategory)}>
                          {job.subcategory.charAt(0).toUpperCase() + job.subcategory.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {job.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Apply Now</span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Apply
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
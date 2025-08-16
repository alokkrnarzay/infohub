import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Award, Calendar, DollarSign, Users } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Scholarship } from '@/types';

const initialScholarships: Scholarship[] = [
  {
    id: '1',
    title: 'Merit Scholarship Program',
    description: 'Merit-based scholarship for outstanding academic performance in undergraduate studies.',
    eligibility: 'GPA 3.5+, Full-time undergraduate student',
    amount: '$5,000 per year',
    deadline: '2024-06-30',
    applicationLink: 'https://scholarships.gov',
    type: 'government',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Tech Innovation Scholarship',
    description: 'Private scholarship supporting students pursuing technology and innovation fields.',
    eligibility: 'STEM major, Demonstrated project experience',
    amount: '$10,000 one-time',
    deadline: '2024-05-15',
    applicationLink: 'https://techfoundation.org/scholarships',
    type: 'private',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'National Education Grant',
    description: 'Government grant for students from economically disadvantaged backgrounds.',
    eligibility: 'Family income below $50,000, Enrolled in accredited institution',
    amount: '$7,500 per semester',
    deadline: '2024-08-01',
    applicationLink: 'https://education.gov/grants',
    type: 'government',
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Women in STEM Scholarship',
    description: 'Private scholarship encouraging women to pursue careers in science and technology.',
    eligibility: 'Female student, STEM field, Minimum 3.0 GPA',
    amount: '$8,000 per year',
    deadline: '2024-07-20',
    applicationLink: 'https://womeninstem.org/apply',
    type: 'private',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    title: 'Minority Student Support Fund',
    description: 'Government initiative to support underrepresented minorities in higher education.',
    eligibility: 'Minority status, Financial need, Academic merit',
    amount: '$6,000 annually',
    deadline: '2024-09-15',
    applicationLink: 'https://minoritysupport.edu',
    type: 'government',
    isActive: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: '6',
    title: 'Entrepreneurship Excellence Award',
    description: 'Private scholarship for students with demonstrated entrepreneurial spirit.',
    eligibility: 'Business plan submission, Leadership experience',
    amount: '$12,000 one-time',
    deadline: '2024-04-30',
    applicationLink: 'https://entrepreneurship.foundation',
    type: 'private',
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  }
];

export default function Scholarships() {
  const [scholarships] = useLocalStorage<Scholarship[]>('scholarships', initialScholarships);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || scholarship.type === activeTab;
    return matchesSearch && matchesCategory && scholarship.isActive;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'government': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlineApproaching = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarship Opportunities</h1>
          <p className="text-gray-600 mb-6">
            Discover private and government scholarships to support your educational journey
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Scholarships</TabsTrigger>
              <TabsTrigger value="private">Private Scholarships</TabsTrigger>
              <TabsTrigger value="government">Government Scholarships</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getTypeColor(scholarship.type)}>
                          {scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)}
                        </Badge>
                        {isDeadlineApproaching(scholarship.deadline) && !isExpired(scholarship.deadline) && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Deadline Soon
                          </Badge>
                        )}
                        {isExpired(scholarship.deadline) && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Expired
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2 text-yellow-600" />
                        {scholarship.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {scholarship.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          <span className="font-semibold text-green-600">{scholarship.amount}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Deadline: {formatDate(scholarship.deadline)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{scholarship.eligibility}</span>
                        </div>
                        <Button 
                          size="sm" 
                          asChild 
                          className="w-full"
                          disabled={isExpired(scholarship.deadline)}
                        >
                          <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                            {isExpired(scholarship.deadline) ? 'Application Closed' : 'Apply Now'}
                            {!isExpired(scholarship.deadline) && <ExternalLink className="h-4 w-4 ml-1" />}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredScholarships.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No scholarships found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
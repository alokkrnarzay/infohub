import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event } from '@/types';

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Republic Day Celebration',
    description: 'National celebration of India\'s Republic Day with parades and cultural programs.',
    date: '2024-01-26',
    location: 'New Delhi, India',
    category: 'national',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'World Economic Forum',
    description: 'Global leaders discuss economic policies and international cooperation.',
    date: '2024-05-15',
    location: 'Davos, Switzerland',
    category: 'international',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Tech Conference 2024',
    description: 'State-level technology conference featuring latest innovations and startups.',
    date: '2024-03-20',
    location: 'Bangalore, Karnataka',
    category: 'state',
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Independence Day',
    description: 'Celebrating India\'s independence with flag hoisting and cultural events.',
    date: '2024-08-15',
    location: 'Red Fort, New Delhi',
    category: 'national',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    title: 'Climate Change Summit',
    description: 'International summit addressing global climate change challenges.',
    date: '2024-06-10',
    location: 'Geneva, Switzerland',
    category: 'international',
    isActive: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: '6',
    title: 'Cultural Festival',
    description: 'Annual cultural festival showcasing traditional arts and crafts.',
    date: '2024-04-05',
    location: 'Mumbai, Maharashtra',
    category: 'state',
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  }
];

export default function Events() {
  const [events] = useLocalStorage<Event[]>('events', initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || event.category === activeTab;
    return matchesSearch && matchesCategory && event.isActive;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'national': return 'bg-orange-100 text-orange-800';
      case 'international': return 'bg-blue-100 text-blue-800';
      case 'state': return 'bg-green-100 text-green-800';
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

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Current Events</h1>
          <p className="text-gray-600 mb-6">
            Stay updated with national, international, and state-level events
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="national">National</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
              <TabsTrigger value="state">State Events</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </Badge>
                        {isUpcoming(event.date) && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Added on {new Date(event.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
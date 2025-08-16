import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BriefcaseIcon, 
  GraduationCapIcon, 
  CalendarIcon, 
  AwardIcon, 
  LinkIcon,
  MessageCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link, Event, Scholarship, Comment } from '@/types';
import LinksManager from './LinksManager';
import EventsManager from './EventsManager';
import ScholarshipsManager from './ScholarshipsManager';
import CommentsManager from './CommentsManager';
import PaymentManager from './PaymentManager';

export default function AdminDashboard() {
  const [jobs] = useLocalStorage<Link[]>('jobs', []);
  const [education] = useLocalStorage<Link[]>('education', []);
  const [resources] = useLocalStorage<Link[]>('resources', []);
  const [events] = useLocalStorage<Event[]>('events', []);
  const [scholarships] = useLocalStorage<Scholarship[]>('scholarships', []);
  const [comments] = useLocalStorage<Comment[]>('comments', []);

  const totalJobs = jobs.filter(job => job.isActive).length;
  const totalEducation = education.filter(edu => edu.isActive).length;
  const totalResources = resources.filter(resource => resource.isActive).length;
  const totalEvents = events.filter(event => event.isActive).length;
  const totalScholarships = scholarships.filter(scholarship => scholarship.isActive).length;
  const pendingComments = comments.filter(comment => !comment.isApproved).length;

  const stats = [
    {
      title: 'Active Jobs',
      value: totalJobs,
      icon: BriefcaseIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Education Programs',
      value: totalEducation,
      icon: GraduationCapIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Events',
      value: totalEvents,
      icon: CalendarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Scholarships',
      value: totalScholarships,
      icon: AwardIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Resources',
      value: totalResources,
      icon: LinkIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Pending Reviews',
      value: pendingComments,
      icon: MessageCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const defaultTab = pendingComments > 0 ? 'comments' : 'overview';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your information portal content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="comments">
              <span className="flex items-center">
                Comments
                {pendingComments > 0 && (
                  <Badge variant="outline" className="ml-2 text-red-600 border-red-600">
                    {pendingComments}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                        <IconComponent className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        Total active items
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Jobs updated</span>
                      <Badge variant="outline">Today</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New scholarship added</span>
                      <Badge variant="outline">Yesterday</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Event published</span>
                      <Badge variant="outline">2 days ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Content Items</span>
                      <span className="font-semibold">
                        {totalJobs + totalEducation + totalEvents + totalScholarships + totalResources}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Comments</span>
                      <span className="font-semibold">{comments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approved Reviews</span>
                      <span className="font-semibold">
                        {comments.filter(c => c.isApproved).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <LinksManager />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsManager />
          </TabsContent>

          <TabsContent value="scholarships" className="mt-6">
            <ScholarshipsManager />
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <CommentsManager />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Content performance and user engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Analytics features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
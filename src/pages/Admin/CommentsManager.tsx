import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, X, Trash2, Star, MessageCircle, Mail, User } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Comment, PaymentSettings } from '@/types';
import { toast } from 'sonner';

const initialComments: Comment[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Great platform! Found my dream job through the job section.',
    rating: 5,
    createdAt: '2024-01-15',
    isApproved: true
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    message: 'The scholarship section helped me fund my education. Highly recommended!',
    rating: 4,
    createdAt: '2024-01-20',
    isApproved: false
  }
];

export default function CommentsManager() {
  const [comments, setComments] = useLocalStorage<Comment[]>('comments', initialComments);
  const [payment] = useLocalStorage<PaymentSettings>('payment_settings', {
    url: '',
    isActive: true,
    updatedAt: new Date().toISOString(),
  });
  const [activeTab, setActiveTab] = useState('pending');

  const approveComment = (id: string) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, isApproved: true } : comment
    );
    setComments(updatedComments);
    toast.success('Comment approved successfully');
  };

  const rejectComment = (id: string) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, isApproved: false } : comment
    );
    setComments(updatedComments);
    toast.success('Comment rejected');
  };

  const deleteComment = (id: string) => {
    const updatedComments = comments.filter(comment => comment.id !== id);
    setComments(updatedComments);
    toast.success('Comment deleted successfully');
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingComments = comments.filter(comment => !comment.isApproved);
  const approvedComments = comments.filter(comment => comment.isApproved);

  const renderComment = (comment: Comment, showActions = true) => (
    <Card key={comment.id} className={!comment.isApproved ? 'border-orange-200 bg-orange-50/30' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={comment.isApproved ? 'default' : 'outline'} 
                     className={comment.isApproved ? '' : 'text-orange-600 border-orange-600'}>
                {comment.isApproved ? 'Approved' : 'Pending Review'}
              </Badge>
              <div className="flex items-center">
                {renderStars(comment.rating)}
              </div>
            </div>
            <CardTitle className="text-lg flex items-center">
              <User className="h-4 w-4 mr-2" />
              {comment.name}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Mail className="h-4 w-4 mr-1" />
              {comment.email}
            </div>
            <p className="text-gray-700 mt-3">{comment.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Submitted on {formatDate(comment.createdAt)}
            </p>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              {!comment.isApproved && (
                <Button
                  size="sm"
                  onClick={() => approveComment(comment.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {comment.isApproved && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectComment(comment.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this comment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteComment(comment.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comments Management</h2>
        <div className="flex space-x-2 items-center">
          {payment.isActive && payment.url ? (
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <a href={payment.url} target="_blank" rel="noopener noreferrer">
                Payment Link
              </a>
            </Button>
          ) : (
            <Badge variant="outline" className="text-gray-600 border-gray-300">Payment link inactive</Badge>
          )}
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Pending: {pendingComments.length}
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Approved: {approvedComments.length}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="approved">Approved Comments</TabsTrigger>
          <TabsTrigger value="all">All Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingComments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending comments to review.</p>
                </CardContent>
              </Card>
            ) : (
              pendingComments.map((comment) => renderComment(comment))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {approvedComments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No approved comments yet.</p>
                </CardContent>
              </Card>
            ) : (
              approvedComments.map((comment) => renderComment(comment))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {comments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No comments found.</p>
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => renderComment(comment))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
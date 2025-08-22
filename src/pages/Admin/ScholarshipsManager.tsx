import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Award, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Scholarship } from '@/types';
import { toast } from 'sonner';

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
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

const isSafeHttpUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const parseDateOnly = (s: string) => {
  if (!s) return new Date('invalid');
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const generateId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
  ? (crypto as unknown as { randomUUID: () => string }).randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ScholarshipsManager() {
  const [scholarships, setScholarships] = useLocalStorage<Scholarship[]>('scholarships', initialScholarships);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    amount: '',
    deadline: '',
    applicationLink: '',
    type: '' as 'private' | 'government' | ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitized = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      eligibility: formData.eligibility.trim(),
      amount: formData.amount.trim(),
      deadline: formData.deadline.trim(),
      applicationLink: formData.applicationLink.trim(),
      type: formData.type,
    };

    if (
      !sanitized.title ||
      !sanitized.description ||
      !sanitized.eligibility ||
      !sanitized.amount ||
      !sanitized.deadline ||
      !sanitized.applicationLink ||
      !sanitized.type
    ) {
      toast.error('Please fill all fields');
      return;
    }

    if (!isSafeHttpUrl(sanitized.applicationLink)) {
      toast.error('Invalid application link. Please use a valid http(s) URL.');
      return;
    }

    if (editingScholarship) {
      const updatedScholarships = scholarships.map(scholarship =>
        scholarship.id === editingScholarship.id
          ? { 
              ...scholarship, 
              ...sanitized, 
              type: sanitized.type === 'private' || sanitized.type === 'government' ? sanitized.type : scholarship.type,
              updatedAt: new Date().toISOString() 
            }
          : scholarship
      );
      setScholarships(updatedScholarships);
      toast.success('Scholarship updated successfully');
    } else {
      const newScholarship: Scholarship = {
        id: generateId(),
        ...sanitized,
        type: sanitized.type === 'private' || sanitized.type === 'government' ? sanitized.type : 'private',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setScholarships([newScholarship, ...scholarships]);
      toast.success('Scholarship added successfully');
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      eligibility: '', 
      amount: '', 
      deadline: '', 
      applicationLink: '', 
      type: '' 
    });
    setEditingScholarship(null);
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      title: scholarship.title,
      description: scholarship.description,
      eligibility: scholarship.eligibility,
      amount: scholarship.amount,
      deadline: scholarship.deadline,
      applicationLink: scholarship.applicationLink,
      type: scholarship.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedScholarships = scholarships.filter(scholarship => scholarship.id !== id);
    setScholarships(updatedScholarships);
    toast.success('Scholarship deleted successfully');
  };

  const toggleStatus = (id: string) => {
    const updatedScholarships = scholarships.map(scholarship =>
      scholarship.id === id ? { ...scholarship, isActive: !scholarship.isActive } : scholarship
    );
    setScholarships(updatedScholarships);
    toast.success('Scholarship status updated');
  };

  const getTypeColor = (type: Scholarship['type']) => {
    switch (type) {
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'government': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const d = parseDateOnly(dateString);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (dateString: string) => {
    if (!dateString) return false;
    const endOfDay = parseDateOnly(dateString);
    if (Number.isNaN(endOfDay.getTime())) return false;
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime() < Date.now();
  };

  if (!mounted) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scholarships Management</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Scholarship Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter scholarship title"
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type || undefined} onValueChange={(value) => setFormData({ ...formData, type: value as 'private' | 'government' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., $5,000 per year"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="applicationLink">Application Link</Label>
                <Input
                  id="applicationLink"
                  type="url"
                  value={formData.applicationLink}
                  onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                  placeholder="https://example.com/apply"
                />
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="Enter eligibility requirements"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter scholarship description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingScholarship ? 'Update' : 'Add'} Scholarship
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-600" />
                      {scholarship.title}
                    </CardTitle>
                    <Badge variant={scholarship.isActive ? 'default' : 'secondary'}>
                      {scholarship.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge className={getTypeColor(scholarship.type)}>
                      {scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)}
                    </Badge>
                    {isExpired(scholarship.deadline) && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Expired
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{scholarship.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Deadline: {formatDate(scholarship.deadline)}</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <a 
                        href={scholarship.applicationLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                      >
                        Application Link
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Eligibility:</strong> {scholarship.eligibility}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStatus(scholarship.id)}
                  >
                    {scholarship.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-label="Edit scholarship"
                    onClick={() => handleEdit(scholarship)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" aria-label="Delete scholarship">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this scholarship? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(scholarship.id)}>
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

        {scholarships.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No scholarships found. Add your first scholarship!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
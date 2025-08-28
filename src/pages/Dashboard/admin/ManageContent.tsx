import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  File,
  Folder,
  Book,
  Video,
  Download,
} from "lucide-react";

const ManageContentPage = () => {
  const [selectedContent, setSelectedContent] = useState<number[]>([]);

  const contentItems = [
    {
      id: 1,
      title: "Mathematics Course",
      type: "Course",
      author: "Prof. Smith",
      created: "2023-09-15",
      status: "Published",
      students: 125,
    },
    {
      id: 2,
      title: "Physics Laboratory Manual",
      type: "Document",
      author: "Dr. Williams",
      created: "2023-09-10",
      status: "Draft",
      students: 0,
    },
    {
      id: 3,
      title: "Chemistry Chapter 1",
      type: "Lesson",
      author: "Prof. Johnson",
      created: "2023-09-05",
      status: "Published",
      students: 89,
    },
    {
      id: 4,
      title: "Biology Video Lecture",
      type: "Video",
      author: "Dr. Davis",
      created: "2023-08-28",
      status: "Published",
      students: 210,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Course":
        return <Book className="h-4 w-4" />;
      case "Document":
        return <File className="h-4 w-4" />;
      case "Lesson":
        return <Folder className="h-4 w-4" />;
      case "Video":
        return <Video className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Course":
        return "secondary";
      case "Document":
        return "outline";
      case "Lesson":
        return "default";
      case "Video":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "Published" ? "default" : "secondary";
  };

  const handleSelectContent = (contentId: number) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage courses, lessons, and resources
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Content
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search content..."
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <File className="h-4 w-4" /> Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Types</DropdownMenuItem>
              <DropdownMenuItem>Course</DropdownMenuItem>
              <DropdownMenuItem>Document</DropdownMenuItem>
              <DropdownMenuItem>Lesson</DropdownMenuItem>
              <DropdownMenuItem>Video</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Folder className="h-4 w-4" /> Author
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Authors</DropdownMenuItem>
              <DropdownMenuItem>Prof. Smith</DropdownMenuItem>
              <DropdownMenuItem>Dr. Williams</DropdownMenuItem>
              <DropdownMenuItem>Prof. Johnson</DropdownMenuItem>
              <DropdownMenuItem>Dr. Davis</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
          <CardDescription>
            Manage educational content and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContent.includes(item.id)}
                      onCheckedChange={() => handleSelectContent(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge variant={getTypeBadgeVariant(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.created}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.students}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit Content
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" /> Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Content
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageContentPage;

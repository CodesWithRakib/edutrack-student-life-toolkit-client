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
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Filter,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const resources = [
    {
      id: 1,
      title: "Introduction to Physics",
      category: "Science",
      type: "PDF",
      uploadedBy: "Mr. Smith",
      uploadDate: "2023-10-15",
      students: 45,
      downloads: 120,
    },
    {
      id: 2,
      title: "Math Formula Cheat Sheet",
      category: "Mathematics",
      type: "Document",
      uploadedBy: "Ms. Johnson",
      uploadDate: "2023-10-12",
      students: 32,
      downloads: 89,
    },
    {
      id: 3,
      title: "World History Timeline",
      category: "History",
      type: "Presentation",
      uploadedBy: "Dr. Williams",
      uploadDate: "2023-10-10",
      students: 28,
      downloads: 67,
    },
    {
      id: 4,
      title: "Chemical Reactions Lab Guide",
      category: "Science",
      type: "PDF",
      uploadedBy: "Mr. Davis",
      uploadDate: "2023-10-08",
      students: 38,
      downloads: 94,
    },
  ];

  const categories = ["All", "Science", "Mathematics", "History", "Literature"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resource Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access and manage educational materials
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter by Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
        </div>
      </div>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
          <CardDescription>Manage your teaching materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources
                .filter(
                  (resource) =>
                    selectedCategory === "All" ||
                    resource.category === selectedCategory
                )
                .map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">
                      {resource.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </TableCell>
                    <TableCell>{resource.type}</TableCell>
                    <TableCell>{resource.uploadedBy}</TableCell>
                    <TableCell>{resource.uploadDate}</TableCell>
                    <TableCell>{resource.students}</TableCell>
                    <TableCell>{resource.downloads}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Share</DropdownMenuItem>
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

export default ResourcesPage;

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
  Filter,
  X,
} from "lucide-react";

// TypeScript interfaces
interface ContentItem {
  id: number;
  title: string;
  type: "Course" | "Document" | "Lesson" | "Video";
  author: string;
  created: string;
  status: "Published" | "Draft";
  students: number;
}

const ManageContentPage: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("All Authors");

  const contentItems: ContentItem[] = [
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

  const contentTypes = ["All Types", "Course", "Document", "Lesson", "Video"];
  const authors = [
    "All Authors",
    "Prof. Smith",
    "Dr. Williams",
    "Prof. Johnson",
    "Dr. Davis",
  ];

  // Filter content based on search term, type, and author
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "All Types" || item.type === selectedType;
    const matchesAuthor =
      selectedAuthor === "All Authors" || item.author === selectedAuthor;

    return matchesSearch && matchesType && matchesAuthor;
  });

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

  const getTypeBadgeVariant = (
    type: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "Course":
        return "default";
      case "Document":
        return "secondary";
      case "Lesson":
        return "outline";
      case "Video":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    return status === "Published" ? "default" : "secondary";
  };

  const handleSelectContent = (contentId: number) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContent(filteredContent.map((item) => item.id));
    } else {
      setSelectedContent([]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All Types");
    setSelectedAuthor("All Authors");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage courses, lessons, and resources
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-200">
          <Plus className="mr-2 h-4 w-4" /> Add Content
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />{" "}
            Filters
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Search and filter content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content by title or author..."
                className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <File className="h-4 w-4" />
                    {selectedType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  {contentTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-750"
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <Folder className="h-4 w-4" />
                    {selectedAuthor}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  {authors.map((author) => (
                    <DropdownMenuItem
                      key={author}
                      onClick={() => setSelectedAuthor(author)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-750"
                    >
                      {author}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {(searchTerm !== "" ||
                selectedType !== "All Types" ||
                selectedAuthor !== "All Authors") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedType !== "All Types" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                Type: {selectedType}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedType("All Types")}
                />
              </Badge>
            )}
            {selectedAuthor !== "All Authors" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                Author: {selectedAuthor}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedAuthor("All Authors")}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Content Library</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {filteredContent.length} item
                {filteredContent.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            {selectedContent.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedContent.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <Download className="mr-2 h-4 w-4" /> Export Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredContent.length > 0 &&
                        selectedContent.length === filteredContent.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedContent.includes(item.id)}
                          onCheckedChange={() => handleSelectContent(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <Badge variant={getTypeBadgeVariant(item.type)}>
                            {item.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {item.author}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {item.created}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {item.students}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          >
                            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-750">
                              <Edit className="mr-2 h-4 w-4" /> Edit Content
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-750">
                              <Download className="mr-2 h-4 w-4" /> Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Content
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      No content found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageContentPage;

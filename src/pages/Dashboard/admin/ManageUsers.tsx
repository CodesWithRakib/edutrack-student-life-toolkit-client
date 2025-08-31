import { useState, useMemo } from "react";
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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Shield,
  Ban,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Download,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow } from "date-fns";

const ManageUsersPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const page = 1;
  const limit = 10;

  // Fetch all users using react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-users", page, limit], // include pagination in key
    queryFn: () => userService.getAllUsers(page, limit),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const users = data?.users || [];

  // Filter users based on search term, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Handle "All" selection
      if (selectedRole === "All" && selectedStatus === "All") {
        return matchesSearch;
      }
      if (selectedRole === "All") {
        return (
          matchesSearch &&
          user.status.toLowerCase() === selectedStatus.toLowerCase()
        );
      }
      if (selectedStatus === "All") {
        return (
          matchesSearch &&
          user.role.toLowerCase() === selectedRole.toLowerCase()
        );
      }

      // Both role and status are selected
      return (
        matchesSearch &&
        user.role.toLowerCase() === selectedRole.toLowerCase() &&
        user.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(currentUsers.map((u) => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const getRoleBadgeVariant = (role: string): string => {
    switch (
      role.toLowerCase() // ✅ Add .toLowerCase()
    ) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "teacher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "student":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const getStatusBadgeVariant = (status: string): string => {
    switch (
      status.toLowerCase() // ✅ Add .toLowerCase()
    ) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-grow" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 pb-4">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
            <CardDescription className="text-center">
              Failed to load users. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-7 w-7" /> User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system users and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Users</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import Users</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors duration-200">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users?.length || 0}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users?.filter((u) => u.status === "active").length || 0}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Admins
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users?.filter((u) => u.role === "admin").length || 0}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Suspended
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users?.filter((u) => u.status === "suspended").length || 0}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />{" "}
            Filters
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Search and filter users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[130px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[130px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm !== "" ||
                selectedRole !== "All" ||
                selectedStatus !== "All") && (
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
            {selectedRole !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-1"
              >
                Role: {selectedRole}
                <X
                  className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setSelectedRole("All")}
                />
              </Badge>
            )}
            {selectedStatus !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-1"
              >
                Status: {selectedStatus}
                <X
                  className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setSelectedStatus("All")}
                />
              </Badge>
            )}
            {searchTerm !== "" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-1"
              >
                Search: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">User List</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
              found
              {selectedUsers.length > 0 &&
                ` • ${selectedUsers.length} selected`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
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
                        currentUsers.length > 0 &&
                        selectedUsers.length === currentUsers.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onCheckedChange={() => handleSelectUser(user._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                              <AvatarFallback
                                className={`${getRoleBadgeVariant(
                                  user.role
                                )} font-medium`}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {user._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{user.email}</span>
                          <div className="flex gap-1 mt-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Send email</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${getRoleBadgeVariant(
                            user.role
                          )} font-medium`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${getStatusBadgeVariant(
                            user.status
                          )} font-medium`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{formatDate(user?.lastLogin)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(user?.lastLogin)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span>{formatDate(user?.createdAt)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(user?.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-48"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-750 cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-750 cursor-pointer">
                              <Mail className="mr-2 h-4 w-4" /> Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                              <Ban className="mr-2 h-4 w-4" />{" "}
                              {user.status === "suspended"
                                ? "Reactivate"
                                : "Suspend"}{" "}
                              Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
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
                      <div className="flex flex-col items-center justify-center py-6">
                        <Users className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                        {(searchTerm !== "" ||
                          selectedRole !== "All" ||
                          selectedStatus !== "All") && (
                          <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-3"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                {filteredUsers.length} entries
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Simplified pagination for many pages */}
                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={
                          currentPage === page
                            ? "bg-purple-600 hover:bg-purple-700 text-white h-8 w-8 p-0"
                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 h-8 w-8 p-0"
                        }
                      >
                        {page}
                      </Button>
                    )
                  )
                ) : (
                  <>
                    {currentPage > 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled
                      >
                        ...
                      </Button>
                    )}
                    {[
                      ...new Set([
                        1,
                        2,
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                        totalPages - 1,
                        totalPages,
                      ]),
                    ]
                      .filter((page) => page >= 1 && page <= totalPages)
                      .sort((a, b) => a - b)
                      .map((page, i, arr) => (
                        <div key={page} className="flex">
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-purple-600 hover:bg-purple-700 text-white h-8 w-8 p-0"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 h-8 w-8 p-0"
                            }
                          >
                            {page}
                          </Button>
                          {arr[i + 1] !== undefined &&
                            arr[i + 1] - page > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled
                              >
                                ...
                              </Button>
                            )}
                        </div>
                      ))}
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex h-8 w-8 p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsersPage;

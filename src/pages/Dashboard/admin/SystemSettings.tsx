import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Lock,
  Save,
  MoreHorizontal,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Stricter TypeScript types
type SettingType = "toggle" | "select" | "input" | "link";
type SettingValue = boolean | string | number;

interface Setting {
  id: number;
  category: string;
  setting: string;
  description: string;
  type: SettingType;
  value: SettingValue;
  options?: string[];
  onChange?: (value: SettingValue) => void;
}

const SystemSettingsPage: React.FC = () => {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredSettings, setFilteredSettings] = useState<Setting[]>([]);

  const settings: Setting[] = [
    {
      id: 1,
      category: "General",
      setting: "Dark Mode",
      description: "Enable dark theme for better visibility",
      type: "toggle",
      value: darkMode,
      onChange: setDarkMode,
    },
    {
      id: 2,
      category: "Notifications",
      setting: "Email Notifications",
      description: "Receive important updates via email",
      type: "toggle",
      value: emailEnabled,
      onChange: setEmailEnabled,
    },
    {
      id: 3,
      category: "Notifications",
      setting: "SMS Notifications",
      description: "Receive urgent alerts via SMS",
      type: "toggle",
      value: smsEnabled,
      onChange: setSmsEnabled,
    },
    {
      id: 4,
      category: "Security",
      setting: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      type: "toggle",
      value: true,
    },
    {
      id: 5,
      category: "Data",
      setting: "Data Backup Frequency",
      description: "How often automatic backups should occur",
      type: "select",
      options: ["Daily", "Weekly", "Monthly"],
      value: "Weekly",
    },
    {
      id: 6,
      category: "Data",
      setting: "Retention Period",
      description: "How long to keep user data before deletion",
      type: "input",
      value: "365 days",
    },
    {
      id: 7,
      category: "Privacy",
      setting: "GDPR Compliance",
      description: "Ensure compliance with European privacy regulations",
      type: "toggle",
      value: true,
    },
    {
      id: 8,
      category: "Privacy",
      setting: "Cookie Policy",
      description: "Configure website cookie preferences",
      type: "link",
      value: "Configure",
    },
  ];

  const categories: string[] = [
    "All",
    "General",
    "Notifications",
    "Security",
    "Data",
    "Privacy",
  ];

  // Filter settings based on search term and category
  useEffect(() => {
    let result = settings;

    if (selectedCategory !== "All") {
      result = result.filter(
        (setting) => setting.category === selectedCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (setting) =>
          setting.setting.toLowerCase().includes(term) ||
          setting.description.toLowerCase().includes(term) ||
          setting.category.toLowerCase().includes(term)
      );
    }

    setFilteredSettings(result);
  }, [searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const handleSettingChange = (id: number, value: SettingValue) => {
    const setting = settings.find((s) => s.id === id);
    if (setting && setting.onChange) {
      setting.onChange(value);
    }
  };

  const getCategoryBadgeVariant = (
    category: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (category) {
      case "General":
        return "default";
      case "Notifications":
        return "secondary";
      case "Security":
        return "destructive";
      case "Data":
        return "outline";
      case "Privacy":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure system preferences and policies
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors duration-200">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      {/* Categories and Search */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />{" "}
            Filters
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Search and filter settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search settings..."
                className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-green-500 focus:border-green-500"
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
                    <Shield className="h-4 w-4" />
                    {selectedCategory === "All" ? "Category" : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-750"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {(searchTerm !== "" || selectedCategory !== "All") && (
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
            {selectedCategory !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                Category: {selectedCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory("All")}
                />
              </Badge>
            )}
            {searchTerm && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                Search: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Table */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Configuration Options</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {filteredSettings.length} setting
                {filteredSettings.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Setting</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettings.length > 0 ? (
                  filteredSettings.map((setting) => (
                    <TableRow
                      key={setting.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell>
                        <Badge
                          variant={getCategoryBadgeVariant(setting.category)}
                        >
                          {setting.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {setting.setting}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </TableCell>
                      <TableCell>
                        {setting.type === "toggle" ? (
                          <Switch
                            checked={setting.value as boolean}
                            onCheckedChange={(checked) =>
                              handleSettingChange(setting.id, checked)
                            }
                            disabled={!setting.onChange}
                          />
                        ) : setting.type === "select" ? (
                          <Select
                            value={setting.value as string}
                            onValueChange={(value) =>
                              handleSettingChange(setting.id, value)
                            }
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              {setting.options?.map((option) => (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className="hover:bg-gray-100 dark:hover:bg-gray-750"
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : setting.type === "input" ? (
                          <Input
                            value={setting.value as string}
                            readOnly
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                          />
                        ) : (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            {setting.value}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
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
                              <Lock className="mr-2 h-4 w-4" /> Reset to Default
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 className="mr-2 h-4 w-4" /> Disable
                              Setting
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      No settings found.
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

export default SystemSettingsPage;

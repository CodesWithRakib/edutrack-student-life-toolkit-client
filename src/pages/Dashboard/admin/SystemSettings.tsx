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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Bell, Shield, Lock, Save, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface Setting {
  id: number;
  category: string;
  setting: string;
  description: string;
  type: "toggle" | "select" | "input" | "link";
  value: any;
  onChange?: (value: any) => void;
  options?: string[];
}

const SystemSettingsPage = () => {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure system preferences and policies
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      {/* Categories and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search settings..."
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categories.map((category) => (
                <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Options</CardTitle>
          <CardDescription>
            Adjust system-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Setting</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell>
                    <Badge variant="secondary">{setting.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {setting.setting}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {setting.description}
                  </TableCell>
                  <TableCell>
                    {setting.type === "toggle" ? (
                      <Switch
                        checked={setting.value}
                        onCheckedChange={setting.onChange}
                        disabled={!setting.onChange}
                      />
                    ) : setting.type === "select" ? (
                      <Select>
                        <SelectTrigger>
                          <span>{setting.value}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {setting.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : setting.type === "input" ? (
                      <Input value={setting.value} readOnly />
                    ) : (
                      <a href="#" className="text-blue-600 hover:underline">
                        Configure
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Lock className="mr-2 h-4 w-4" /> Reset to Default
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Disable Setting
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

export default SystemSettingsPage;

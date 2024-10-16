import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useGroupStore } from "../stores/useGroupStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { toast } from "@/hooks/use-toast";

interface Group {
  id: number;
  name: string;
  is_private: boolean;
  member_limit: number;
  group_profile_image: string;
  role: {
    id: number;
    role_name: string;
  };
}

export const GroupSelectionPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, serverToken, getServerToken } = useAuth();
  const navigate = useNavigate();
  const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);

  const ensureToken = useCallback(
    async (retries = 3): Promise<string | null> => {
      if (serverToken) return serverToken;
      if (!user) {
        navigate("/login");
        return null;
      }
      try {
        const response = await getServerToken(user);
        return response.access_token;
      } catch (error) {
        console.error("Error getting server token:", error);
        if (retries > 0) return ensureToken(retries - 1);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate. Please try logging in again.",
          variant: "destructive",
        });
        navigate("/login");
        return null;
      }
    },
    [navigate, getServerToken, serverToken, user]
  );

  const fetchGroups = useCallback(async () => {
    if (groups.length > 0) {
      setLoading(false);
      return;
    }

    const token = await ensureToken();
    if (!token) {
      setLoading(false);
      setError("Authentication failed. Please log in again.");
      return;
    }

    try {
      const response = await axios.get<Group[]>(
        `${API_BASE_URL}group/group/my_groups/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const adminGroups = response.data.filter(
        (group) => group.role.role_name === "admin"
      );

      if (adminGroups.length === 0) {
        setError("No admin groups available.");
      } else {
        setGroups(adminGroups);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      setError("Failed to load groups. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [ensureToken]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupSelection = async () => {
    const token = await ensureToken();
    if (!token || !selectedGroupId) {
      toast({
        title: "Error",
        description: "Please select a group and ensure you're authenticated.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedGroup = groups.find(
        (group) => group.id.toString() === selectedGroupId
      );

      if (selectedGroup) {
        setSelectedGroup(selectedGroup);
        navigate("/dashboard");
      } else {
        throw new Error("Selected group not found");
      }
    } catch (error) {
      console.error("Failed to select group:", error);
      toast({
        title: "Error",
        description: "Failed to select group. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => {
            setLoading(true);
            fetchGroups();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Select an Admin Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center text-muted-foreground">
            Please select an admin group to continue to your dashboard.
          </p>
          <Select onValueChange={setSelectedGroupId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  <div className="flex items-center">
                    {group.group_profile_image && (
                      <img
                        src={group.group_profile_image}
                        alt={group.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    )}
                    {group.name} {group.is_private ? "🔒" : ""}
                    {group.member_limit > 0 &&
                      ` (${group.member_limit} members)`}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full mt-4"
            onClick={handleGroupSelection}
            disabled={!selectedGroupId}
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

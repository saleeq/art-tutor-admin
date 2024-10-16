// src/pages/StudentGroupsPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { groupApi, StudentGroup } from "@/api/groupApi";
import { toast } from "@/hooks/use-toast";

export const StudentGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { serverToken } = useAuth();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    if (!serverToken) return;
    setLoading(true);
    try {
      const fetchedGroups = await groupApi.getGroups(serverToken);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!serverToken) return;
    try {
      const newGroup = await groupApi.createGroup(serverToken, {
        name: newGroupName,
        description: newGroupDescription,
      });
      setGroups([...groups, newGroup]);
      setIsCreateDialogOpen(false);
      setNewGroupName("");
      setNewGroupDescription("");
      toast({
        title: "Success",
        description: "Group created successfully.",
      });
    } catch (error) {
      console.error("Failed to create group:", error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!serverToken) return;
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await groupApi.deleteGroup(serverToken, groupId);
        setGroups(groups.filter((group) => group.id !== groupId));
        toast({
          title: "Success",
          description: "Group deleted successfully.",
        });
      } catch (error) {
        console.error("Failed to delete group:", error);
        toast({
          title: "Error",
          description: "Failed to delete group. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Groups</h1>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Create New Group</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Input
              placeholder="Group Description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{group.description}</p>
              <p className="mt-2">Members: {group.memberCount}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(group.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

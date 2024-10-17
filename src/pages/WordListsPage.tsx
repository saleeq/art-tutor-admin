import React, { useState, useEffect } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useAuth } from "../hooks/useAuth";
import { WordList, wordListApi } from "@/api/wordListApi";
import WordListDetailPage from "./WordListDetailPage";
import { useToast } from "@/hooks/use-toast";

const WordListsPage: React.FC = () => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [showOnlyUsers, setShowOnlyUsers] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedWordList, setSelectedWordList] = useState<WordList | null>(
    null
  );
  const { serverToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadWordLists = async () => {
      if (serverToken) {
        try {
          const fetchedWordLists = await wordListApi.getAllWordLists(
            serverToken
          );
          setWordLists(fetchedWordLists);
        } catch (error) {
          console.error("Error fetching word lists:", error);
          toast({
            title: "Error",
            description: "Failed to load word lists. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    loadWordLists();
  }, [serverToken, toast]);

  const filteredWordLists = wordLists
    .filter(
      (list) => !showOnlyUsers || list.owner.role === "User" || !list.owner.role
    )
    .filter((list) =>
      list.owner.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

  const handleWordListSelect = (wordList: WordList) => {
    setSelectedWordList(wordList);
  };

  const handleWordListUpdate = (updatedWordList: WordList) => {
    setWordLists((prevLists) =>
      prevLists.map((list) =>
        list.id === updatedWordList.id ? updatedWordList : list
      )
    );
    setSelectedWordList(updatedWordList);
  };

  return (
    <div className="flex flex-col space-y-4">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">Word Lists</CardTitle>
      </CardHeader>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Search students"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Switch
                id="show-users"
                checked={showOnlyUsers}
                onCheckedChange={setShowOnlyUsers}
              />
              <Label htmlFor="show-users" className="text-sm">
                User lists only
              </Label>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWordLists.map((wordList, index) => (
                  <TableRow
                    key={wordList.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <TableCell>{wordList.name}</TableCell>
                    <TableCell>{wordList.owner.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">
                        {wordList.owner.role || "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>{wordList.words.length}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWordListSelect(wordList)}
                      >
                        View Words
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          {selectedWordList ? (
            <WordListDetailPage
              wordList={selectedWordList}
              onWordListUpdate={handleWordListUpdate}
            />
          ) : (
            <div className="bg-white shadow-md rounded-lg p-4 text-center text-gray-500">
              Select a word list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordListsPage;

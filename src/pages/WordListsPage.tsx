// pages/WordListsPage.tsx

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

import { useAuth } from "../hooks/useAuth";
import { WordList, wordListApi } from "@/api/wordListApi";

const WordListsPage: React.FC = () => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [showOnlyUsers, setShowOnlyUsers] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [expandedLists, setExpandedLists] = useState<Record<number, boolean>>(
    {}
  );
  const [wordSearches, setWordSearches] = useState<Record<number, string>>({});
  const { serverToken } = useAuth();

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
        }
      }
    };
    loadWordLists();
  }, [serverToken]);

  const filteredWordLists = wordLists
    .filter(
      (list) => !showOnlyUsers || list.owner.role === "User" || !list.owner.role
    )
    .filter((list) =>
      list.owner.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

  const toggleListExpansion = (id: number) => {
    setExpandedLists((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleWordSearch = (id: number, search: string) => {
    setWordSearches((prev) => ({ ...prev, [id]: search }));
  };

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <div className="flex items-center justify-between px-2 gap-4">
          <CardTitle className="text-xl font-bold whitespace-nowrap">
            Word Lists
          </CardTitle>
          <div className="flex items-center gap-4 flex-grow justify-end">
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
        </div>
      </CardHeader>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Words Count</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWordLists.map((wordList, index) => (
              <React.Fragment key={wordList.id}>
                <TableRow
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell>{wordList.name}</TableCell>
                  <TableCell>{wordList.owner.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-sm">
                      {wordList.owner.role || "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>{wordList.words.length} words</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleListExpansion(wordList.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {expandedLists[wordList.id] ? "Hide" : "Show"} Words
                    </button>
                  </TableCell>
                </TableRow>
                {expandedLists[wordList.id] && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-gray-100 p-4">
                      <div className="mb-2">
                        <Input
                          placeholder="Search words"
                          value={wordSearches[wordList.id] || ""}
                          onChange={(e) =>
                            handleWordSearch(wordList.id, e.target.value)
                          }
                          className="max-w-xs"
                        />
                      </div>
                      <ul className="list-disc pl-6 mt-2 text-gray-900">
                        {wordList.words
                          .filter((word) =>
                            word
                              .toLowerCase()
                              .includes(
                                (wordSearches[wordList.id] || "").toLowerCase()
                              )
                          )
                          .map((word, index) => (
                            <li key={index}>{word}</li>
                          ))}
                      </ul>
                      {wordList.groups_access.length > 0 && (
                        <div className="mt-4">
                          <strong className="text-gray-700">
                            Shared with groups:
                          </strong>
                          <ul className="list-disc pl-6 mt-2 text-gray-900">
                            {wordList.groups_access.map((group) => (
                              <li key={group.id}>{group.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WordListsPage;

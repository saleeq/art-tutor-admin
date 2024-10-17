import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useAuth } from "../hooks/useAuth";
import { WordList, wordListApi } from "@/api/wordListApi";
import { toast } from "@/hooks/use-toast";

interface WordListDetailPageProps {
  wordList: WordList;
  onWordListUpdate: (updatedWordList: WordList) => void;
}

const WordListDetailPage: React.FC<WordListDetailPageProps> = ({
  wordList,
  onWordListUpdate,
}) => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [newWord, setNewWord] = useState("");
  const { serverToken } = useAuth();

  const handleAddWord = async () => {
    if (serverToken && id && newWord.trim()) {
      try {
        // const updatedWordList = await wordListApi.addWord(
        //   serverToken,
        //   id,
        //   newWord.trim()
        // );
        // onWordListUpdate(updatedWordList);
        setNewWord("");
        toast({
          title: "Word Added",
          description: `"${newWord.trim()}" has been added to the word list.`,
        });
      } catch (error) {
        console.error("Error adding new word:", error);
        toast({
          title: "Error",
          description: "Failed to add the new word. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteWord = async (wordToDelete: string) => {
    if (serverToken && id) {
      try {
        // const updatedWordList = await wordListApi.deleteWord(
        //   serverToken,
        //   id,
        //   wordToDelete
        // );
        // onWordListUpdate(updatedWordList);
        toast({
          title: "Word Deleted",
          description: `"${wordToDelete}" has been removed from the word list.`,
        });
      } catch (error) {
        console.error("Error deleting word:", error);
        toast({
          title: "Error",
          description: "Failed to delete the word. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredWords = wordList.words.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedWords = [...filteredWords].sort((a, b) =>
    sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
  );

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <div className="flex items-center justify-between px-2 gap-4">
          <CardTitle className="text-xl font-bold">
            Word List: {wordList.name}
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Word</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Word</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-word" className="text-right">
                    Word
                  </Label>
                  <Input
                    id="new-word"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddWord}>Add Word</Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search words"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWords.map((word, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <TableCell>{word}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteWord(word)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WordListDetailPage;

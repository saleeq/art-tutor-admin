import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { WordList, wordListApi } from "@/api/wordListApi";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { secondaryDb } from "@/utils/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { ArrowLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface WordOperationResponse {
  message: string;
  word: string;
}

const MobileWordCard: React.FC<{
  word: string;
  onDelete: (word: string) => void;
  isDeleting: boolean;
}> = ({ word, onDelete, isDeleting }) => (
  <Card className="mb-2">
    <CardContent className="p-4 flex justify-between items-center">
      <span className="font-medium">{word}</span>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(word)}
        disabled={isDeleting}
        className="h-8 px-3"
      >
        {isDeleting ? (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </CardContent>
  </Card>
);

const WordListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wordList, setWordList] = useState<WordList | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [newWord, setNewWord] = useState("");
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [isDeletingWord, setIsDeletingWord] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [localUpdateTimestamp, setLocalUpdateTimestamp] = useState<number | null>(null);
  const isLocalUpdate = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const { serverToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to refresh word list data
  const refreshWordList = async () => {
    if (!serverToken || !id) return;

    try {
      const allLists = await wordListApi.getAllWordLists(serverToken);
      const foundList = allLists.find(list => list.id === Number(id));
      if (foundList) {
        setWordList(foundList);
      }
    } catch (error) {
      console.error("Error refreshing word list:", error);
    }
  };

  // Function to update Firestore
  const updateFirestore = async (userId: string) => {
    try {
      const timestamp = new Date().getTime();
      isLocalUpdate.current = true;
      setLocalUpdateTimestamp(timestamp);
      
      const docRef = doc(secondaryDb, "wordList", userId);
      await setDoc(docRef, {
        updatedAt: timestamp,
      }, { merge: true });
    } catch (error) {
      console.error("Error updating firestore:", error);
      isLocalUpdate.current = false;
    }
  };

  useEffect(() => {
    const loadWordList = async () => {
      if (!serverToken || !id) {
        console.error("Missing token or id", { hasToken: !!serverToken, id });
        navigate("/word-lists");
        return;
      }

      setIsLoading(true);
      try {
        const allLists = await wordListApi.getAllWordLists(serverToken);
        const foundList = allLists.find(list => list.id === Number(id));
        
        if (!foundList) {
          console.error("Word list not found");
          toast({
            title: "Error",
            description: "Word list not found",
            variant: "destructive",
          });
          navigate("/word-lists");
          return;
        }

        setWordList(foundList);

        if (foundList.owner.user_id) {
          const docRef = doc(secondaryDb, "wordList", foundList.owner.user_id.toString());
          
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
          }

          unsubscribeRef.current = onSnapshot(docRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.updatedAt) {
              if (!isLocalUpdate.current && data.updatedAt !== localUpdateTimestamp) {
                console.log("External update detected, refreshing word list");
                refreshWordList();
              }
              isLocalUpdate.current = false;
            }
          });
        }
      } catch (error) {
        console.error("Error fetching word list:", error);
        toast({
          title: "Error",
          description: "Failed to load word list. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/word-lists"), 1000);
      } finally {
        setIsLoading(false);
      }
    };

    loadWordList();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [serverToken, id, navigate, toast]);
  const handleAddWord = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!serverToken || !newWord.trim() || !wordList) return;

    const wordToAdd = newWord.trim();

    if (wordList.words.includes(wordToAdd)) {
      toast({
        title: "Error",
        description: "This word already exists in the list.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingWord(true);
    try {
      const response = await wordListApi.addWord(
        serverToken,
        wordList.id,
        wordToAdd
      ) as WordOperationResponse;

      setWordList((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          words: [...prev.words, response.word],
        };
      });

      if (wordList.owner.user_id !== undefined) {
        await updateFirestore(wordList.owner.user_id.toString());
      }

      setNewWord("");
      setIsAddDialogOpen(false);

      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding word:", error);
      handleApiError(error, "Failed to add the word. Please try again.");
    } finally {
      setIsAddingWord(false);
    }
  };

  const initiateDeleteWord = (word: string) => {
    setWordToDelete(word);
  };

  const handleDeleteWord = async () => {
    if (!serverToken || !wordToDelete || !wordList) return;

    setIsDeletingWord(wordToDelete);
    try {
      const response = await wordListApi.deleteWord(
        serverToken,
        wordList.id,
        wordToDelete
      ) as WordOperationResponse;

      setWordList((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          words: prev.words.filter((word) => word !== response.word),
        };
      });

      if (wordList.owner.user_id !== undefined) {
        await updateFirestore(wordList.owner.user_id.toString());
      }

      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting word:", error);
      handleApiError(error, "Failed to delete the word. Please try again.");
    } finally {
      setIsDeletingWord(null);
      setWordToDelete(null);
    }
  };

  const handleApiError = (error: unknown, defaultMessage: string) => {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        defaultMessage;

      toast({
        title: error.response?.status === 422 ? "Validation Error" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : defaultMessage,
        variant: "destructive",
      });
    }
  };

  const LoadingSpinner = () => (
    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!wordList) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-gray-500">Word list not found</p>
        <Button variant="outline" onClick={() => navigate("/word-lists")}>
          Return to Word Lists
        </Button>
      </div>
    );
  }

  const filteredWords = wordList.words.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedWords = [...filteredWords].sort((a, b) =>
    sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
  );

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
          <div className="space-y-1">
           
            <CardTitle className="flex text-xl md:text-2xl font-bold gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/word-lists")}
              className="mb-2"
            >
              <ArrowLeft/> 
            </Button>{wordList.name}
            </CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">Add New Word</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Word</DialogTitle>
                <DialogDescription>
                  Enter a new word to add to your word list. Duplicate words are
                  not allowed.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddWord}>
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
                      placeholder="Enter a new word"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isAddingWord || !newWord.trim()}
                    className="w-full md:w-auto"
                  >
                    {isAddingWord ? <LoadingSpinner /> : "Add Word"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Input
          placeholder="Search words"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="w-full md:w-auto"
        >
          Sort {sortOrder === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {isMobile ? (
        <div className="space-y-2">
          {sortedWords.map((word, index) => (
            <MobileWordCard
              key={`${word}-${index}`}
              word={word}
              onDelete={initiateDeleteWord}
              isDeleting={isDeletingWord === word}
            />
          ))}
        </div>
      ) : (
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
                  key={`${word}-${index}`}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell>{word}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => initiateDeleteWord(word)}
                      disabled={isDeletingWord === word}
                    >
                      {isDeletingWord === word ? <LoadingSpinner /> : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!wordToDelete}
        onOpenChange={(open) => !open && setWordToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Word</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{wordToDelete}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWord}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              {isDeletingWord ? <LoadingSpinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WordListDetailPage;
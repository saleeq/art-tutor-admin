// src/pages/DashboardPage.tsx
import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - replace with actual API calls
// const mockGroups = [
//   { id: "1", name: "Group A", studentCount: 15 },
//   { id: "2", name: "Group B", studentCount: 20 },
//   { id: "3", name: "Group C", studentCount: 18 },
// ];

// const mockWordLists = [
//   { id: "1", name: "Beginner Words", wordCount: 50 },
//   { id: "2", name: "Intermediate Words", wordCount: 100 },
//   { id: "3", name: "Advanced Words", wordCount: 150 },
// ];

// const mockChartData = [
//   { name: "Mon", studyTime: 2 },
//   { name: "Tue", studyTime: 3 },
//   { name: "Wed", studyTime: 4 },
//   { name: "Thu", studyTime: 3 },
//   { name: "Fri", studyTime: 5 },
//   { name: "Sat", studyTime: 2 },
//   { name: "Sun", studyTime: 1 },
// ];

export const DashboardPage: React.FC = () => {
  //  const { user } = useAuth();
  // const [groups, setGroups] = useState(mockGroups);
  // const [wordLists, setWordLists] = useState(mockWordLists);
  // const [chartData, setChartData] = useState(mockChartData);

  useEffect(() => {
    // Fetch actual data here
    // setGroups(await fetchGroups());
    // setWordLists(await fetchWordLists());
    // setChartData(await fetchChartData());
  }, []);

  // const maxStudyTime = Math.max(...chartData.map((d) => d.studyTime));

  // return (
  //   <div className="p-6 ">
  //     <h1 className="text-3xl font-bold mb-6">Welcome, {user?.email}</h1>

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Total Groups</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <p className="text-4xl font-bold">{groups.length}</p>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Total Word Lists</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <p className="text-4xl font-bold">{wordLists.length}</p>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Total Students</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <p className="text-4xl font-bold">
  //             {groups.reduce((sum, group) => sum + group.studentCount, 0)}
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </div>

  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Recent Groups</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <ul className="space-y-2">
  //             {groups.slice(0, 3).map((group) => (
  //               <li
  //                 key={group.id}
  //                 className="flex items-center justify-between"
  //               >
  //                 <div className="flex items-center">
  //                   <Avatar className="h-10 w-10">
  //                     <AvatarFallback>{group.name[0]}</AvatarFallback>
  //                   </Avatar>
  //                   <span className="ml-2">{group.name}</span>
  //                 </div>
  //                 <span className="text-sm text-gray-500">
  //                   {group.studentCount} students
  //                 </span>
  //               </li>
  //             ))}
  //           </ul>
  //           <Button asChild className="w-full mt-4">
  //             <Link to="/groups">View All Groups</Link>
  //           </Button>
  //         </CardContent>
  //       </Card>

  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Recent Word Lists</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <ul className="space-y-2">
  //             {wordLists.slice(0, 3).map((list) => (
  //               <li key={list.id} className="flex items-center justify-between">
  //                 <span>{list.name}</span>
  //                 <span className="text-sm text-gray-500">
  //                   {list.wordCount} words
  //                 </span>
  //               </li>
  //             ))}
  //           </ul>
  //           <Button asChild className="w-full mt-4">
  //             <Link to="/word-lists">View All Word Lists</Link>
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>

  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Weekly Study Time</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="h-[300px] flex items-end justify-between">
  //           {chartData.map((data, index) => (
  //             <div key={index} className="flex flex-col items-center">
  //               <div
  //                 style={{
  //                   height: `${(data.studyTime / maxStudyTime) * 200}px`,
  //                 }}
  //                 className="w-8 bg-blue-500 rounded-t"
  //               ></div>
  //               <span className="mt-2 text-sm">{data.name}</span>
  //             </div>
  //           ))}
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
  return <></>;
};

"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";

// Define the type for user data
interface User {
  id: number;
  name: string;
  posts_count: string;
  created_at: string;
  updated_at: string;
}

const TopUsers: React.FC = () => {
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/top-users`;
        const response = await axios.get(url);
        setTopUsers(response.data);
      } catch (error) {
        console.error("Error fetching top users:", error);
      }
    };
    fetchTopUsers();
  }, []);

  return (
    <div>
      <h1>Top Users</h1>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {topUsers.map((user) => (
          <Card className="max-w-[300px]" shadow="sm" key={user.id} isPressable>
            <CardBody className="p-4">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-default-500">Total post {user.posts_count}</p>
              {/* <p className="text-default-500">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p> */}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;

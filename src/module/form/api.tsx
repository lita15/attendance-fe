import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const createAttendance = () => {
  return useMutation({
    mutationKey: ["create-attendance"],
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        "http://localhost:4000/api/attendance",
        payload
      );
      return data;
    },
  });
};

export const checkNumberCard = () => {
  return useMutation({
    mutationKey: ["check-number"],
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        "http://localhost:4000/api/attendance/check-number-card",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
  });
};

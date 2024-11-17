import { useContext } from "react";
import { DbContext } from "@/app/contexts";

const useDb = () => {
  const { db } = useContext(DbContext);

  return db;
};

export { useDb };

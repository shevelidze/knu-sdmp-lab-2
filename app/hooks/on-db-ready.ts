import { useEffect } from "react";
import { useDb } from "./use-db";
import { Db } from "@/app/types";

type Func = (db: Db) => void;

const onDbReady = (func: Func) => {
  const db = useDb();

  useEffect(() => {
    if (db) {
      func(db);
    }
  }, [db]);
};

export { onDbReady };

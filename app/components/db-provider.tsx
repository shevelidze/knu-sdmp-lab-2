import { useCallback, useEffect, useState } from "react";
import { DbContext } from "@/app/contexts";
import * as SQLite from "expo-sqlite";
import { EducationalCoursesService } from "../classes";

interface Props {
  children: React.ReactNode;
}

const DbProvider: React.FC<Props> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [coursesService, setCoursesService] =
    useState<EducationalCoursesService | null>(null);

  const initializeDb = useCallback(async (): Promise<void> => {
    const db = await SQLite.openDatabaseAsync("main");
    setDb(db);
    const createdCoursesService = new EducationalCoursesService(db);

    await createdCoursesService.initialize();

    setCoursesService(createdCoursesService);
  }, []);

  useEffect(() => {
    initializeDb();
  }, [initializeDb]);

  return (
    <DbContext.Provider value={{ db, coursesService }}>
      {children}
    </DbContext.Provider>
  );
};

export { DbProvider };

import React from "react";
import { Db } from "../types";
import { EducationalCoursesService } from "../classes";

interface DbContextType {
  db: Db | null;
  coursesService: EducationalCoursesService | null;
}

const DbContext = React.createContext<DbContextType>({
  db: null,
  coursesService: null,
});

export { DbContext };

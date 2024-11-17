import { EducationalCoursesService } from "@/app/classes";
import { useContext } from "react";
import { DbContext } from "../contexts";

const useCoursesService = (): EducationalCoursesService | null => {
  const { coursesService } = useContext(DbContext);

  return coursesService;
};

export { useCoursesService };

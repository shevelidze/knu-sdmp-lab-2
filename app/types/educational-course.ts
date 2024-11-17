type EducationalCourseWithoutId = {
  name: string;
  lecturerName: string;
  buildingAddress: string;
  mark: number;
};

type EducationalCourse = EducationalCourseWithoutId & {
  id: number;
};

export type { EducationalCourse, EducationalCourseWithoutId };

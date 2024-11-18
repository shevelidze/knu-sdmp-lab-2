type EducationalCourseWithoutId = {
  name: string;
  lecturerName: string;
  buildingAddress: string;
  buildingLatitude: number;
  buildingLongitude: number;
  mark: number;
};

type EducationalCourse = EducationalCourseWithoutId & {
  id: number;
};

export type { EducationalCourse, EducationalCourseWithoutId };

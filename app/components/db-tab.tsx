import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { EducationalCourse } from "@/app/types";
import { useCallback, useEffect, useState } from "react";
import { useCoursesService } from "@/app/hooks";
import { Course } from "./course";

const DbTab: React.FC = () => {
  const coursesService = useCoursesService();

  const [courses, setCourses] = useState<EducationalCourse[]>([]);
  const [allCourses, setAllCourses] = useState<EducationalCourse[]>([]);
  const [averageMark, setAverageMark] = useState<number | null>(null);

  const lecturerName = "Кондратюк Ю.В.";

  const loadCourses = useCallback(() => {
    if (coursesService) {
      coursesService
        .findPassedCoursesByLecturerName(lecturerName)
        .then((nextCourses) => {
          setCourses(nextCourses);
        });
    }
  }, [coursesService, lecturerName]);

  const loadAllCourses = useCallback(() => {
    if (coursesService) {
      coursesService.findAll().then((nextCourses) => {
        setAllCourses(nextCourses);
      });
    }
  }, [coursesService, lecturerName]);

  const loadAverageMark = useCallback(() => {
    if (coursesService) {
      coursesService.getAverageMark().then((nextAverageMark) => {
        setAverageMark(nextAverageMark);
      });
    }
  }, [coursesService]);

  useEffect(() => {
    loadCourses();
    loadAllCourses();
  }, [loadCourses, loadAllCourses]);

  useEffect(() => {
    loadAverageMark();
  }, [loadAverageMark]);

  const reset = async () => {
    if (!coursesService) {
      return;
    }

    await coursesService.reset();

    loadCourses();
    loadAllCourses();
    loadAverageMark();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, styles.section]}>
          Середній бал серед усіх дисциплін:{" "}
          {averageMark !== null ? `${averageMark.toFixed(2)} б.` : ""}
        </Text>
        <View>
          <Text style={styles.title}>
            Дисципліни що, викладає {lecturerName}, за якими я атестований:
          </Text>
          <View style={styles.section}>
            {courses.map((course) => (
              <Course key={course.id} course={course} />
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.title}>Усі мої дисципліни:</Text>
          <View style={styles.section}>
            {allCourses.map((course) => (
              <Course key={course.id} course={course} />
            ))}
          </View>
        </View>

        <Button title="Оновити" onPress={reset} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  section: {
    marginBottom: 60,
  },
});

export { DbTab };

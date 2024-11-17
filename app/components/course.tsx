import { StyleSheet, Text, View } from "react-native";
import { EducationalCourse } from "../types";

type Props = {
  course: EducationalCourse;
};

const Course: React.FC<Props> = ({ course }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{course.name}</Text>
        <Text style={styles.lecturer}>{course.lecturerName}</Text>
        <Text style={styles.address}>{course.buildingAddress}</Text>
      </View>
      <Text
        style={[
          styles.mark,
          course.mark < 60 ? styles.badMark : styles.goodMark,
        ]}
      >
        {course.mark} б.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 24,
  },
  lecturer: {
    fontSize: 20,
  },
  mark: {
    fontSize: 24,
    color: "green",
  },
  badMark: {
    color: "red",
  },
  goodMark: {
    color: "green",
  },
  address: {},
});

export { Course };

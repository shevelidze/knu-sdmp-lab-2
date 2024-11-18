import { Button, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { EducationalCourse } from "../types";
import { useCallback, useEffect, useState } from "react";
import { useCoursesService } from "../hooks";
import { Course } from "./course";

const MapTab: React.FC = () => {
  const [course, setCourse] = useState<EducationalCourse | null>(null);

  const coursesService = useCoursesService();

  const loadCourse = useCallback(async () => {
    if (!coursesService) {
      return;
    }

    const course = await coursesService.findOneRandom();

    setCourse(course);
  }, [coursesService]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  return (
    <View style={styles.container}>
      <Button title="Оновити" onPress={loadCourse} />
      {course && (
        <>
          <Course course={course} />
          <MapView
            style={styles.map}
            region={{
              latitude: course.buildingLatitude,
              longitude: course.buildingLongitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate={{
                latitude: course.buildingLatitude,
                longitude: course.buildingLongitude,
              }}
              title={course.name}
              description={course.buildingAddress}
            />
          </MapView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  map: {
    width: "100%",
    height: 400,
  },
});

export { MapTab };

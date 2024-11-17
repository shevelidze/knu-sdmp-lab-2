import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { ContactsTab, DbTab, MapTab } from "./components";

const renderScene = SceneMap({
  db: DbTab,
  contacts: ContactsTab,
  map: MapTab,
});

const routes = [
  { key: "db", title: "БД" },
  { key: "contacts", title: "Адресна книга" },
  { key: "map", title: "Геосервіс" },
];

const App: React.FC = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

export { App };

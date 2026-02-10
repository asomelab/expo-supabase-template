import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Instrument = {
  id: number;
  name: string;
};

export default function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    if (__DEV__) {
      console.tron.log("Fetching instruments...");
    }

    const { data } = await supabase.from("instruments").select();
    setInstruments(data ?? []);

    if (__DEV__) {
      console.tron.log("Instruments fetched:", data);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={instruments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import "@/global.css";

export default function MenuScreen() {
  
  const [pokemonList, setPokemonList] = useState<any[]>([]);// Estado para almacenar todos los pokémones de la primera generación
  const [loading, setLoading] = useState(true);// Estado para manejar el indicador de carga
  const router = useRouter();// Hook de navegación (para ir a otras pantallas)

  // useEffect se ejecuta una sola vez cuando la pantalla se carga
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // Llamada a la API para obtener los primeros 151 Pokémon (Generación 1)
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");//AQUI SE LIMITO A SOLO 151
        const data = await response.json();

        // Transformamos los resultados para agregar una imagen de cada Pokémon
        const detailedData = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const pokeData = await res.json();
            return {
              name: pokeData.name,
              id: pokeData.id,
              image: pokeData.sprites.other["official-artwork"].front_default,
              types: pokeData.types.map((t: any) => t.type.name),
            };
          })
        );

        // Guardamos los datos en el estado
        setPokemonList(detailedData);
      } catch (error) {
        console.error("Error cargando Pokémon:", error);
      } finally {
        // Terminamos la carga
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []); // ← El array vacío significa que se ejecuta una sola vez

  // 🔹 Si todavía está cargando, mostramos un indicador
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#facc15" />
        <Text className="mt-3 text-gray-700">Cargando Pokédex...</Text>
      </View>
    );
  }

  //  Renderizamos la lista con FlatList (mejor rendimiento que ScrollView)
  return (
    <View className="flex-1 bg-[#FF9B8A] p-3">
      {/* Encabezado de la Pokédex */}
      <Text className="text-3xl font-bold text-[#470B00] text-center mb-4">
        Pokédex (Gen 1)
      </Text>

      {/* FlatList muestra cada Pokémon con imagen y nombre */}
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Muestra 2 columnas
        renderItem={({ item }) => (
          <TouchableOpacity
            // Al presionar un Pokémon, navegamos a la pantalla del Pokémon
            onPress={() => router.push(`/PokemonScreen?id=${item.id}`)}
            className="flex-1 bg-white m-2 p-3 rounded-2xl items-center shadow"
          >
            <Image
              source={{ uri: item.image }}
              className="w-24 h-24"
              resizeMode="contain"
            />
            <Text className="text-lg font-bold capitalize mt-2 text-gray-800">
              {item.name}
            </Text>
            <Text className="text-gray-600 text-sm">
              {item.types.join(", ")}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

import "@/global.css";
// app/PokemonScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
// Hook de Expo Router para leer parámetros pasados por la URL (como el id del Pokémon)
import { useLocalSearchParams } from "expo-router";

export default function PokemonScreen() {
  // Obtenemos el parámetro `id` que viene desde el menú (por ejemplo: /PokemonScreen?id=25)
  const { id } = useLocalSearchParams();

  // Estado que guarda los datos del Pokémon actual
  const [pokemon, setPokemon] = useState<any>(null);
  // Estado que controla si se está cargando la información
  const [loading, setLoading] = useState(true);
  // Estado para mostrar u ocultar las estadísticas base
  const [showStats, setShowStats] = useState(false);

  // 🔹 useEffect se ejecuta cada vez que cambia el id (cuando abres otro Pokémon)
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Llamada a la API: si no hay id, se usa por defecto "psyduck"
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id || "psyduck"}`);
        const data = await res.json(); // Convertimos la respuesta a JSON
        setPokemon(data); // Guardamos los datos del Pokémon
      } catch (error) {
        console.error("Error cargando Pokémon:", error);
      } finally {
        // Desactivamos el estado de carga
        setLoading(false);
      }
    };

    fetchPokemon(); // Llamamos la función al cargar el componente
  }, [id]); // Se ejecuta nuevamente si cambia el id

  // 🔹 Si los datos aún se están cargando, mostramos un indicador
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-yellow-50">
        <ActivityIndicator size="large" color="#facc15" />
        <Text className="text-gray-700 mt-3">Cargando Pokémon...</Text>
      </View>
    );
  }

  // 🔹 Si no se pudo cargar el Pokémon (error o sin datos)
  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se pudo cargar el Pokémon 😢</Text>
      </View>
    );
  }

  // 🔹 Interfaz principal del Pokémon
  return (
    <View className="flex-1 bg-yellow-100 justify-center items-center p-6">
      {/* Nombre del Pokémon */}
      <Text className="text-3xl font-bold text-yellow-800 mb-2 capitalize">
        {pokemon.name}
      </Text>

      {/* Imagen oficial del Pokémon */}
      <Image
        source={{ uri: pokemon.sprites.other["official-artwork"].front_default }}
        className="w-52 h-52 mb-4"
        resizeMode="contain"
      />

      {/* Tipo(s), altura y peso */}
      <Text className="text-lg text-gray-700">
        Tipo: {pokemon.types.map((t: any) => t.type.name).join(", ")}
      </Text>
      <Text className="text-lg text-gray-700">Altura: {pokemon.height / 10} m</Text>
      <Text className="text-lg text-gray-700 mb-4">
        Peso: {pokemon.weight / 10} kg
      </Text>

      {/* Botón para mostrar u ocultar las estadísticas */}
      <TouchableOpacity
        onPress={() => setShowStats(!showStats)} // Cambia el estado entre mostrar/ocultar
        className="bg-yellow-500 px-6 py-2 rounded-2xl mt-3 shadow"
      >
        <Text className="text-white font-semibold">
          {showStats ? "Ocultar Stats" : "Ver Stats"}
        </Text>
      </TouchableOpacity>

      {/* Si showStats es true, se muestran las estadísticas base */}
      {showStats && (
        <View className="mt-4 w-full bg-white rounded-2xl p-4">
          <Text className="text-center font-bold text-gray-800 text-xl mb-2">
            Estadísticas base
          </Text>

          {/* Listado de las estadísticas del Pokémon (ej: HP, Ataque, Defensa, etc.) */}
          {pokemon.stats.map((s: any, index: number) => (
            <View key={index} className="flex-row justify-between mb-1">
              <Text className="capitalize text-gray-600">{s.stat.name}</Text>
              <Text className="font-bold text-gray-800">{s.base_stat}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

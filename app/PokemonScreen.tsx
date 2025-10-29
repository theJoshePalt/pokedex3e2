import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";

// 🔹 Componente principal de la pantalla
export default function PokemonScreen() {

  // 🧩 Estados (useState)
 
  const [pokemon, setPokemon] = useState<any>(null); // Guarda los datos del Pokémon obtenido de la API
  
  const [loading, setLoading] = useState(true);// Controla si la app está cargando los datos (true = cargando)
  
  const [showStats, setShowStats] = useState(false);// Controla si se muestran o no las estadísticas base

  //useEffect: se ejecuta una sola vez cuando la pantalla carga
  useEffect(() => {
    // Función asíncrona para obtener los datos del Pokémon desde la PokeAPI
    const fetchPokemon = async () => {
      try {
        // Llamado a la API (en este caso del Pokémon Psyduck)
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/psyduck");
        // Convertimos la respuesta en JSON
        const data = await res.json();
        // Guardamos los datos en el estado
        setPokemon(data);
      } catch (error) {
        // Si ocurre un error, se muestra en consola
        console.error("Error cargando Pokémon:", error);
      } finally {
        // Cuando termina (éxito o error), desactiva el estado de carga
        setLoading(false);
      }
    };

    // Llamamos a la función para obtener los datos
    fetchPokemon();
  }, []); // [] → asegura que solo se ejecute una vez al montar el componente

  //  Mientras se cargan los datos, muestra un indicador de carga
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-yellow-50">
        {/* Spinner de carga */}
        <ActivityIndicator size="large" color="#facc15" />
        {/* Mensaje de carga */}
        <Text className="text-gray-700 mt-3">Cargando Psyduck...</Text>
      </View>
    );
  }

  //  Si no se pudo obtener el Pokémon, muestra un mensaje de error
  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se pudo cargar el Pokémon 😢</Text>
      </View>
    );
  }

  // ✅ Si ya se cargaron los datos, se muestra toda la información
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

      {/* Tipo(s) del Pokémon */}
      <Text className="text-lg text-gray-700">
        Tipo: {pokemon.types.map((t: any) => t.type.name).join(", ")}
      </Text>

      {/* Altura y peso (la API los da en decímetros y hectogramos, por eso se dividen entre 10) */}
      <Text className="text-lg text-gray-700">Altura: {pokemon.height / 10} m</Text>
      <Text className="text-lg text-gray-700 mb-4">
        Peso: {pokemon.weight / 10} kg
      </Text>

      {/* Botón para mostrar/ocultar las estadísticas base */}
      <TouchableOpacity
        onPress={() => setShowStats(!showStats)} // Cambia el estado al tocar el botón
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

          {/* Recorremos el arreglo de stats y mostramos cada una */}
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

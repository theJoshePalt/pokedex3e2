import "@/global.css";

import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Permite recibir parámetros desde la navegación (por ejemplo, el ID del Pokémon)

// 🎨 Mapa de colores según el tipo de Pokémon (Primera generación)
// Cada tipo tiene un color que se usará como fondo dinámico
const typeColors: Record<string, string> = {
  fire: "#F08030",     //  Fuego → Naranja
  water: "#6890F0",    //  Agua → Azul
  grass: "#78C850",    //  Planta → Verde
  electric: "#F8D030", //  Eléctrico → Amarillo
  ice: "#98D8D8",      //  Hielo → Celeste
  rock: "#B8A038",     //  Roca → Marrón oscuro
  flying: "#A890F0",   //  Volador → Lila
  psychic: "#F85888",  //  Psíquico → Rosa fuerte
  poison: "#A040A0",   //  Veneno → Morado
  fighting: "#C03028", //  Lucha → Rojo oscuro
  ground: "#E0C068",   //  Tierra → Amarillo terroso
  ghost: "#705898",    //  Fantasma → Púrpura
  bug: "#A8B820",      //  Bicho → Verde amarillento
  normal: "#A8A878",   //  Normal → Beige grisáceo
  dragon: "#7038F8",   //  Dragón → Violeta brillante
};

export default function PokemonScreen() {
  // Obtiene el parámetro "id" desde la URL (por ejemplo, /pokemon/25 para Pikachu)
  const { id } = useLocalSearchParams();

  // useState: variables de estado
  const [pokemon, setPokemon] = useState<any>(null);  // Guarda la información del Pokémon
  const [loading, setLoading] = useState(true);       // Controla el indicador de carga
  const [showStats, setShowStats] = useState(false);  // Muestra u oculta las estadísticas

  // 🌀 useEffect: se ejecuta al cargar la pantalla o cuando cambia el ID del Pokémon
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // 📡 Llama a la API de Pokémon con el ID recibido o por defecto usa "psyduck"
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id || "psyduck"}`);
        const data = await res.json(); // Convierte la respuesta a JSON
        setPokemon(data);              // Guarda los datos del Pokémon
      } catch (error) {
        console.error("Error cargando Pokémon:", error);
      } finally {
        setLoading(false);             // Desactiva el estado de carga al final
      }
    };

    fetchPokemon(); // Ejecuta la función al iniciar
  }, [id]); // Dependencia: se ejecuta cuando cambia el ID

  // 💫 Mientras los datos se cargan, muestra un spinner animado
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#facc15" />
        <Text className="text-gray-700 mt-3">Cargando Pokémon...</Text>
      </View>
    );
  }

  // 🚨 Si no se pudo obtener información del Pokémon, muestra un mensaje de error
  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se pudo cargar el Pokémon 😢</Text>
      </View>
    );
  }

  // 🎨 Determina el tipo principal del Pokémon y su color base
  const mainType = pokemon.types[0].type.name;      // Ejemplo: "fire", "water", etc.
  const bgColor = typeColors[mainType] || "#EEE";   // Si no se encuentra, usa gris claro
  const textColor = mainType === "electric" ? "#2E2E2E" : "white"; // Eléctrico tiene texto oscuro

  // 🧱 Interfaz principal de la pantalla del Pokémon
  return (
    <View
      className="flex-1 justify-center items-center p-6"
      style={{ backgroundColor: bgColor }} // Fondo cambia dinámicamente por tipo
    >
      {/* 🔤 Nombre del Pokémon */}
      <Text
        className="text-4xl font-bold mb-2 capitalize"
        style={{ color: textColor }}
      >
        {pokemon.name}
      </Text>

      {/* 🖼️ Imagen oficial del Pokémon */}
      <Image
        source={{ uri: pokemon.sprites.other["official-artwork"].front_default }}
        className="w-56 h-56 mb-4"
        resizeMode="contain"
      />

      {/* 📋 Información básica */}
      <Text className="text-lg mb-1" style={{ color: textColor }}>
        Tipo: {pokemon.types.map((t: any) => t.type.name).join(", ")}
      </Text>
      <Text className="text-lg mb-1" style={{ color: textColor }}>
        Altura: {pokemon.height / 10} m
      </Text>
      <Text className="text-lg mb-4" style={{ color: textColor }}>
        Peso: {pokemon.weight / 10} kg
      </Text>

      {/* 🔘 Botón para mostrar u ocultar estadísticas */}
      <TouchableOpacity
        onPress={() => setShowStats(!showStats)}
        className="px-6 py-2 rounded-2xl mt-3 shadow"
        style={{
          backgroundColor: textColor, // Color del botón opuesto al fondo
        }}
      >
        <Text
          className="font-semibold"
          style={{
            color: bgColor, // Texto del botón del mismo color que el fondo
          }}
        >
          {showStats ? "Ocultar Stats" : "Ver Stats"}
        </Text>
      </TouchableOpacity>

      {/* 📊 Sección de estadísticas base (solo si showStats es true) */}
      {showStats && (
        <View className="mt-4 w-full rounded-2xl p-4 bg-white/20">
          <Text
            className="text-center font-bold text-xl mb-2"
            style={{ color: textColor }}
          >
            Estadísticas base
          </Text>

          {/* 🔹 Recorre el array de stats y muestra cada una con su valor */}
          {pokemon.stats.map((s: any, index: number) => (
            <View key={index} className="flex-row justify-between mb-1">
              <Text className="capitalize" style={{ color: textColor }}>
                {s.stat.name}
              </Text>
              <Text className="font-bold" style={{ color: textColor }}>
                {s.base_stat}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
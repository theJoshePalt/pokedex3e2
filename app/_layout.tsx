import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="MenuScreen" options={{ title: "Bonjour", headerStyle: {
            backgroundColor: "#FFAA00",//color del fondo del encabezado.
          },}} />
      <Stack.Screen name="PokemonScreen" options={{ title: "Detalle del Pokémon" ,headerStyle: {
            backgroundColor: "#FFAA00",//color del fondo del encabezado.
          },}} />
    </Stack>
  );
}

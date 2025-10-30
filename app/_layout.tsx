import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="MenuScreen" options={{ title: "Bonjour", headerStyle: {
            backgroundColor: "#bd0003",//color del fondo del encabezado.
          },}} />
      <Stack.Screen name="PokemonScreen" options={{ title: "Volver al Menu" ,headerStyle: {
            backgroundColor: "#FFC2B8",//color del fondo del encabezado.
          },}} />
    </Stack>
  );
}

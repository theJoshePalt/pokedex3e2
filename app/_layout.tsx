import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="PokemonScreen"
        options={{
          title: "Bonjour",
          headerStyle: {
            backgroundColor: "#FFAA00",//color del fondo del encabezado.
          },
          headerTintColor: "#fff",//color de las letras
          headerTitleStyle: {
            fontWeight: "bold",//tipo de letra del encabezado
          },
          
        }}
      />
    </Stack>
  );
}

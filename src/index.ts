import colors from "colors";
import server from "./server";

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(
    colors.cyan.italic(
      `Servidor escuchando en http://localhost:${PORT}`
    )
  );
});

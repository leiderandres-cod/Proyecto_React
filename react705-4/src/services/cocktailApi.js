const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// TheCocktailDB es 100% pública y gratuita: no necesita apikey ni registro.
// Trae cócteles cuyo nombre empiece por una letra, ej: search.php?f=a
async function buscarPorLetra(letra) {
  const res = await fetch(`${BASE_URL}/search.php?f=${letra}`);
  if (!res.ok) throw new Error("No se pudo cargar el catálogo de cócteles");
  const data = await res.json();
  return data.drinks || [];
}

// Busca cócteles por nombre, ej: search.php?s=margarita
export async function buscarCoctelesPorNombre(nombre) {
  const res = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(nombre)}`
  );
  if (!res.ok) throw new Error("No se pudo buscar el cóctel");
  const data = await res.json();
  return (data.drinks || []).map(adaptarCoctel);
}

// Trae varios cócteles combinando distintas letras iniciales,
// hasta juntar la cantidad que pide "limit"
export async function obtenerCocteles(limit = 12) {
  const letras = ["m", "a", "b", "c", "d", "s"];
  let crudos = [];

  for (const letra of letras) {
    if (crudos.length >= limit) break;
    const drinks = await buscarPorLetra(letra);
    crudos = crudos.concat(drinks);
  }

  // por si alguna letra trajo el mismo cóctel repetido
  const vistos = new Set();
  const unicos = crudos.filter((d) => {
    if (vistos.has(d.idDrink)) return false;
    vistos.add(d.idDrink);
    return true;
  });

  return unicos.slice(0, limit).map(adaptarCoctel);
}

// Trae el detalle completo de un cóctel por su id
export async function obtenerCoctelPorId(id) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el detalle del cóctel");
  const data = await res.json();
  return adaptarCoctel(data.drinks?.[0]);
}

// La API guarda cada ingrediente y su medida en campos sueltos
// (strIngredient1..15 / strMeasure1..15). Los juntamos en una sola lista.
function extraerIngredientes(drink) {
  const ingredientes = [];

  for (let i = 1; i <= 15; i++) {
    const ingrediente = drink[`strIngredient${i}`];
    const medida = drink[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim()) {
      ingredientes.push({
        nombre: ingrediente.trim(),
        medida: medida ? medida.trim() : "",
      });
    }
  }

  return ingredientes;
}

// Convierte la forma "cruda" de TheCocktailDB a lo que usa nuestra tienda
function adaptarCoctel(drink) {
  if (!drink) return null;

  return {
    id: drink.idDrink,
    name: drink.strDrink,
    image: drink.strDrinkThumb,
    categoria: drink.strCategory,
    vaso: drink.strGlass,
    alcoholico: drink.strAlcoholic,
    // usamos la instrucción en español cuando está disponible
    descripcion: drink.strInstructionsES?.trim() || drink.strInstructions,
    ingredientes: extraerIngredientes(drink),
  };
}

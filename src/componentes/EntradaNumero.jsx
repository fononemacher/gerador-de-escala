import { entrada } from "../estilos";

/** Input numerico controlado — campo vazio equivale a zero (ou ao minimo). */
export default function EntradaNumero({ valor, onChange, min = 0, max = 99, estilo, ...resto }) {
  function aoAlterar(evento) {
    const texto = evento.target.value;
    if (texto === "") {
      onChange(min);
      return;
    }
    const numero = Number(texto);
    if (Number.isNaN(numero)) return;
    onChange(Math.min(max, Math.max(min, Math.trunc(numero))));
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={valor}
      onChange={aoAlterar}
      style={{ ...entrada, ...estilo }}
      {...resto}
    />
  );
}

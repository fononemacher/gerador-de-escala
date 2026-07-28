import { cartao, tituloCartao, subtituloCartao } from "../estilos";

/** Contêiner branco padrao, com titulo e subtitulo opcionais. */
export default function Cartao({ titulo, subtitulo, icone, acao, children, estilo }) {
  return (
    <section style={{ ...cartao, ...estilo }}>
      {titulo ? (
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={tituloCartao}>
              {icone}
              {titulo}
            </h2>
            {subtitulo ? <p style={subtituloCartao}>{subtitulo}</p> : null}
          </div>
          {acao}
        </header>
      ) : null}
      {children}
    </section>
  );
}

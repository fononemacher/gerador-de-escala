import { rotulo } from "../estilos";

/** Rotulo + controle de formulario, com largura flexivel. */
export default function Campo({ label, children, flex = 1, largura, estilo }) {
  return (
    <div style={{ flex: largura ? "none" : flex, width: largura, minWidth: 0, ...estilo }}>
      {label ? <label style={rotulo}>{label}</label> : null}
      {children}
    </div>
  );
}

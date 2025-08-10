import sanitize from "sanitize-html";

/**
 * UTIL para limpiar el HTML y prevenir que los creadores de blog suban contenido con scripts incrustados, previniendo así XSS
 * @param {string} htmlPorLimpiar - El html por sanitizar.
 * @returns {string} El HTML limpio.
 */
export default function sanitizarHtml(htmlPorLimpiar) {
    const htmlLimpio = sanitize(htmlPorLimpiar)
    return htmlLimpio
}
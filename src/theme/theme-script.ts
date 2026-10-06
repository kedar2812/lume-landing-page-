/** Where the visitor's light or dark choice is kept (their browser only). */
export const THEME_KEY = "lume-site-theme";

/**
 * Runs in <head> before anything paints: the remembered choice, else the system's, on <html data-theme>, so a
 * dark visitor never sees a flash of light. Storage may be blocked: then the system decides.
 */
export const themeScript = `(function(){var c;try{c=localStorage.getItem("${THEME_KEY}")}catch(e){}
var d=c==="dark"||c==="light"?c:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
var r=document.documentElement;r.dataset.theme=d;r.dataset.choice=c==="dark"||c==="light"?c:"auto"})()`;

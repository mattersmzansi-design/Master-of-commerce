import { useEffect, useRef } from "react";

// Reusable TradingView widget wrapper. Injects TradingView's embed script
// (loaded from s3.tradingview.com) with a JSON config, into a container div.
//
// `kind`    — TradingView widget name, e.g. "advanced-chart", "ticker-tape",
//             "market-overview", "symbol-info", "mini-symbol-overview",
//             "symbol-overview" (see https://www.tradingview.com/widget/).
// `config`  — widget-specific config object; brand tokens are merged in below.
// `height`  — outer container height in px.
//
// Colours default to the site's brand — light theme, warm off-white paper,
// dark teal ink, cyan accent for up moves. Any keys in `config` win over the
// defaults so individual embeds can tweak the look.

const BRAND_DEFAULTS = {
  colorTheme: "light",
  locale: "en",
  isTransparent: false,
  backgroundColor: "#FFFFFF",
  gridLineColor: "rgba(1, 32, 48, 0.06)",
  plotLineColorGrowing: "#00D2F0",  // brand cyan for up
  plotLineColorFalling: "#F24E01",  // brand orange for down
  belowLineFillColorGrowing: "rgba(0, 210, 240, 0.10)",
  belowLineFillColorFalling: "rgba(242, 78, 1, 0.08)",
  scaleFontColor: "#5A727C",
  autosize: true,
};

export default function TradingViewWidget({ kind, config, height = 420 }) {
  const container = useRef(null);
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    // Clear any previous script/widget so hot reload + prop changes rebuild cleanly.
    node.innerHTML = "";

    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = "100%";
    inner.style.width = "100%";
    node.appendChild(inner);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${kind}.js`;
    script.innerHTML = JSON.stringify({ ...BRAND_DEFAULTS, ...config });
    node.appendChild(script);

    return () => { node.innerHTML = ""; };
  }, [kind, configKey]);

  return (
    <div className="tradingview-widget-container" ref={container}
      style={{ height, width: "100%", background: "#FFFFFF", borderRadius: 12, overflow: "hidden" }} />
  );
}

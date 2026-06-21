export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var k="sentinel-theme",t=localStorage.getItem(k),d=document.documentElement,m={"dark":"#000000","light":"#eef4fb"};if(t!=="light"&&t!=="dark")t="dark";d.setAttribute("data-theme",t);d.style.colorScheme=t;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",m[t]);}catch(e){document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}})();`,
      }}
    />
  );
}

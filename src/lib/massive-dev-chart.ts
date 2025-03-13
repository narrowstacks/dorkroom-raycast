import Fuse from "fuse.js";

interface MassiveDevChartFilm {
  value: string;
  displayName: string;
}

// Parse the film options into a structured format
export const massiveDevChartFilms: MassiveDevChartFilm[] = [
  { value: "%CHM%", displayName: "Adox CHM" },
  { value: "Adox CHS%", displayName: "Adox CHS" },
  { value: "Adox CHS 100 II", displayName: "Adox CHS 100 II" },
  { value: "Adox CMS 20%", displayName: "Adox CMS 20 II" },
  { value: "Adox %HR%", displayName: "Adox HR-50/IR-HR" },
  { value: "Adox Ort 25", displayName: "Adox Ort 25" },
  { value: "Adox Pan 25", displayName: "Adox Pan 25" },
  { value: "Adox Scala%", displayName: "Adox Scala" },
  { value: "Adox Silvermax", displayName: "Adox Silvermax" },
  { value: "AgfaPhoto APX 100", displayName: "AgfaPhoto APX 100" },
  { value: "AgfaPhoto APX 400", displayName: "AgfaPhoto APX 400" },
  { value: "Agfa Cinerex%", displayName: "Agfa Cinerex" },
  { value: "Agfa Copex%", displayName: "Agfa Copex" },
  { value: "Agfa Scala%", displayName: "Agfa Scala" },
  { value: "%Aviphot%", displayName: "Agfa Aviphot" },
  { value: "Argenti%", displayName: "Argenti films" },
  { value: "Arista EDU D%", displayName: "Arista EDU DX" },
  { value: "Arista EDU U%", displayName: "Arista EDU Ultra" },
  { value: "Arista Ortho Litho", displayName: "Arista Ortho Litho" },
  { value: "Arista Premium%", displayName: "Arista Premium" },
  { value: "Arista%", displayName: "Arista (All Films)" },
  { value: "Imago%", displayName: "Ars-imago films" },
  { value: "Astrum%", displayName: "Astrum films" },
  { value: "Bergger Pancro 400", displayName: "Bergger Pancro 400" },
  { value: "Bluefire%", displayName: "Bluefire films" },
  { value: "BCG P-400", displayName: "BCG P-400" },
  { value: "CatLABS%", displayName: "CatLABS films" },
  { value: "CHM % Universal", displayName: "CHM Universal" },
  { value: "CineStill BwXX", displayName: "CineStill BwXX" },
  { value: "Contrasto%", displayName: "Contrasto 200" },
  { value: "%Dry Plates%", displayName: "Dry Plates" },
  { value: "Dubblefilm%", displayName: "Dubblefilm films" },
  { value: "Eastman%", displayName: "Eastman films" },
  { value: "Efke 25", displayName: "Efke 25" },
  { value: "Efke 50", displayName: "Efke 50" },
  { value: "Efke 100", displayName: "Efke 100" },
  { value: "Efke IR820", displayName: "Efke IR820" },
  { value: "ERA%", displayName: "ERA films" },
  { value: "Etude%", displayName: "Etude Pan" },
  { value: "Ferrania Orto", displayName: "Ferrania Orto" },
  { value: "Ferrania P30", displayName: "Ferrania P30" },
  { value: "Filmotec%", displayName: "Filmotec films" },
  { value: "Fomapan 100", displayName: "Fomapan 100" },
  { value: "Fomapan 200", displayName: "Fomapan 200" },
  { value: "Fomapan 400", displayName: "Fomapan 400" },
  { value: "Foma Ortho 400", displayName: "Foma Ortho 400" },
  { value: "Foma Retropan 320", displayName: "Foma Retropan 320" },
  { value: "FPP%", displayName: "FPP films" },
  { value: "Fujifilm%", displayName: "Fuji HR/RX/C" },
  { value: "Fuji Neopan 100 Acros%", displayName: "Fuji Neopan Acros II" },
  { value: "Fuji Neopan 100ss", displayName: "Fuji Neopan 100ss" },
  { value: "Fuji Neopan 400", displayName: "Fuji Neopan 400" },
  { value: "Fuji Neopan 1600", displayName: "Fuji Neopan 1600" },
  { value: "Fuji Eterna-RDS 4791", displayName: "Fuji RDS 4791" },
  { value: "gufa%", displayName: "gufa.Labs" },
  { value: "Holga 400", displayName: "Holga 400" },
  { value: "Ilford Pan F%", displayName: "Ilford Pan F+" },
  { value: "Ilford FP4%", displayName: "Ilford FP4+" },
  { value: "Ilford HP5%", displayName: "Ilford HP5+" },
  { value: "Ilford Delta 100%", displayName: "Ilford Delta 100" },
  { value: "Ilford Delta 400%", displayName: "Ilford Delta 400" },
  { value: "Ilford Delta 3200%", displayName: "Ilford Delta 3200" },
  { value: "Ilford SFX 200%", displayName: "Ilford SFX 200" },
  { value: "Ilford Pan 100", displayName: "Ilford Pan 100" },
  { value: "Ilford Pan 400", displayName: "Ilford Pan 400" },
  { value: "Ilford Surveillance%", displayName: "Ilford Surveillance" },
  { value: "Ilford Ortho%", displayName: "Ilford Ortho+" },
  { value: "Ilford XP2%", displayName: "Ilford XP2" },
  { value: "Imago 320%", displayName: "Imago 320" },
  { value: "JCH%", displayName: "JCH Streetpan" },
  { value: "Kentmere%", displayName: "Kentmere films" },
  { value: "Kiki%", displayName: "Kiki Pan 320" },
  { value: "Kodak 2%", displayName: "Kodak 2*** films" },
  { value: "Kodak BW400CN", displayName: "Kodak BW400CN" },
  { value: "Kodak Direct Positive%", displayName: "Kodak Direct Positive" },
  { value: "Kodak Double-X%", displayName: "Kodak Double-X" },
  { value: "Kodak Hawkeye", displayName: "Kodak Hawkeye" },
  { value: "Kodak HIE%", displayName: "Kodak HIE Infrared" },
  { value: "Kodak Plus-X", displayName: "Kodak Plus-X" },
  { value: "Kodak TMax 100", displayName: "Kodak TMax 100" },
  { value: "Kodak TMax 400", displayName: "Kodak TMax 400" },
  { value: "Kodak TMax P3200", displayName: "Kodak TMax P3200" },
  { value: "Kodak Tri-X 320", displayName: "Kodak Tri-X 320" },
  { value: "Kodak Tri-X 400", displayName: "Kodak Tri-X 400" },
  { value: "Kosmo Foto%", displayName: "Kosmo Foto films" },
  { value: "Legacy Pro%", displayName: "Legacy Pro films" },
  { value: "Lomography Babylon%", displayName: "Lomo Babylon" },
  { value: "Lomography Berlin%", displayName: "Lomo Berlin" },
  { value: "Lomography Earl Grey%", displayName: "Lomo Earl Grey" },
  { value: "Lomography Lady Grey%", displayName: "Lomo Lady Grey" },
  { value: "Lomography Fantome%", displayName: "Lomo Fantome" },
  { value: "Lomography Orca%", displayName: "Lomo Orca 110" },
  { value: "Lomography Potsdam%", displayName: "Lomo Potsdam" },
  { value: "Low Speed B&W%", displayName: "Low Speed B&W" },
  { value: "Lucky%", displayName: "Lucky films" },
  { value: "Maco%", displayName: "Maco films" },
  { value: "New Classic%", displayName: "New Classic EZ400" },
  { value: "NoColor%", displayName: "NoColorStudio films" },
  { value: "Orwo%", displayName: "Orwo films" },
  { value: "Polypan%", displayName: "Polypan F" },
  { value: "ReraPan%", displayName: "ReraPan" },
  { value: "Rollei AT%", displayName: "Rollei ATP/ATO" },
  { value: "Rollei Blackbird", displayName: "Rollei Blackbird" },
  { value: "Rollei Infrared IR400", displayName: "Rollei Infrared IR400" },
  { value: "Rollei Ortho%", displayName: "Rollei Ortho" },
  { value: "Rollei Paul%", displayName: "Rollei Paul & Reinhold" },
  { value: "Rollei Retro 80S", displayName: "Rollei Retro 80S" },
  { value: "Rollei Retro 400S", displayName: "Rollei Retro 400S" },
  { value: "Rollei RPX 25", displayName: "Rollei RPX 25" },
  { value: "Rollei RPX 100", displayName: "Rollei RPX 100" },
  { value: "Rollei RPX 400", displayName: "Rollei RPX 400" },
  { value: "Rollei Superpan%", displayName: "Rollei Superpan" },
  { value: "Santa%", displayName: "Santa RAE 1000" },
  { value: "Shanghai%", displayName: "Shanghai films" },
  { value: "Silberra%", displayName: "Silberra films" },
  { value: "Street Candy%", displayName: "Street Candy" },
  { value: "Svema%", displayName: "Svema films" },
  { value: "Tasma%", displayName: "Tasma films" },
  { value: "Type-D%", displayName: "Type-D films" },
  { value: "Ultrafine%", displayName: "Ultrafine films" },
  { value: "Washi%", displayName: "Washi films" },
];

// Initialize Fuse instance for fuzzy searching
const fuse = new Fuse(massiveDevChartFilms, {
  keys: ["displayName"],
  threshold: 0.4,
  includeScore: true,
});

export function findMatchingFilm(brand: string, name: string): MassiveDevChartFilm | null {
  const searchString = `${brand} ${name}`;
  
  // First try exact match
  const exactMatch = massiveDevChartFilms.find(film => {
    const normalizedFilm = film.displayName.toLowerCase();
    const normalizedSearch = searchString.toLowerCase();
    return normalizedFilm.includes(normalizedSearch) || normalizedSearch.includes(normalizedFilm);
  });

  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, try fuzzy search
  const results = fuse.search(searchString);
  if (results.length > 0 && results[0].score && results[0].score < 0.4) {
    return results[0].item;
  }

  // Try matching just the brand
  const brandResults = fuse.search(brand);
  if (brandResults.length > 0 && brandResults[0].score && brandResults[0].score < 0.4) {
    return brandResults[0].item;
  }

  return null;
} 
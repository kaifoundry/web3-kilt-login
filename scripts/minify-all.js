
import { execSync } from "child_process";

import fs from "fs"
import path from "path";
const inputDir = "dist";
const outputDir = "dist/min";

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith(".js")) {
    const input = path.join(inputDir, file);
    const output = path.join(outputDir, file.replace(".js", ".min.js"));
    execSync(`terser ${input} -c -m -o ${output}`);
    console.log(`Minified: ${file} → ${path.basename(output)}`);
  }
});

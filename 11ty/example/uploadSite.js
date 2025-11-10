import fs from "fs";
import path from "path";
import https from "https";
import FormData from "form-data";

const API_KEY = process.env.NEOCITIES_API_KEY;
const OUTPUT_DIR = "_site";

if (!API_KEY) {
  console.error("error: missing NEOCITIES_API_KEY");
  process.exit(1);
}

const uploadFile = async (filePath, remotePath) => {
  const form = new FormData();
  form.append(remotePath, fs.createReadStream(filePath));

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "neocities.org",
        path: "/api/upload",
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          ...form.getHeaders(),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            console.log(`✓ ${remotePath}`);
          } else {
            console.error(`X ${remotePath}: ${data}`);
          }
          resolve();
        });
      }
    );

    req.on("error", (err) => {
      console.error(`X ${remotePath}: ${err.message}`);
      resolve();
    });

    form.pipe(req);
  });
};

const getFiles = (dir) => {
  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
};

const uploadSite = async () => {
  console.log("uploading to Neocities...");
  const files = getFiles(OUTPUT_DIR);

  for (const file of files) {
    const remotePath = path.relative(OUTPUT_DIR, file);
    await uploadFile(file, remotePath);
  }

  console.log("your site has been uploaded!");
};

uploadSite();
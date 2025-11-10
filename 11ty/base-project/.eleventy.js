import CleanCSS from "clean-css";
import { minify } from "terser";
import fs from "fs";
import path from "path";

export default (eleventyConfig) => {
  // Fix file watching in WSL
  eleventyConfig.setChokidarConfig({
    usePolling: true,
    interval: 500,
  });

  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      if (inputPath.startsWith("./src/styles/")) {
        return async () => {
          const result = new CleanCSS({
            inline: ["local"],
            rebaseTo: path.dirname(inputPath),
          }).minify([inputPath]);

          if (result.errors && result.errors.length > 0) {
            console.error("CleanCSS errors:", result.errors);
          }

          return result.styles;
        };
      }
      return async () => inputContent;
    },
    compileOptions: {
      permalink: function (inputContent, inputPath) {
        if (inputPath.startsWith("./src/styles/")) {
          return (data) => inputPath.replace("./src/styles/", "styles/");
        }
        return false;
      },
    },
  });

  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", {
    outputFileExtension: "js",
    compile: async function (inputContent, inputPath) {
      if (inputPath.startsWith("./src/scripts/")) {
        return async () => {
          const minified = await minify(inputContent);
          return minified.code || inputContent;
        };
      }
      return async () => inputContent;
    },
    compileOptions: {
      permalink: function (inputContent, inputPath) {
        if (inputPath.startsWith("./src/scripts/")) {
          return (data) => inputPath.replace("./src/scripts/", "scripts/");
        }
        return false;
      },
    },
  });

  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("libs");

  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.addWatchTarget("src/styles/");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html", "njk", "css", "js"],
    htmlTemplateEngine: "njk",
  };
};

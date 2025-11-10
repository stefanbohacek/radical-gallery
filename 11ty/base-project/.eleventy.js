import CleanCSS from "clean-css";
import { minify } from "terser";

export default (eleventyConfig) => {
  // Fix file watching in WSL https://www.11ty.dev/docs/watch-serve/#advanced-chokidar-configuration
  eleventyConfig.setChokidarConfig({
    usePolling: true,
    interval: 500,
  });

  // CSS minification
  eleventyConfig.addTransform("cssmin", function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".css")) {
      return new CleanCSS({}).minify(content).styles;
    }
    return content;
  });

  // JS minification
  eleventyConfig.addTransform("jsmin", async function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".js")) {
      const minified = await minify(content);
      return minified.code;
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("libs");
  eleventyConfig.addPassthroughCopy({"src/scripts": "scripts"});
  eleventyConfig.addPassthroughCopy({"src/styles": "styles"});
  
  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.addWatchTarget("src/styles/");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "njk"],
    htmlTemplateEngine: "njk"
  };
}
import createMDX from "@next/mdx";
const withMDX = createMDX({ extension: /\.mdx?$/ });
export default withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {},
});

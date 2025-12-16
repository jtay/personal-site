import type { API } from "@strapi/client";
import type { ApiBlogPostBlogPost } from "../../backend/types/generated/contentTypes.d.ts"


export type BlogPostDocument = API.DocumentResponseCollection["data"][number] & ApiBlogPostBlogPost["attributes"];

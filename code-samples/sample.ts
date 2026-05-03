// TypeScript sample: generics, decorators, async, unions, and template strings
import { readFile } from "node:fs/promises";

type Status = "draft" | "published" | "archived";

interface Article<TMeta extends Record<string, unknown> = Record<string, never>> {
  readonly id: string;
  title: string;
  status: Status;
  tags: string[];
  meta: TMeta;
}

function sealed(constructor: Function): void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
export class ArticleService<TMeta extends { author?: string }> {
  #cache = new Map<string, Article<TMeta>>();

  constructor(private readonly baseUrl: URL) {}

  async load(id: string): Promise<Article<TMeta> | null> {
    try {
      const raw = await readFile(`./fixtures/${id}.json`, "utf8");
      const article = JSON.parse(raw) as Article<TMeta>;
      this.#cache.set(article.id, article);
      return article;
    } catch (error: unknown) {
      console.warn("Could not load article", { id, error });
      return null;
    }
  }

  publish(article: Article<TMeta>, notify = true): string {
    const next = { ...article, status: "published" as const };
    const summary = `${next.title} -> ${next.status.toUpperCase()}`;

    if (notify && next.tags.includes("release")) {
      queueMicrotask(() => console.info("Published", summary));
    }

    return new URL(`/articles/${next.id}`, this.baseUrl).toString();
  }
}

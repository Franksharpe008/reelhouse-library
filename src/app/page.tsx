import { CatalogExplorer } from "@/components/CatalogExplorer";
import {
  catalog,
  editorialLanes,
  featuredSlug,
  genreList,
  heroStackSlugs,
} from "@/lib/catalog";

export default function Home() {
  return (
    <CatalogExplorer
      featuredSlug={featuredSlug}
      genres={genreList}
      heroStackSlugs={heroStackSlugs}
      items={catalog}
      lanes={editorialLanes}
    />
  );
}

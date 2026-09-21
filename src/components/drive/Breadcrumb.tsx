import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDriveStore } from "#/stores/driveStore";

export function Breadcrumb() {
  const { breadcrumbs, popTo } = useDriveStore();
  return (
    <BreadcrumbRoot>
      <BreadcrumbList className="flex-nowrap">
        {breadcrumbs.map((b, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <span key={`${b.id}-${i}`} className="flex items-center gap-1.5">
              {i !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="max-w-[160px] truncate border bg-secondary px-2 py-1 text-xs font-medium">
                    {b.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="max-w-[160px] cursor-pointer truncate border px-2 py-1 text-xs hover:bg-accent"
                    onClick={() => popTo(i)}
                  >
                    {b.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}

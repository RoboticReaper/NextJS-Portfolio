'use client'

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { usePathname} from 'next/navigation'
import { siteConfig } from "@/config/site";

export const Breadcrumb = () => {
    const pathname = usePathname()
    // based on the pathname, generate a breadcrumb
    // e.g. /projects -> Home / Projects
    // e.g. /projects/lhsschedule -> Home / Projects / LHS Schedule
    
    const pathnames = pathname.split('/').filter(Boolean).map((_, index, array) => (
        `/${array.slice(0, index + 1).join('/')}`
    ))


    return <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        {pathnames.map((path) => {
            const match = siteConfig.links.projectLinks.find((item) => item.href === path)

            return <BreadcrumbItem href={path} key={path}>{match?.label}</BreadcrumbItem>
        })}
    </Breadcrumbs>
}
